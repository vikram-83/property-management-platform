// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router
  .route('/')
  .get(getNotifications)
  .post(authorize('admin', 'manager'), createNotification);

router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

module.exports = router;