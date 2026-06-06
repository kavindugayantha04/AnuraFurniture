const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with advanced filtering
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    keyword, category, minPrice, maxPrice, rating, sort, page = 1,
    limit = 12, isFeatured, isBestSeller, isNewArrival, isTrending,
    colors, materials, style, roomType, brand,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.ratings = { $gte: Number(rating) };
  if (isFeatured === 'true') query.isFeatured = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isTrending === 'true') query.isTrending = true;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (style) query.style = { $in: style.split(',') };
  if (roomType) query.roomType = { $in: roomType.split(',') };
  if (materials) query.materials = { $in: materials.split(',') };
  if (colors) {
    query['colors.name'] = { $in: colors.split(',') };
  }

  let sortObj = {};
  switch (sort) {
    case 'price_asc': sortObj = { price: 1 }; break;
    case 'price_desc': sortObj = { price: -1 }; break;
    case 'newest': sortObj = { createdAt: -1 }; break;
    case 'rating': sortObj = { ratings: -1 }; break;
    case 'popular': sortObj = { viewCount: -1 }; break;
    case 'bestseller': sortObj = { soldCount: -1 }; break;
    default: sortObj = { createdAt: -1 };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit))
    .select('-reviews');

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    products,
  });
});

// @desc    Get single product
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lookup = mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id
    ? { $or: [{ _id: id }, { slug: id }] }
    : { slug: id };

  const product = await Product.findOne({
    ...lookup,
    isActive: true,
  }).populate('category', 'name slug').populate('reviews.user', 'name avatar');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

  res.status(200).json({ success: true, product });
});

// @desc    Create product (Admin)
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, product });
});

// @desc    Update product (Admin)
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, product });
});

// @desc    Delete product (Admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc    Add product review
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    user: req.user.id,
    name: req.user.name,
    avatar: req.user.avatar,
    rating: Number(rating),
    comment,
    images: images || [],
  };

  product.reviews.push(review);
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc    Get related products
exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(8).select('name images price finalPrice ratings numReviews');

  res.status(200).json({ success: true, products: related });
});

// @desc    Upload product images
exports.uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  const images = req.files.map((file, index) => ({
    url: file.path,
    publicId: file.filename,
    alt: `Product image ${index + 1}`,
    isPrimary: index === 0,
  }));

  res.status(200).json({ success: true, images });
});

// @desc    Get product stats (Admin)
exports.getProductStats = asyncHandler(async (req, res) => {
  const stats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratings' },
        lowStock: { $sum: { $cond: [{ $lte: ['$stock', '$lowStockThreshold'] }, 1, 0] } },
        outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
      },
    },
  ]);
  res.status(200).json({ success: true, stats: stats[0] });
});
