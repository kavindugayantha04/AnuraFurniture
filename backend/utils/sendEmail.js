const nodemailer = require('nodemailer');

/** Inbox for shop alerts (new orders, custom requests) — set STORE_EMAIL in .env */
const getStoreEmail = () => process.env.STORE_EMAIL?.trim().toLowerCase() || null;

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const fromName = process.env.EMAIL_FROM_NAME || 'Anura Furniture';
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  return info;
};

/** Notify the store inbox (STORE_EMAIL) — e.g. new order, custom request */
const notifyStore = async ({ subject, html, text }) => {
  const storeEmail = getStoreEmail();
  if (!storeEmail) {
    console.warn('⚠️  STORE_EMAIL not set — shop notification skipped');
    return null;
  }
  return sendEmail({ to: storeEmail, subject, html, text });
};

const emailTemplates = {
  orderConfirmation: (order, user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #0891b2); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Anura Furniture</h1>
        <p style="color: #bfdbfe; margin: 5px 0 0;">Furniture කලාවේ මහ ගෙදර</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #1e3a8a;">Order Confirmed! 🎉</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order. Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px; color: #0c4a6e;">Order Summary</h3>
          ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e0f2fe;">
              <span>${item.name} x${item.quantity}</span>
              <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          <div style="margin-top: 10px; font-weight: bold; display: flex; justify-content: space-between;">
            <span>Total:</span>
            <span style="color: #1e3a8a;">Rs. ${order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
        <p>Estimated delivery: <strong>${order.estimatedDelivery ? new Date(order.estimatedDelivery).toDateString() : '3-7 business days'}</strong></p>
        <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 15px;">Track Order</a>
      </div>
      <div style="background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
        <p>Anura Furniture – Dekatana | Furniture කලාවේ මහ ගෙදර</p>
      </div>
    </div>
  `,

  resetPassword: (resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #0891b2); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0;">Reset Your Password</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px;">Reset Password</a>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `,

  welcomeEmail: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #0891b2); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to Anura Furniture! 🎊</h1>
        <p style="color: #bfdbfe;">Furniture කලාවේ මහ ගෙදර</p>
      </div>
      <div style="padding: 30px; background: #fff;">
        <p>Dear ${user.name},</p>
        <p>Welcome to Sri Lanka's premier AI-powered furniture platform. Explore thousands of premium furniture pieces crafted with love and expertise.</p>
        <a href="${process.env.CLIENT_URL}/shop" style="display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px;">Start Shopping</a>
      </div>
    </div>
  `,

  storeNewOrder: (order, user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a;">🛒 New order — ${order.orderNumber}</h2>
      <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
      <p><strong>Phone:</strong> ${user.phone || '—'}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p><strong>Total:</strong> Rs. ${order.totalPrice.toLocaleString()}</p>
      <p><strong>Items:</strong></p>
      <ul>${order.items.map((i) => `<li>${i.name} × ${i.quantity} — Rs. ${(i.price * i.quantity).toLocaleString()}</li>`).join('')}</ul>
      <p><a href="${process.env.CLIENT_URL}/admin/orders">View in admin panel</a></p>
    </div>
  `,

  storeContactMessage: (body) => {
    const esc = (s) =>
      String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a;">📩 New contact form message</h2>
      <p><strong>Name:</strong> ${esc(body.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${esc(body.email)}">${esc(body.email)}</a></p>
      <p><strong>Phone:</strong> ${esc(body.phone) || '—'}</p>
      <p><strong>Subject:</strong> ${esc(body.subject)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 8px;">${esc(body.message)}</p>
      <p style="color: #64748b; font-size: 12px;">Reply directly to ${esc(body.email)}</p>
    </div>
  `;
  },

  contactAutoReply: (body) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #0891b2); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Anura Furniture</h1>
      </div>
      <div style="padding: 24px; background: #fff;">
        <p>Dear ${body.name},</p>
        <p>Thank you for contacting us about <strong>${body.subject}</strong>. We have received your message and will get back to you within 24 hours.</p>
        <p style="color: #64748b; font-size: 14px;">For urgent inquiries, WhatsApp us at +94 72 330 3946.</p>
      </div>
    </div>
  `,

  storeCustomOrder: (customOrder, body) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a;">🪚 New custom furniture request — ${customOrder.reference}</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone || '—'}</p>
      <p><strong>Type:</strong> ${body.furnitureType}</p>
      <p><strong>Details:</strong> ${body.description || body.notes || '—'}</p>
      <p><a href="${process.env.CLIENT_URL}/admin/custom-orders">View in admin panel</a></p>
    </div>
  `,
};

module.exports = { sendEmail, emailTemplates, notifyStore, getStoreEmail };
