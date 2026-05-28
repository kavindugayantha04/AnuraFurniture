const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order', 'promotion', 'system', 'review', 'chat', 'alert'],
      default: 'system',
    },
    link: String,
    image: String,
    isRead: { type: Boolean, default: false },
    data: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
