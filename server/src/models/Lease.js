const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema(
  {
    leaseId: {
      type: String,
      required: true,
      unique: true,
      default: () => `LEASE-${Math.floor(1000 + Math.random() * 9000)}`
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'pending_renewal', 'terminated'],
      default: 'active'
    },
    duration: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    financial: {
      monthlyRent: { type: Number, required: true },
      securityDeposit: { type: Number, required: true },
      maintenance: { type: Number, default: 0 }
    },
    renewal: {
      eligible: { type: Boolean, default: true },
      renewalWindow: { type: String, default: '30 days before expiry' }
    },
    renewalRequest: {
      status: {
        type: String,
        enum: ['not_requested', 'pending', 'approved', 'rejected'],
        default: 'not_requested'
      },
      preferredDuration: { type: String, default: '12 months' },
      requestedRent: { type: Number, default: null },
      tenantComment: { type: String, default: '' },
      requestedAt: { type: Date }
    },
    termsAndConditions: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lease', leaseSchema);