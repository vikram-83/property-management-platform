const Notification = require('../models/Notification');

const createNotification = async ({ user, title, message, type = 'INFO', link = '' }) => {
  try {
    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      link,
    });

    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
    return null;
  }
};

module.exports = { createNotification };
