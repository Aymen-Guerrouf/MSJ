import mongoose from 'mongoose';
import User from '/home/guerrouf-aymen/Documents/MSJ/backend/src/models/user.model.js';

mongoose.connect('mongodb://localhost:27017/msj-hackathon').then(async () => {
  const admin = await User.create({
    name: 'Admin Testtest',
    email: 'admin@test.com',
    password: 'admin123', // Will be auto-hashed by pre('save')
    age: 30,
    role: 'admin',
    isEmailVerified: true,
  });

  console.log('✅ Admin created:', admin);
  process.exit();
});
