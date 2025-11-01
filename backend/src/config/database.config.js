import mongoose from 'mongoose';
import logger from './logger.config.js';
import config from './index.js';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

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
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    isConnected = false;
    throw error;
  }
};

const getConnectionStatus = () => isConnected;

export { connectDB, getConnectionStatus };
