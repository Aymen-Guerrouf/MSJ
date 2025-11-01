import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import config from '../config/index.js';
import { sendPasswordResetEmail, sendEmailVerification } from '../config/email.service.js';
import logger from '../config/logger.config.js';

// Temporary storage for pending registrations (in production, use Redis)
const pendingRegistrations = new Map();

/**
 * Timing-safe comparison for hashed codes
 * Prevents timing attacks that could leak information about the code
 */
const timingSafeCompare = (a, b) => {
  if (!a || !b) return false;

  try {
    const bufferA = Buffer.from(a, 'hex');
    const bufferB = Buffer.from(b, 'hex');

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
};

/**
 * Register a new user - Step 1: Send verification code
 * User is NOT created in database until email is verified
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, age } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Check if there's a pending registration
    const existingPending = pendingRegistrations.get(email);
    if (existingPending && existingPending.expiresAt > Date.now()) {
      return res.status(400).json({
        success: false,
        message:
          'A verification code was already sent. Please check your email or wait before requesting a new one.',
        retryAfter: Math.ceil((existingPending.expiresAt - Date.now()) / 1000),
      });
    }

    // Generate 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the code for storage
    const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    // Store pending registration (expires in 1 hour)
    const expiresAt = Date.now() + 60 * 60 * 1000;
    pendingRegistrations.set(email, {
      name,
      email,
      password, // Will be hashed when user is created
      age,
      verificationCode: hashedCode,
      expiresAt,
      attempts: 0,
    });

    // Send verification email
    try {
      await sendEmailVerification({ name, email }, verificationCode);
    } catch (emailError) {
      pendingRegistrations.delete(email);
      logger.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message:
        'Verification code sent! Please check your email and enter the 4-digit code in the app.',
      data: {
        email,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        tokenVersion: user.tokenVersion,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
        expiresIn: config.jwt.expiresIn,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toJSON(),
    },
  });
};

/**
 * Logout user (invalidate all tokens)
 */
export const logout = async (req, res, next) => {
  try {
    // Increment token version to invalidate all existing tokens
    await req.user.incrementTokenVersion();

    res.json({
      success: true,
      message: 'Logout successful. All tokens have been invalidated.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Increment token version to invalidate all existing tokens
    await user.incrementTokenVersion();

    res.json({
      success: true,
      message: 'Password updated successfully. Please login again with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset with 4-digit code
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset code has been sent.',
      });
    }

    // Generate 4-digit reset code
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Store hashed code
    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    try {
      // Send email with 4-digit code
      await sendPasswordResetEmail(user, resetCode);

      res.json({
        success: true,
        message: 'A 4-digit password reset code has been sent to your email.',
      });
    } catch {
      // If email fails, clear reset code
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new Error('Failed to send password reset email. Please try again later.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with 4-digit code
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { code, password, confirmPassword } = req.body;

    // Additional check (validator already validates this)
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation does not match.',
      });
    }

    // Hash the code to match with database
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    // Find user with valid code and not expired
    const user = await User.findOne({
      resetPasswordCode: hashedCode,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordCode +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code.',
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Increment token version to invalidate all existing tokens
    await user.incrementTokenVersion();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email with 4-digit code - Step 2: Create user in database
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified and registered.',
      });
    }

    // Get pending registration
    const pending = pendingRegistrations.get(email);

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please register first.',
      });
    }

    // Check if expired
    if (pending.expiresAt < Date.now()) {
      pendingRegistrations.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please register again.',
      });
    }

    // Check rate limiting (max 5 attempts per code)
    if (pending.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new code.',
        canResendCode: true,
      });
    }

    // Hash the provided code and compare using timing-safe comparison
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    if (!timingSafeCompare(hashedCode, pending.verificationCode)) {
      pending.attempts += 1;
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code.',
        attemptsRemaining: 5 - pending.attempts,
      });
    }

    // Code is valid! Create user in database
    const userData = {
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: 'user', // All registrations are regular users
      isEmailVerified: true, // Already verified via code
    };

    // Only add age if it exists
    if (pending.age !== undefined) {
      userData.age = pending.age;
    }

    const user = new User(userData);

    await user.save();

    // Remove pending registration
    pendingRegistrations.delete(email);

    // Generate auth token for immediate login
    const authToken = jwt.sign(
      {
        userId: user._id,
        tokenVersion: user.tokenVersion,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Email verified successfully! Your account has been created.',
      data: {
        user: user.toJSON(),
        token: authToken,
        expiresIn: config.jwt.expiresIn,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend email verification code
 */
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified and registered.',
      });
    }

    // Check if there's a pending registration
    const pending = pendingRegistrations.get(email);
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please register first.',
      });
    }

    // Generate new 4-digit code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    // Update pending registration
    pending.verificationCode = hashedCode;
    pending.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Extend expiry by 24 hours
    pending.attempts = 0; // Reset attempts

    // Send new verification email
    try {
      await sendEmailVerification({ name: pending.name, email }, verificationCode);
    } catch (emailError) {
      logger.error('Failed to resend verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    res.json({
      success: true,
      message: 'A new verification code has been sent to your email.',
      data: {
        email,
        expiresIn: 24 * 60 * 60,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin dashboard - Example admin-only endpoint
 */
export const adminDashboard = async (req, res) => {
  try {
    // Get some stats (example)
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    res.json({
      success: true,
      message: 'Admin dashboard data',
      data: {
        stats: {
          totalUsers,
          adminUsers,
          regularUsers: totalUsers - adminUsers,
          verifiedUsers,
          unverifiedUsers: totalUsers - verifiedUsers,
        },
        adminInfo: {
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard',
    });
  }
};
