const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});

const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
});

const toggleRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  const userId = req.user._id;
  const isRead = notification.readBy.includes(userId);

  if (isRead) {
    notification.readBy.pull(userId);
  } else {
    notification.readBy.push(userId);
  }

  await notification.save();
  res.json(notification);
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  await notification.deleteOne();
  res.json({ message: "Notification deleted" });
});

module.exports = { getNotifications, createNotification, toggleRead, deleteNotification };