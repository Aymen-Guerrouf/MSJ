import mongoose from 'mongoose';
import Center from '../models/center.model.js';
import config from '../config/index.js';

async function updateTourCenter() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB\n');

    // Update Constantine center to have hasTour: true
    const result = await Center.updateOne(
      { name: 'Maison de Jeunes Constantine' },
      { $set: { hasTour: true } }
    );

    console.log('Update result:', result);

    // Verify the update
    const center = await Center.findOne({ name: 'Maison de Jeunes Constantine' });

    if (center) {
      console.log('\nUpdated center:');
      console.log('Name:', center.name);
      console.log('Wilaya:', center.wilaya);
      console.log('hasTour:', center.hasTour);
      console.log('Address:', center.address);
    } else {
      console.log('Center not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateTourCenter();
