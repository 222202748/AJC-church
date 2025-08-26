const mongoose = require('mongoose');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/church_donations',
      mongoOptions
    );

    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Please ensure MongoDB is running on your system');
    console.log('💡 To start MongoDB:');
    console.log('   - Windows: net start MongoDB (or mongod --dbpath C:\\data\\db)');
    console.log('   - macOS/Linux: sudo systemctl start mongod (or mongod --dbpath /data/db)');
    console.log('   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    process.exit(1);
  }
};

// Handle MongoDB connection events
const setupConnectionEvents = () => {
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });

  mongoose.connection.on('close', () => {
    console.log('🔒 MongoDB connection closed');
  });

  // Handle application termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
};

// Check if MongoDB is running
const checkMongoDBStatus = async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    console.log('🏓 MongoDB ping successful:', result);
    return true;
  } catch (error) {
    console.error('❌ MongoDB ping failed:', error.message);
    return false;
  }
};

module.exports = {
  connectDB,
  setupConnectionEvents,
  checkMongoDBStatus
};