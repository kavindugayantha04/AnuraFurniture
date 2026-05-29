const express = require('express');
const rateLimit = require('express-rate-limit');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many messages sent. Please try again later or call us.' },
});

router.post('/', contactLimiter, submitContact);

module.exports = router;
