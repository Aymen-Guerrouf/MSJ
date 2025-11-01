import mongoose from 'mongoose';
import logger from './logger.config.js';
import config from './index.js';

let isConnected = false;

const connectDB = async (retries = 5, delay = 5000) => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(config.mongodb.uri, {
        // Mongoose 6+ no longer needs useNewUrlParser and useUnifiedTopology
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      isConnected = true;
      logger.info(
        {
          host: conn.connection.host,
          name: conn.connection.name,
          attempt,
        },
        'MongoDB connected successfully'
      );

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error({ err }, 'MongoDB connection error');
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        isConnected = true;
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      });

      return; // Success - exit the function
    } catch (error) {
      logger.error(
        {
          err: error,
          attempt,
          maxRetries: retries,
        },
        `MongoDB connection attempt ${attempt} failed`
      );

      if (attempt === retries) {
        // Last attempt failed
        logger.error('MongoDB connection failed after all retry attempts');
        throw error;
      }

      // Wait before retrying
      logger.info(`Retrying MongoDB connection in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const getConnectionStatus = () => isConnected;

export { connectDB, getConnectionStatus };
