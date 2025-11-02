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
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be a number between 13 and 120'),
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
 * Validation rules for reset password with 4-digit code
 */
const resetPasswordValidation = [
  body('code')
    .notEmpty()
    .withMessage('Reset code is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Reset code must be exactly 4 digits')
    .isNumeric()
    .withMessage('Reset code must contain only numbers'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password confirmation does not match'),
];

/**
 * Validation rules for email verification with 4-digit code
 */
const verifyEmailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('code')
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Verification code must be exactly 4 digits')
    .isNumeric()
    .withMessage('Verification code must contain only numbers'),
];

/**
 * Validation rules for resend verification
 */
const resendVerificationValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

/**
 * Validation for MongoDB ObjectId
 */
const objectIdValidation = (fieldName = 'id') => [
  body(fieldName).optional().isMongoId().withMessage(`${fieldName} must be a valid ID`),
];

/**
 * Event/Workshop/Club creation validation
 */
const activityValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title too long'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description too long'),
  body('centerId').isMongoId().withMessage('Valid center ID required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

/**
 * Experience session validation
 */
const experienceSessionValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title too long'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('centerId').isMongoId().withMessage('Valid center ID required'),
];

/**
 * Experience card validation
 */
const experienceCardValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title too long'),
  body('summary')
    .trim()
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ max: 800 })
    .withMessage('Summary too long'),
  body('lessons').optional().isArray().withMessage('Lessons must be an array'),
  body('centerId').isMongoId().withMessage('Valid center ID required'),
];

/**
 * Virtual school video validation
 */
const virtualSchoolValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title too long'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('videoUrl').trim().isURL().withMessage('Valid video URL required'),
  body('centerId').isMongoId().withMessage('Valid center ID required'),
];

/**
 * Registration validation (events/workshops/clubs)
 */
const participationValidation = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name is required'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number required'),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
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
  objectIdValidation,
  activityValidation,
  experienceSessionValidation,
  experienceCardValidation,
  virtualSchoolValidation,
  participationValidation,
};
