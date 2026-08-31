// models/Amenity.js
const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: '' },
  description: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Amenity', amenitySchema);