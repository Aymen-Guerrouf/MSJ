import { body, validationResult } from 'express-validator';

/**
 * Middleware to handle validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for password update
 */
const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Password confirmation does not match'),
];

/**
 * Validation rules for forgot password
 */
const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

/**
 * Validation rules for reset password with 6-digit code
 */
const resetPasswordValidation = [
  body('code')
    .notEmpty()
    .withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Reset code must be exactly 6 digits')
    .isNumeric()
    .withMessage('Reset code must contain only numbers'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for email verification with 6-digit code
 */
const verifyEmailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('code')
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be exactly 6 digits')
    .isNumeric()
    .withMessage('Verification code must contain only numbers'),
];

/**
 * Validation rules for resend verification
 */
const resendVerificationValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

export {
  validate,
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  resendVerificationValidation,
};
