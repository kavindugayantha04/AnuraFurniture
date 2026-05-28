const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
    loyaltyPoints: user.loyaltyPoints,
    wishlist: user.wishlist,
    preferences: user.preferences,
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: userResponse,
  });
};

module.exports = sendTokenResponse;
