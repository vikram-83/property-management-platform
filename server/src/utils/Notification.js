const Notification = require('../models/Notification');

/**
 * Helper utility to trigger in-app notifications throughout application workflows.
 */
const createNotification = async ({ recipient, sender = null, title, message, type = 'SYSTEM', referenceId = null }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      title,
      message,
      type,
      referenceId
    });

    // Integrated WebSockets emit placeholder if socket instance is attached to app
    if (global.io) {
      global.io.to(recipient.toString()).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

module.exports = { createNotification };