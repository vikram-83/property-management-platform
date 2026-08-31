const Notification = require("../models/Notification");

/**
 * Send in-app notification & emit real-time Socket.io event
 */
const sendNotification = async (req, { userId, title, message, type, link }) => {
  try {
    // 1. Save to database
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: type || "INFO",
      link: link || "",
    });

    // 2. Emit Real-time Socket Event if socket server is present
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${userId}`).emit("notification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }
};

module.exports = { sendNotification };