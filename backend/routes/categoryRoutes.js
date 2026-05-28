const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true, parent: null })
    .sort({ sortOrder: 1 })
    .populate('subcategories');
  res.json({ success: true, categories });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('subcategories');
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, category });
}));

router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category });
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
}));

module.exports = router;
