// createAdmin.js - Run this script to create an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      username: 'admin',
      email: 'admin@church.com', // Change this to your preferred admin email
      password: 'admin123', // Change this to a strong password
      role: 'admin'
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create and save admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password: admin123'); // Remember to change this
    console.log('Role:', adminData.role);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();