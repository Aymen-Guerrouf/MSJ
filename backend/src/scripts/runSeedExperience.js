import mongoose from 'mongoose';
import seedExperienceData from './seedExperienceData.js';
import dotenv from 'dotenv';

dotenv.config();

const runSeed = async () => {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/msj';
    await mongoose.connect(dbUri);
    // eslint-disable-next-line no-console
    console.log('📦 Connected to MongoDB');

    // Run the seed
    await seedExperienceData();

    // Disconnect
    await mongoose.disconnect();
    // eslint-disable-next-line no-console
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

runSeed();
