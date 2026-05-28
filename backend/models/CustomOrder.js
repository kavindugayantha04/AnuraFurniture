const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    furnitureType: { type: String, required: true },
    description: { type: String, required: true },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' },
    },
    materials: [String],
    colors: [String],
    budget: { min: Number, max: Number },
    timeline: String,
    inspirationImages: [{ url: String, publicId: String }],
    attachments: [{ url: String, publicId: String, name: String }],
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'quoted', 'approved', 'in_production', 'completed', 'cancelled'],
      default: 'pending',
    },
    quotation: {
      amount: Number,
      details: String,
      validUntil: Date,
      isAccepted: Boolean,
    },
    adminNotes: String,
    notes: String,
    reference: String,
  },
  { timestamps: true }
);

customOrderSchema.pre('save', async function (next) {
  if (!this.reference) {
    const count = await mongoose.model('CustomOrder').countDocuments();
    this.reference = `AF-CO-${String(count + 1001).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);
