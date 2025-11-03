import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/user.model.js';

dotenv.config();

const createSupervisor = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if supervisor already exists
    const existingSupervisor = await User.findOne({
      email: 'leovms101@gmail.com',
    });

    if (existingSupervisor) {
      console.log('⚠️  Supervisor with this email already exists!');
      console.log('Updating to supervisor role...');

      // Update existing user to supervisor
      existingSupervisor.isSupervisor = true;
      existingSupervisor.supervisorTitle = 'Senior Startup Mentor & Innovation Consultant';
      existingSupervisor.supervisorBio =
        'Experienced entrepreneur and startup advisor with over 10 years of experience helping early-stage companies scale. Specialized in technology startups, product development, and go-to-market strategies. Successfully mentored 50+ startups across various industries.';
      existingSupervisor.supervisorExpertise = [
        'Software Development',
        'Product Management',
        'Business Development',
        'Fundraising & VC',
        'Digital Marketing',
        'Strategic Planning',
      ];
      existingSupervisor.supervisorLinkedIn = 'https://linkedin.com/in/supervisor';

      // Add age if missing
      if (!existingSupervisor.age) {
        existingSupervisor.age = 35;
      }

      await existingSupervisor.save();
      console.log('✅ Updated existing user to supervisor role');
      console.log('\n📋 Supervisor Details:');
      console.log(`   Name: ${existingSupervisor.name}`);
      console.log(`   Email: ${existingSupervisor.email}`);
      console.log(`   Role: ${existingSupervisor.role}`);
      console.log(`   Title: ${existingSupervisor.supervisorTitle}`);
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('12345678', 10);

      // Create new supervisor
      const supervisor = new User({
        name: 'Dr. Leo Martinez',
        email: 'leovms101@gmail.com',
        password: hashedPassword,
        age: 35,
        role: 'user', // Keep as user, but set isSupervisor flag
        isSupervisor: true,
        phone: '+1-555-0123',
        supervisorTitle: 'Senior Startup Mentor & Innovation Consultant',
        supervisorBio:
          'Experienced entrepreneur and startup advisor with over 10 years of experience helping early-stage companies scale. Specialized in technology startups, product development, and go-to-market strategies. Successfully mentored 50+ startups across various industries.',
        supervisorExpertise: [
          'Software Development',
          'Product Management',
          'Business Development',
          'Fundraising & VC',
          'Digital Marketing',
          'Strategic Planning',
        ],
        supervisorLinkedIn: 'https://linkedin.com/in/supervisor',
        isEmailVerified: true,
      });

      await supervisor.save();
      console.log('✅ Supervisor created successfully!');
      console.log('\n📋 Supervisor Details:');
      console.log(`   ID: ${supervisor._id}`);
      console.log(`   Name: ${supervisor.name}`);
      console.log(`   Email: ${supervisor.email}`);
      console.log(`   Password: 12345678`);
      console.log(`   Role: ${supervisor.role}`);
      console.log(`   Title: ${supervisor.supervisorTitle}`);
      console.log(`   Expertise: ${supervisor.supervisorExpertise.join(', ')}`);
    }
  } catch (error) {
    console.error('❌ Error creating supervisor:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
};

createSupervisor();
