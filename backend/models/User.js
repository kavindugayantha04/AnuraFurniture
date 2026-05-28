const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [50, 'Name max 50 chars'] },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, minlength: [6, 'Password min 6 chars'], select: false },
    phone: { type: String, trim: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin', 'moderator'], default: 'customer' },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        district: String,
        province: String,
        postalCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    loyaltyPoints: { type: Number, default: 0 },
    preferences: {
      budget: { min: Number, max: Number },
      styles: [String],
      colors: [String],
      rooms: [String],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerifyToken: String,
    emailVerifyExpire: Date,
    otpCode: String,
    otpExpire: Date,
    lastLogin: Date,
    fcmToken: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.getEmailVerifyToken = function () {
  const verifyToken = crypto.randomBytes(20).toString('hex');
  this.emailVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
  return verifyToken;
};

module.exports = mongoose.model('User', userSchema);
