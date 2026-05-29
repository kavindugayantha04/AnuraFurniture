const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const hasGoogleOAuth =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (hasGoogleOAuth) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) {
            return done(new Error('Google account has no email'), null);
          }

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
            }
            if (!user.isVerified) user.isVerified = true;
            if (profile.photos?.[0]?.value && !user.avatar) {
              user.avatar = profile.photos[0].value;
            }
            user.lastLogin = Date.now();
            await user.save({ validateBeforeSave: false });
          } else {
            user = await User.create({
              name: profile.displayName || email.split('@')[0],
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value || '',
              isVerified: true,
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_CALLBACK_URL)');
}

module.exports = passport;
