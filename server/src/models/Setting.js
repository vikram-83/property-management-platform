const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'Property Management' },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'UTC' },
    maintenanceEmail: { type: String, default: '' },
    notificationEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
