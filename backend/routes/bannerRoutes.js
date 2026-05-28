const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');
const { protect, authorize } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const { position } = req.query;
  const query = { isActive: true, ...(position ? { position } : {}) };
  const banners = await Banner.find(query).sort({ sortOrder: 1 });
  res.json({ success: true, banners });
}));

router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, banner });
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Banner deleted' });
}));

module.exports = router;
