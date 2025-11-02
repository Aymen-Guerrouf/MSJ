import cloudinary from '../config/cloudinary.config.js';

/**
 * Script to test Cloudinary connection
 * Usage: node src/scripts/testCloudinary.js
 */

const testCloudinary = async () => {
  try {
    console.log('🧪 Testing Cloudinary connection...\n');

    // Test API connection
    const result = await cloudinary.api.ping();

    console.log('✅ Cloudinary connection successful!');
    console.log('   Status:', result.status);

    // Get cloud details
    const usage = await cloudinary.api.usage();
    console.log('\n📊 Cloud Information:');
    console.log('   Cloud Name:', cloudinary.config().cloud_name);
    console.log('   API Key:', cloudinary.config().api_key);
    console.log('   Plan:', usage.plan || 'Free');
    console.log('   Credits Used:', usage.credits?.usage || 0);
    console.log('   Credits Limit:', usage.credits?.limit || 'N/A');

    console.log('\n🎉 Your Cloudinary is ready to use!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Upload a video to Cloudinary dashboard');
    console.log('   2. Copy the secure URL');
    console.log('   3. Use the Admin Panel to add it to the app');
  } catch (error) {
    console.error('❌ Cloudinary connection failed!');
    console.error('   Error:', error.message);
    console.error('\n🔍 Please check:');
    console.error('   - CLOUDINARY_CLOUD_NAME is correct');
    console.error('   - CLOUDINARY_API_KEY is correct');
    console.error('   - CLOUDINARY_API_SECRET is correct');
    console.error('   - Your Cloudinary account is active');
  }
};

testCloudinary();
