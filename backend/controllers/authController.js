const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const sendTokenResponse = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Register user
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone });

  const verifyToken = user.getEmailVerifyToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Anura Furniture – Verify Your Email',
      html: emailTemplates.welcomeEmail(user),
    });
  } catch (err) {
    console.error('Email send failed:', err);
  }

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name images price finalPrice');
  res.status(200).json({ success: true, user });
});

// @desc    Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = { name: req.body.name, phone: req.body.phone, avatar: req.body.avatar };
  const user = await User.findByIdAndUpdate(req.user.id, allowedFields, { new: true, runValidators: true });
  res.status(200).json({ success: true, user });
});

// @desc    Change password
exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('No user with that email');
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: 'Anura Furniture – Password Reset',
      html: emailTemplates.resetPassword(resetUrl),
    });
    res.status(200).json({ success: true, message: 'Reset email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Verify email
exports.verifyEmail = asyncHandler(async (req, res) => {
  const emailVerifyToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ emailVerifyToken, emailVerifyExpire: { $gt: Date.now() } });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

// @desc    Update preferences
exports.updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences: req.body.preferences },
    { new: true }
  );
  res.status(200).json({ success: true, user });
});

// @desc    Update FCM token
exports.updateFCMToken = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { fcmToken: req.body.fcmToken });
  res.status(200).json({ success: true, message: 'FCM token updated' });
});
