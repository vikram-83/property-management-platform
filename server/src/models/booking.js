// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true },
  amenity: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // e.g., "06:00 PM - 07:00 PM"
  guests: { type: Number, required: true, max: 4 },
  status: { type: String, enum: ['confirmed', 'cancelled', 'rescheduled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);