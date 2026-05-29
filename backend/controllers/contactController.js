const asyncHandler = require('express-async-handler');
const { sendEmail, emailTemplates, notifyStore } = require('../utils/sendEmail');

const isEmailConfigured = () =>
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS;

// @desc    Submit contact form
// @route   POST /api/contact
exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (!isEmailConfigured()) {
    res.status(503);
    throw new Error(
      'Message service is not configured yet. Please WhatsApp us at +94 72 330 3946 or email anurafurniture238@gmail.com.'
    );
  }

  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || '',
    subject: subject.trim(),
    message: message.trim(),
  };

  const storeNotified = await notifyStore({
    subject: `[Anura Furniture] Contact: ${payload.subject}`,
    html: emailTemplates.storeContactMessage(payload),
  });

  if (!storeNotified) {
    res.status(503);
    throw new Error('Could not deliver your message. Please try WhatsApp or call us directly.');
  }

  try {
    await sendEmail({
      to: payload.email,
      subject: 'We received your message – Anura Furniture',
      html: emailTemplates.contactAutoReply(payload),
    });
  } catch (err) {
    console.error('Contact auto-reply failed:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Thank you! Your message was sent. We will reply within 24 hours.',
  });
});
