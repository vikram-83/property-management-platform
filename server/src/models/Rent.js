const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      required: true,
      unique: true,
      default: () => `BILL-${Math.floor(100000 + Math.random() * 900000)}`
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lease',
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    currentBill: {
      rent: { type: Number, required: true, default: 15000 },
      maintenance: { type: Number, default: 1000 },
      electricity: { type: Number, default: 500 },
      water: { type: Number, default: 200 },
      lateFee: { type: Number, default: 0 },
      total: { type: Number, required: true, default: 16700 }
    },
    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
      },
      paidAt: { type: Date },
      transactionId: { type: String },
      method: {
        type: String,
        enum: ['UPI', 'Card', 'Net Banking'],
        default: 'UPI'
      }
    },
    rentPrediction: {
      nextMonthEstimatedAmount: { type: Number, default: 16700 },
      basedOn: {
        type: [String],
        default: ['Monthly Rent', 'Maintenance Charges', 'Utility Usage']
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rent', rentSchema);