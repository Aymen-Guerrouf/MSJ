const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const pinoHttp = require('pino-http');
const config = require('./config');
const logger = require('./config/logger');
const routes = require('./routes');
const setupSwagger = require('./docs/swagger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Request logging with pino
app.use(pinoHttp({ logger }));

// CORS configuration - MUST come before helmet
app.use(cors(config.cors));

// Security headers - configured to not interfere with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data to prevent MongoDB operator injection
app.use(mongoSanitize());

// General rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// API Documentation
setupSwagger(app);

// Health check (outside /api for load balancers)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MSJ Hackathon API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
