import logger from '../config/logger.config.js';
import config from '../config/index.js';

/**
 * Global error handler middleware
 * Must be defined after all other middleware and routes
 */
const errorHandler = (err, req, res, _next) => {
  // Log error
  logger.error(
    {
      err,
      req: {
        method: req.method,
        url: req.url,
      },
    },
    'Error occurred'
  );

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: config.env === 'production' ? 'Internal server error' : message,
    ...(config.env !== 'production' && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export { errorHandler, notFound };
