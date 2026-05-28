const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', protect, asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.body.code?.toUpperCase() });
  if (!coupon || !coupon.isValid) {
    res.status(400);
    throw new Error('Invalid or expired coupon');
  }
  if (coupon.usedBy.includes(req.user.id)) {
    res.status(400);
    throw new Error('Coupon already used by you');
  }
  res.json({ success: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, minOrderAmount: coupon.minOrderAmount } });
}));

router.get('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
}));

router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, coupon });
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
}));

module.exports = router;
