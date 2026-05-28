const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
    newCustomers: { type: Number, default: 0 },
    avgOrderValue: { type: Number, default: 0 },
    topProducts: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, count: Number, revenue: Number }],
    topCategories: [{ category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, count: Number }],
    conversionRate: { type: Number, default: 0 },
    cartAbandonmentRate: { type: Number, default: 0 },
    pageViews: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
