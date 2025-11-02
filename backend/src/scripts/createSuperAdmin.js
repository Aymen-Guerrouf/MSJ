import mongoose from 'mongoose';
import User from '../models/user.model.js';
import config from '../config/index.js';

/**
 * Script to create a super admin user
 * Usage: node src/scripts/createSuperAdmin.js
 */

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Super admin details
    const superAdminData = {
      email: 'admin@msj.com',
      password: 'Admin@123456', // Change this to a secure password
      name: 'Super Admin',
      role: 'super_admin',
      age: 30, // Optional for admin
      interests: ['tech', 'education'],
      isEmailVerified: true,
    };

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: superAdminData.email });

    if (existingAdmin) {
      console.log('⚠️  Super admin already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   Role:', existingAdmin.role);

      // Optionally update the existing admin
      existingAdmin.role = 'super_admin';
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
      console.log('✅ Updated existing user to super_admin');
    } else {
      // Create new super admin
      const superAdmin = await User.create(superAdminData);
      console.log('✅ Super admin created successfully!');
      console.log('   Email:', superAdmin.email);
      console.log('   Name:', superAdmin.name);
      console.log('   Role:', superAdmin.role);
      console.log('   ID:', superAdmin._id);
    }

    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@msj.com');
    console.log('   Password: Admin@123456');
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

createSuperAdmin();
