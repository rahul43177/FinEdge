const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    // Exit process if DB connection fails to avoid unpredictable state
    process.exit(1);
  }
};

module.exports = connectMongoDB;
