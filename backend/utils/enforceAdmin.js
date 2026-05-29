const User = require('../models/User');
const { getAdminEmail } = require('../config/admin');

/** Remove admin role from any account that is not the designated admin email */
const enforceSingleAdmin = async () => {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return;

  const result = await User.updateMany(
    { role: 'admin', email: { $ne: adminEmail } },
    { $set: { role: 'customer' } }
  );
  if (result.modifiedCount > 0) {
    console.log(`🔒 Removed admin role from ${result.modifiedCount} non-admin account(s)`);
  }
};

module.exports = enforceSingleAdmin;
