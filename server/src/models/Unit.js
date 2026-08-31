const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    unitId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    unitNumber: {
      type: String,
      required: [true, 'Please provide a unit number (e.g. A-101)'],
      trim: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Unit must belong to a property'],
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: [true, 'Unit must belong to a building'],
    },
    floor: {
      type: Number,
      required: [true, 'Please specify floor number'],
      min: 0,
    },
    type: {
      type: String,
      required: [true, 'Please specify unit type'],
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Penthouse', 'Commercial'],
      default: '2BHK',
    },
    rent: {
      type: Number,
      required: [true, 'Please set monthly rent amount'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance', 'inactive'],
      default: 'available',
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    currentLease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lease',
      default: null,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Keep isOccupied flag synchronized with status enum
unitSchema.pre('save', function (next) {
  this.isOccupied = this.status === 'occupied';
  next();
});

module.exports = mongoose.model('Unit', unitSchema);