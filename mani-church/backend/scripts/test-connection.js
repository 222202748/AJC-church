#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...');
console.log('=' .repeat(40));

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/church_donations';

console.log(`📡 Connecting to: ${mongoURI}`);

async function testConnection() {
  try {
    // Test connection
    const conn = await mongoose.connect(mongoURI, mongoOptions);
    
    console.log('✅ Connection successful!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`🔄 Ready State: ${conn.connection.readyState}`);
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // Create a test collection
    const testSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    // Insert test document
    const testDoc = new TestModel({ message: 'Connection test successful' });
    await testDoc.save();
    console.log('✅ Write operation successful');
    
    // Read test document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Read operation successful');
    
    // Clean up test document
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('✅ Delete operation successful');
    
    // Drop test collection
    await TestModel.collection.drop();
    console.log('✅ Collection cleanup successful');
    
    console.log('\n🎉 All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB is not running. Please start MongoDB:');
      console.log('   - Windows: net start MongoDB (or mongod)');
      console.log('   - macOS/Linux: sudo systemctl start mongod');
      console.log('   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication failed. Check your MongoDB credentials.');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Connection timeout. Check if MongoDB is accessible.');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed.');
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Received SIGINT. Closing connection...');
  await mongoose.connection.close();
  process.exit(0);
});

testConnection();