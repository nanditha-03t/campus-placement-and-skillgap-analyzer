const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      console.log('Connecting to specified MongoDB URI...');
      await mongoose.connect(mongoUri);
      console.log(' MongoDB connected successfully to external instance');
      return;
    }

    // Fallback: In-memory MongoDB for zero-configuration, instant out-of-the-box local setup
    console.log('No MONGODB_URI provided in environment. Initializing MongoMemoryServer...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log(` In-memory MongoDB connected successfully at ${uri}`);
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
