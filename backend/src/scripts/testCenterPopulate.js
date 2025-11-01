import mongoose from 'mongoose';
import Center from '../models/center.model.js';
import Club from '../models/club.model.js';
import Event from '../models/event.model.js';
import Workshop from '../models/workshop.model.js';

async function testCenterPopulate() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/msj-hackathon');
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Fetching centers with all related data...\n');

    const centers = await Center.find().populate('clubs').populate('events').populate('workshops');

    console.log(`✅ Found ${centers.length} centers\n`);

    centers.forEach((center, index) => {
      console.log(`\n📍 CENTER ${index + 1}: ${center.name}`);
      console.log(`   Wilaya: ${center.wilaya}`);
      console.log(`   Location: ${center.latitude}, ${center.longitude}`);
      console.log(`   📋 Clubs: ${center.clubs?.length || 0}`);
      center.clubs?.forEach((club) => {
        console.log(`      - ${club.name} (${club.category})`);
      });
      console.log(`   🎉 Events: ${center.events?.length || 0}`);
      center.events?.forEach((event) => {
        console.log(`      - ${event.title} (${new Date(event.date).toDateString()})`);
      });
      console.log(`   🎓 Workshops: ${center.workshops?.length || 0}`);
      center.workshops?.forEach((workshop) => {
        console.log(`      - ${workshop.title} (${workshop.price} DZD)`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testCenterPopulate();
