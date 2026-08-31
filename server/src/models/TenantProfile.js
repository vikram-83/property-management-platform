const mongoose = require('mongoose');

const tenantProfileSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      default: null,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      default: null,
    },
    rent: {
      type: Number,
      default: 0,
    },
    leaseStatus: {
      type: String,
      enum: ['active', 'expired', 'pending', 'terminated', 'none'],
      default: 'none',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue', 'partial'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TenantProfile', tenantProfileSchema);