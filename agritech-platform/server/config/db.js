const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected to Local / Remote Instance: ${conn.connection.host}`);
    await autoSeedIfEmpty();
  } catch (error) {
    console.warn(`⚠️ Local MongoDB (${uri}) not reachable: ${error.message}`);
    console.log('🔄 Launching embedded in-memory MongoDB engine (Zero-Config Mode)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded MongoDB Memory Engine Active: ${conn.connection.host}`);
      await autoSeedIfEmpty();
    } catch (memError) {
      console.error(`❌ Failed to start embedded MongoDB: ${memError.message}`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Auto-seeding initial agricultural demo data...');
      const seedDatabase = require('../data/seed');
      await seedDatabase(false);
      console.log('✅ Auto-seeding complete.');
    }
  } catch (err) {
    console.error('Warning: Auto-seeding failed:', err.message);
  }
};

module.exports = connectDB;
