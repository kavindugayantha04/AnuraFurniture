const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const CustomOrder = require('../models/CustomOrder');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadCustomOrder } = require('../config/cloudinary');
const { sendEmail } = require('../utils/sendEmail');

router.post('/', optionalAuth, uploadCustomOrder.array('images', 5), asyncHandler(async (req, res) => {
  const images = req.files ? req.files.map(f => ({ url: f.path, publicId: f.filename })) : [];
  const customOrder = await CustomOrder.create({
    ...req.body,
    user: req.user?._id,
    inspirationImages: images,
  });

  try {
    await sendEmail({
      to: req.body.email,
      subject: 'Custom Furniture Request Received – Anura Furniture',
      html: `<div style="font-family:Arial;padding:20px;">
        <h2 style="color:#1e3a8a;">Your Custom Order Request (${customOrder.reference})</h2>
        <p>Dear ${req.body.name}, we have received your custom furniture request and will get back to you within 24-48 hours.</p>
        <p><strong>Reference:</strong> ${customOrder.reference}</p>
        <p><strong>Furniture Type:</strong> ${req.body.furnitureType}</p>
        <p>Thank you for choosing Anura Furniture – Furniture කලාවේ මහ ගෙදර!</p>
      </div>`,
    });
  } catch (e) { console.error(e); }

  res.status(201).json({ success: true, customOrder });
}));

router.get('/my-orders', protect, asyncHandler(async (req, res) => {
  const orders = await CustomOrder.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
}));

router.get('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await CustomOrder.countDocuments(query);
  const orders = await CustomOrder.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, total, orders });
}));

router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await CustomOrder.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Not found'); }
  res.json({ success: true, order });
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const order = await CustomOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, order });
}));

module.exports = router;
