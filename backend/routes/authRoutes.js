const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const {
  register, login, logout, getMe, updateProfile, changePassword,
  forgotPassword, resetPassword, verifyEmail, updatePreferences, updateFCMToken,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const googleConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (googleConfigured) {
  router.get('/google', (req, res, next) => {
    const redirect = typeof req.query.redirect === 'string' && req.query.redirect.startsWith('/')
      ? req.query.redirect
      : '/';
    const state = Buffer.from(JSON.stringify({ redirect }), 'utf8').toString('base64url');

    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      state,
    })(req, res, next);
  });

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_failed`,
    }),
    googleCallback
  );
}

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
