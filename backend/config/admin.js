const normalizeEmail = (email) => String(email || '').toLowerCase().trim();

/** Admin email from environment only — set ADMIN_EMAIL in backend/.env */
const getAdminEmail = () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
};

const isAdminConfigured = () => Boolean(getAdminEmail());

const isAdminEmail = (email) => {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  return normalizeEmail(email) === adminEmail;
};

const isAdminUser = (user) => user && isAdminEmail(user.email);

/** Never expose admin role to clients unless email matches ADMIN_EMAIL */
const sanitizeUser = (user) => {
  if (!user) return user;
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  obj.role = isAdminUser(obj) ? 'admin' : obj.role === 'admin' ? 'customer' : obj.role;
  return obj;
};

module.exports = {
  getAdminEmail,
  isAdminConfigured,
  isAdminEmail,
  isAdminUser,
  sanitizeUser,
};
