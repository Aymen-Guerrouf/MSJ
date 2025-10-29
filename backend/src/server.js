// src/server.js
require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');

const app = require('./app'); // your Express app with routes/middleware
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const config = require('./config');

// Basic health checks
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
app.get('/readyz', (req, res) => {
  const state = mongoose.connection.readyState; // 1 connected, 2 connecting, etc.
  res.status(state === 1 ? 200 : 503).json({ db: state });
});

let server;
let shuttingDown = false;

const startServer = async () => {
  try {
    logger.info('Connecting to database...');
    await connectDB();

    server = http.createServer(app);

    // Bind to 0.0.0.0 to accept connections from network (for physical devices)
    server.listen(config.port, '0.0.0.0', () => {
      logger.info(
        { port: config.port, env: config.env, nodeVersion: process.version },
        'Server started successfully'
      );
      logger.info(`🚀 API: http://localhost:${config.port}/api`);
      logger.info(`📚 Docs: http://localhost:${config.port}/api-docs`);
    });

    const gracefulShutdown = (signal, reason) => {
      if (shuttingDown) return;
      shuttingDown = true;
      logger.info({ signal, reason }, 'Starting graceful shutdown');

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await mongoose.connection.close();
          logger.info('Database connection closed');
        } catch (err) {
          logger.error({ err }, 'Error while closing DB connection');
        } finally {
          process.exit(0);
        }
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000).unref();
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('unhandledRejection', (err) => {
      logger.error({ err }, 'Unhandled Rejection');
      gracefulShutdown('signal', 'unhandledRejection');
    });
    process.on('uncaughtException', (err) => {
      logger.error({ err }, 'Uncaught Exception');
      gracefulShutdown('signal', 'uncaughtException');
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
