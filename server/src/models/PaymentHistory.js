const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema(
  {
    transactionIdCustom: {
      type: String,
      required: true,
      unique: true,
      default: () => `PAY${Math.floor(100 + Math.random() * 900)}`
    },
    invoiceNumber: {
      type: String,
      required: true,
      default: () => `INV${Math.floor(100 + Math.random() * 900)}`
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 16700
    },
    method: {
      type: String,
      enum: ['UPI', 'Card', 'Net Banking'],
      required: true,
      default: 'UPI'
    },
    gatewayTransactionId: {
      type: String,
      required: true,
      default: () => `TXN${Math.floor(10000 + Math.random() * 90000)}`
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      required: true,
      default: 'success'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);