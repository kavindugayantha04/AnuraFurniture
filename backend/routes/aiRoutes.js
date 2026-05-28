const express = require('express');
const router = express.Router();
const { chatbot, getRecommendations, aiSearch, designRoom, getSalesInsights } = require('../controllers/aiController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.post('/chat', optionalAuth, chatbot);
router.post('/recommendations', optionalAuth, getRecommendations);
router.post('/search', optionalAuth, aiSearch);
router.post('/design-room', optionalAuth, designRoom);
router.get('/sales-insights', protect, authorize('admin'), getSalesInsights);

module.exports = router;
