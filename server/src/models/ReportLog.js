const mongoose = require('mongoose');

const reportLogSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: [
        'Property Occupancy Report',
        'Rent Collection Report',
        'Pending Payment Report',
        'Tenant Report',
        'Maintenance Report',
        'Maintenance Cost Report',
        'Amenity Usage Report',
        'Booking Report',
        'Unit Vacancy Report',
        'Lease Expiry Report'
      ],
      required: true
    },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    filtersApplied: { type: Object, default: {} },
    format: { type: String, enum: ['PDF', 'CSV', 'Print'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReportLog', reportLogSchema);