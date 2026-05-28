const nodemailer = require('nodemailer');

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

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
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
};

module.exports = { sendEmail, emailTemplates };
