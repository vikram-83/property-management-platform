const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personal: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: { type: String, default: '/images/profile.jpg' }
  },
  emergencyContact: {
    name: { type: String, default: '' },
    relationship: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  preferences: {
    language: { type: String, default: 'English' },
    notification: {
      rent: { type: Boolean, default: true },
      maintenance: { type: Boolean, default: true },
      booking: { type: Boolean, default: true },
      announcement: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);