const app = require('./app');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const config = require('./config');

const startServer = async () => {
  try {
    // Connect to database first
    logger.info('Connecting to database...');
    await connectDB();
    
    // Start server only after successful DB connection
    const server = app.listen(config.port, () => {
      logger.info({
        port: config.port,
        env: config.env,
        nodeVersion: process.version,
      }, 'Server started successfully');
      
      logger.info(`🚀 API: http://localhost:${config.port}/api`);
      logger.info(`📚 Docs: http://localhost:${config.port}/api-docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received, starting graceful shutdown`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close database connection
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        logger.info('Database connection closed');
        
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error({ err }, 'Unhandled Rejection');
      gracefulShutdown('Unhandled Rejection');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error({ err }, 'Uncaught Exception');
      gracefulShutdown('Uncaught Exception');
    });

  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
