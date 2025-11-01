import mongoose from 'mongoose';
import config from '../config/index.js';

async function cleanup() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Drop collections
    const collections = ['activities', 'events', 'workshops', 'participations'];

    for (const collectionName of collections) {
      try {
        await mongoose.connection.db.dropCollection(collectionName);
        console.log(`✓ Dropped collection: ${collectionName}`);
      } catch (error) {
        if (error.codeName === 'NamespaceNotFound') {
          console.log(`- Collection ${collectionName} does not exist, skipping`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Cleanup completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up:', error);
    process.exit(1);
  }
}

cleanup();
