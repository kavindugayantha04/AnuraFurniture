const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Get cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name images price discount stock isActive');
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  res.status(200).json({ success: true, cart });
});

// @desc    Add to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, color } = req.body;
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const price = product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity, color, price, name: product.name, image: product.images[0]?.url }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    } else {
      cart.items.push({ product: productId, quantity, color, price, name: product.name, image: product.images[0]?.url });
    }
    await cart.save();
  }

  await cart.populate('items.product', 'name images price discount stock');
  res.status(200).json({ success: true, cart });
});

// @desc    Update cart item
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      res.status(400);
      throw new Error('Insufficient stock');
    }
    item.quantity = quantity;
  }

  await cart.save();
  res.status(200).json({ success: true, cart });
});

// @desc    Remove from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
  await cart.save();
  res.status(200).json({ success: true, cart });
});

// @desc    Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], coupon: null });
  res.status(200).json({ success: true, message: 'Cart cleared' });
});

// @desc    Apply coupon
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isValid) {
    res.status(400);
    throw new Error('Invalid or expired coupon');
  }

  if (coupon.usedBy.includes(req.user.id)) {
    res.status(400);
    throw new Error('Coupon already used');
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (cart.subtotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount for this coupon is Rs. ${coupon.minOrderAmount}`);
  }

  cart.coupon = coupon._id;
  await cart.save();

  const discount =
    coupon.type === 'percentage'
      ? Math.min((cart.subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity)
      : coupon.value;

  res.status(200).json({
    success: true,
    message: 'Coupon applied',
    coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount },
  });
});
