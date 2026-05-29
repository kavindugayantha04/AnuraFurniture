const mongoose = require('mongoose');
const enforceSingleAdmin = require('../utils/enforceAdmin');
const { isAdminConfigured } = require('./admin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    if (!isAdminConfigured()) {
      console.warn('⚠️  ADMIN_EMAIL is not set — admin panel and seed:admin are disabled until you configure backend/.env');
    } else {
      await enforceSingleAdmin();
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
