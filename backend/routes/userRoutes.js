const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { isAdminEmail } = require('../config/admin');

// Wishlist
router.post('/wishlist/toggle', protect, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);
  const idx = user.wishlist.indexOf(productId);
  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    await Product.findByIdAndUpdate(productId, { $inc: { wishlistCount: -1 } });
  } else {
    user.wishlist.push(productId);
    await Product.findByIdAndUpdate(productId, { $inc: { wishlistCount: 1 } });
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
}));

router.get('/wishlist', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name images price discount ratings numReviews stock');
  res.json({ success: true, wishlist: user.wishlist });
}));

// Admin – Get all users
router.get('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, total, users });
}));

// Admin – Get user by ID
router.get('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
}));

// Admin – Update user
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error('User not found');
  }
  const updates = { isActive: req.body.isActive };
  if (req.body.role === 'admin' && !isAdminEmail(target.email)) {
    res.status(400);
    throw new Error('Only the designated administrator account can have admin role');
  }
  if (req.body.role && isAdminEmail(target.email)) {
    updates.role = 'admin';
  } else if (req.body.role) {
    updates.role = req.body.role === 'admin' ? 'customer' : req.body.role;
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json({ success: true, user });
}));

// Admin – Delete user
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
