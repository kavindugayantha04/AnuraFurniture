const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleSI: String,
    subtitle: String,
    subtitleSI: String,
    image: { url: String, publicId: String },
    mobileImage: { url: String, publicId: String },
    link: String,
    buttonText: String,
    position: { type: String, enum: ['hero', 'homepage', 'shop', 'sidebar', 'popup'], default: 'hero' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    validFrom: Date,
    validUntil: Date,
    bgColor: String,
    textColor: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
