import mongoose from 'mongoose';
import StartupIdea from '../src/models/startupIdea.model.js';
import User from '../src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function createSampleSpark() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/msj-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find a user to be the owner (or create one)
    let user = await User.findOne({ role: 'entrepreneur' });

    if (!user) {
      console.log('No entrepreneur user found. Looking for any user...');
      user = await User.findOne();
    }

    if (!user) {
      console.log('⚠️  No users found in database. Creating a test user...');
      user = await User.create({
        name: 'Test Entrepreneur',
        email: 'test@example.com',
        password: 'test123', // This will be hashed by the model
        role: 'entrepreneur',
        phone: '0123456789',
      });
      console.log('✅ Created test user:', user.name);
    }

    // Check if spark already exists for this user
    const existingSpark = await StartupIdea.findOne({ owner: user._id });

    if (existingSpark) {
      console.log('⚠️  User already has a spark:', existingSpark.title);
      console.log('Updating existing spark to public status...');
      existingSpark.status = 'public';
      await existingSpark.save();
      console.log('✅ Updated spark status to public');
      console.log('\nSpark Details:');
      console.log('ID:', existingSpark._id);
      console.log('Title:', existingSpark.title);
      console.log('Owner:', user.name);
      console.log('Status:', existingSpark.status);
    } else {
      // Create a new spark
      const newSpark = await StartupIdea.create({
        title: 'Smart Agriculture Platform',
        description:
          'An IoT-based platform that helps farmers monitor soil conditions, weather patterns, and crop health in real-time. Uses AI to provide actionable insights and optimize farming operations.',
        category: 'Technology',
        problemStatement:
          'Farmers lack access to real-time data about their crops and fields, leading to inefficient resource usage and reduced yields.',
        solution:
          'A comprehensive platform combining IoT sensors, satellite imagery, and AI analytics to provide farmers with actionable insights.',
        targetMarket:
          'Small to medium-sized farms in developing regions, estimated market of 500M farmers worldwide.',
        businessModel: 'SaaS (Subscription)',
        images: [
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        ],
        owner: user._id,
        status: 'public',
      });

      console.log('✅ Created new spark successfully!');
      console.log('\nSpark Details:');
      console.log('ID:', newSpark._id);
      console.log('Title:', newSpark.title);
      console.log('Category:', newSpark.category);
      console.log('Owner:', user.name);
      console.log('Owner ID:', user._id);
      console.log('Status:', newSpark.status);
      console.log('\n📱 You can now view this spark in your app!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating spark:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createSampleSpark();
