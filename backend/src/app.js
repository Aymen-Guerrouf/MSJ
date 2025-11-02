import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import pinoHttp from 'pino-http';
import config from './config/index.js';
import logger from './config/logger.config.js';
import routes from './routes/index.js';
import setupSwagger from './docs/swagger.config.js';
import { errorHandler, notFound } from './middleware/errorHandler.middleware.js';
import cookieParser from 'cookie-parser'

const app = express();

// Enforce HTTPS in production
// app.use(enforceHTTPS);

// Request logging with pino
app.use(pinoHttp({ logger }));

// CORS configuration - MUST come before helmet
app.use(cors(config.cors));
app.use(cookieParser())
// Security headers - configured to not interfere with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Compression
app.use(compression());

// Body parsing middleware - reduced limits for security
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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

export default app;
