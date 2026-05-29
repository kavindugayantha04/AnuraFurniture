const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates, notifyStore } = require('../utils/sendEmail');
const { isAdminUser } = require('../config/admin');

// @desc    Create order
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode, notes } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product ${item.name} is no longer available`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const price = product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price,
      quantity: item.quantity,
      color: item.color,
      sku: product.sku,
    });
    subtotal += price * item.quantity;
  }

  const shippingPrice = subtotal >= 50000 ? 0 : 500;
  const taxPrice = Math.round(subtotal * 0.0);
  let discountAmount = 0;
  let couponId = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isValid && subtotal >= coupon.minOrderAmount) {
      if (!coupon.usedBy.includes(req.user.id)) {
        discountAmount =
          coupon.type === 'percentage'
            ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity)
            : coupon.value;
        couponId = coupon._id;
        coupon.usedCount += 1;
        coupon.usedBy.push(req.user.id);
        await coupon.save();
      }
    }
  }

  const totalPrice = subtotal + shippingPrice + taxPrice - discountAmount;
  const loyaltyPointsEarned = Math.floor(totalPrice / 100);

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice,
    taxPrice,
    discount: discountAmount,
    totalPrice,
    coupon: couponId,
    couponDiscount: discountAmount,
    notes,
    loyaltyPointsEarned,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    statusHistory: [{ status: 'pending', note: 'Order placed successfully' }],
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], coupon: null });
  await User.findByIdAndUpdate(req.user.id, { $inc: { loyaltyPoints: loyaltyPointsEarned } });

  await Notification.create({
    user: req.user.id,
    title: 'Order Confirmed!',
    message: `Your order ${order.orderNumber} has been placed successfully.`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  try {
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed – ${order.orderNumber}`,
      html: emailTemplates.orderConfirmation(order, req.user),
    });
    await notifyStore({
      subject: `[Anura Furniture] New order ${order.orderNumber}`,
      html: emailTemplates.storeNewOrder(order, req.user),
    });
  } catch (err) {
    console.error('Order email failed:', err);
  }

  const io = req.app.get('io');
  if (io) {
    io.to(`admin`).emit('new_order', { orderNumber: order.orderNumber, amount: totalPrice });
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get user orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments({ user: req.user.id });
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('items.product', 'name images');

  res.status(200).json({ success: true, total, orders });
});

// @desc    Get single order
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images slug');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user.id && !isAdminUser(req.user)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.status(200).json({ success: true, order });
});

// @desc    Create Stripe Payment Intent
exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order || order.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error('Order not found');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'lkr',
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });

  res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc    Update payment status
exports.updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'confirmed';
  order.paymentResult = req.body.paymentResult;
  order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed', updatedBy: req.user.id });
  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc    Admin – Get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name email phone');

  res.status(200).json({ success: true, total, orders });
});

// @desc    Admin – Update order status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber, trackingUrl } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  order.statusHistory.push({ status, note, updatedBy: req.user.id });
  await order.save();

  const user = await User.findById(order.user);
  await Notification.create({
    user: order.user,
    title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Your order ${order.orderNumber} status has been updated to ${status}.`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  const io = req.app.get('io');
  if (io) {
    io.to(`user_${order.user}`).emit('order_update', { orderNumber: order.orderNumber, status });
  }

  res.status(200).json({ success: true, order });
});

// @desc    Admin – Dashboard stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalOrders, pendingOrders, totalRevenue, todayRevenue,
    monthRevenue, totalUsers, totalProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.aggregate([{ $match: { isPaid: true, createdAt: { $gte: thisMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    require('../models/User').countDocuments(),
    require('../models/Product').countDocuments({ isActive: true }),
  ]);

  const revenueByDay = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, total: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      totalUsers,
      totalProducts,
      revenueByDay,
      topProducts,
    },
  });
});
