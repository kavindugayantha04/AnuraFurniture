/**
 * Create or update the sole admin account from backend/.env
 * Run: npm run seed:admin
 *
 * Required: ADMIN_EMAIL, ADMIN_PASSWORD
 * Optional: ADMIN_NAME, ADMIN_PHONE
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const { getAdminEmail } = require('../config/admin');
const enforceSingleAdmin = require('./enforceAdmin');

const MIN_PASSWORD_LENGTH = 12;

function validateAdminEnv() {
  const email = getAdminEmail();
  const password = process.env.ADMIN_PASSWORD;
  const name = (process.env.ADMIN_NAME || 'Administrator').trim();
  const phone = process.env.ADMIN_PHONE?.trim() || undefined;

  if (!email) {
    throw new Error('ADMIN_EMAIL is required in backend/.env');
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('ADMIN_EMAIL must be a valid email address');
  }
  if (!password) {
    throw new Error('ADMIN_PASSWORD is required in backend/.env');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error('ADMIN_PASSWORD must include uppercase, lowercase, and a number');
  }

  return { name, email, password, phone, role: 'admin', isVerified: true, isActive: true };
}

async function seedAdmin() {
  const admin = validateAdminEnv();

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected...');

  let user = await User.findOne({ email: admin.email }).select('+password');

  if (user) {
    user.name = admin.name;
    user.password = admin.password;
    user.role = 'admin';
    user.isVerified = true;
    user.isActive = true;
    if (admin.phone) user.phone = admin.phone;
    await user.save();
    console.log(`✅ Admin account updated for ${admin.email}`);
  } else {
    await User.create({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      phone: admin.phone,
      role: 'admin',
      isVerified: true,
      isActive: true,
    });
    console.log(`✅ Admin account created for ${admin.email}`);
  }

  await enforceSingleAdmin();
  console.log('   (Password is stored hashed — it is never logged.)');
  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
