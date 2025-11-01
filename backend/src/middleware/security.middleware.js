import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId in request parameters
 * Prevents invalid ObjectId errors and potential injection attacks
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Missing required parameter: ${paramName}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    next();
  };
};

/**
 * Middleware to validate multiple ObjectIds in request body
 */
export const validateObjectIds = (...fieldNames) => {
  return (req, res, next) => {
    const invalidFields = [];

    for (const fieldName of fieldNames) {
      const value = req.body[fieldName];

      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        invalidFields.push(fieldName);
      }
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ObjectId format',
        fields: invalidFields,
      });
    }

    next();
  };
};

/**
 * Middleware to enforce HTTPS in production
 */
export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
  }
  next();
};
