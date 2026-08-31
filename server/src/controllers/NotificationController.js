// controllers/notificationController.js
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

// Get All Notifications for Logged-In User
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
};

// Create & Send Real-Time Notification
exports.createNotification = async (req, res) => {
  try {
    const { recipient, title, message, type, referenceId } = req.body;

    const notification = await Notification.create({
      recipient,
      sender: req.user._id, // Logged in user creating notification (Admin/Manager)
      title,
      message,
      type: type ? type.toUpperCase() : 'SYSTEM',
      referenceId: referenceId || null
    });

    // Real-Time Socket Event Emit
    try {
      const io = notificationService.getIO();
      io.to(recipient.toString()).emit('new_notification', notification);
    } catch (socketErr) {
      console.log('Socket emission failed:', socketErr.message);
    }

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating notification', error: error.message });
  }
};

// Mark Single Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
  }
};

// Mark All Notifications as Read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notifications', error: error.message });
  }
};