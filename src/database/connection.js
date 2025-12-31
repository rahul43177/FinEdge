const mongoose = require('mongoose');
const logger = require("../middleware/logger");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected Successfully');
  } catch (err) {
    logger.error('MongoDB connection error:', err.message || err);
    // Exit process if DB connection fails to avoid unpredictable state
    process.exit(1);
  }
};

module.exports = connectMongoDB;
