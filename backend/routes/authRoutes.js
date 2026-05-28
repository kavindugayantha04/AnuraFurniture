const express = require('express');
const router = express.Router();
const {
  register, login, logout, getMe, updateProfile, changePassword,
  forgotPassword, resetPassword, verifyEmail, updatePreferences, updateFCMToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/verify-email/:token', verifyEmail);

router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/preferences', protect, updatePreferences);
router.put('/fcm-token', protect, updateFCMToken);

module.exports = router;
