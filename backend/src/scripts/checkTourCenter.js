import mongoose from 'mongoose';
import Center from '../models/center.model.js';
import config from '../config/index.js';

async function checkTourCenter() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB\n');

    const centers = await Center.find({ hasTour: true });

    console.log(`Found ${centers.length} center(s) with hasTour: true\n`);

    centers.forEach((center) => {
      console.log('Name:', center.name);
      console.log('Wilaya:', center.wilaya);
      console.log('hasTour:', center.hasTour);
      console.log('Address:', center.address);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTourCenter();
