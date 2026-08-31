// controllers/bookingController.js
const Booking = require('../models/booking');

// Validation Config
const BOOKING_CONFIG = {
  maxGuests: 4,
  advanceBookingDays: 7
};

exports.getBookings = async (req, res) => {
  try {
    const query = ['admin', 'manager'].includes(req.user.role)
      ? {}
      : { tenantId: req.user._id.toString() };
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const canView = ['admin', 'manager'].includes(req.user.role) ||
      booking.tenantId === req.user._id.toString();
    if (!canView) return res.status(403).json({ message: 'Access denied' });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const allowedStatuses = ['confirmed', 'cancelled', 'rescheduled'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

// Get Booking History for Tenant
exports.getBookingHistory = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const bookings = await Booking.find({ tenantId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking history', error: error.message });
  }
};

// Check Availability & Create Booking (Prevents Double Booking)
exports.createBooking = async (req, res) => {
  try {
    const { tenantId, amenity, date, time, guests } = req.body;

    if (guests > BOOKING_CONFIG.maxGuests) {
      return res.status(400).json({ message: `Maximum allowed guests is ${BOOKING_CONFIG.maxGuests}` });
    }

    // Check advance booking days
    const today = new Date();
    const selectedDate = new Date(date);
    const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays > BOOKING_CONFIG.advanceBookingDays || diffDays < 0) {
      return res.status(400).json({ message: `Bookings can only be made up to ${BOOKING_CONFIG.advanceBookingDays} days in advance.` });
    }

    // Prevent Double Booking (Conflict Check)
    const existingBooking = await Booking.findOne({
      amenity,
      date,
      time,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Time slot already booked for this amenity.' });
    }

    const bookingId = 'BOOK' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = new Booking({
      bookingId,
      tenantId,
      amenity,
      date,
      time,
      guests,
      status: 'confirmed'
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    res.status(200).json({ message: 'Booking cancelled successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

// Reschedule Booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const existingBooking = await Booking.findById(id);
    if (!existingBooking) return res.status(404).json({ message: 'Booking not found' });

    // Conflict Check
    const conflict = await Booking.findOne({
      _id: { $ne: id },
      amenity: existingBooking.amenity,
      date,
      time,
      status: 'confirmed'
    });

    if (conflict) {
      return res.status(409).json({ message: 'Selected time slot is unavailable.' });
    }

    existingBooking.date = date;
    existingBooking.time = time;
    existingBooking.status = 'rescheduled';
    await existingBooking.save();

    res.status(200).json({ message: 'Booking rescheduled successfully', booking: existingBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error rescheduling booking', error: error.message });
  }
};