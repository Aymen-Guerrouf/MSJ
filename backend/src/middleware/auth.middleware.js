import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/user.model.js';
import logger from '../config/logger.config.js';

/**
 * Middleware to verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header

    const token = req.cookies.token;
    console.log(333, req.cookies.token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header must be in format: Bearer <token>',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log(decoded);

    // Check if user still exists
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token is invalid.',
      });
    }

    // Optional: Check token version for refresh token rotation
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Token has been invalidated. Please login again.',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    logger.error({ err: error }, 'Authentication error');
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Middleware to check if user has required role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  next();
};

/**
 * Middleware to check if user is super admin
 */
const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Super admin access required',
    });
  }

  next();
};

/**
 * Middleware to check if user is center admin
 */
const isCenterAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'center_admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Center admin access required',
    });
  }

  next();
};

export { authenticate, authorize, isAdmin, isSuperAdmin, isCenterAdmin };
