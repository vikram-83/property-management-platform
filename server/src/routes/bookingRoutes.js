// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes below require authentication
router.use(protect);

// Main Booking Routes
router
  .route('/')
  .get(getBookings) // Tenants view their own; Admin/Manager view all
  .post(authorize('tenant'), createBooking); // Only Tenants can create bookings

// Single Booking Details
router
  .route('/:id')
  .get(getBookingById); // Get specific booking details

// Admin & Manager Route: Update Status (e.g., confirmed, completed, rejected)
router
  .route('/:id/status')
  .put(authorize('admin', 'manager'), updateBookingStatus);

// Tenant Actions: Reschedule & Cancel
router
  .route('/:id/reschedule')
  .put(authorize('tenant'), rescheduleBooking);

router
  .route('/:id/cancel')
  .patch(authorize('tenant'), cancelBooking);

module.exports = router;