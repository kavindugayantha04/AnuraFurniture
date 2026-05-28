const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const customOrderRoutes = require('./routes/customOrderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many auth attempts' });
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// CORS
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/banners', bannerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Anura Furniture API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

// Stripe webhook (raw body needed)
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const Order = require('./models/Order');
    const paymentIntent = event.data.object;
    const order = await Order.findById(paymentIntent.metadata.orderId);
    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'confirmed';
      order.paymentResult = { id: paymentIntent.id, status: paymentIntent.status };
      order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed via Stripe webhook' });
      await order.save();
    }
  }

  res.json({ received: true });
});

// Sitemap
app.get('/sitemap.xml', async (req, res) => {
  try {
    const generateSitemap = require('./utils/sitemap');
    const xml = await generateSitemap();
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

// Socket.io
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    connectedUsers.set(userId, socket.id);
    console.log(`👤 User ${userId} joined`);
  });

  socket.on('join_admin', () => {
    socket.join('admin');
    console.log(`🔑 Admin joined`);
  });

  socket.on('chat_message', (data) => {
    io.to('admin').emit('new_chat_message', { ...data, socketId: socket.id });
    socket.emit('chat_message_sent', { success: true });
  });

  socket.on('admin_reply', (data) => {
    io.to(data.userSocketId).emit('chat_reply', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    connectedUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) connectedUsers.delete(userId);
    });
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Anura Furniture Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📡 Socket.io enabled`);
});

module.exports = { app, io };
