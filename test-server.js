import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: './server/.env' });

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Test MongoDB connection
async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Successfully connected to MongoDB');
    
    // Test a simple query
    const User = (await import('./server/models/User.js')).default;
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

testMongoDB();
