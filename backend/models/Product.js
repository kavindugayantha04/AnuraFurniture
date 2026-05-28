const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [String],
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name required'], trim: true, maxlength: [200, 'Name max 200 chars'] },
    nameSI: { type: String, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description required'] },
    descriptionSI: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, default: 'Anura Furniture' },
    sku: { type: String, unique: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    videos: [{ url: String, thumbnail: String }],
    price: { type: Number, required: [true, 'Price required'], min: 0 },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' },
    },
    weight: { type: Number },
    materials: [String],
    colors: [
      {
        name: String,
        hex: String,
        image: String,
        stock: Number,
      },
    ],
    tags: [String],
    features: [String],
    specifications: [{ key: String, value: String }],
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    deliveryEstimate: { type: String, default: '3-7 business days' },
    warranty: { type: String, default: '1 year' },
    roomType: [{ type: String, enum: ['living', 'bedroom', 'dining', 'office', 'outdoor', 'kitchen', 'bathroom'] }],
    style: [{ type: String, enum: ['modern', 'classic', 'minimalist', 'rustic', 'industrial', 'scandinavian', 'luxury'] }],
    aiTags: [String],
    viewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    barcode: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }
  return this.price;
});

productSchema.virtual('isLowStock').get(function () {
  return this.stock <= this.lowStockThreshold;
});

productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.reviews.length > 0) {
    this.ratings = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text', aiTags: 'text' });
productSchema.index({ category: 1, price: 1, ratings: -1 });

module.exports = mongoose.model('Product', productSchema);
