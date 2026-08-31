const mongoose = require('mongoose');

const rentPaymentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
    amount: { type: Number, default: 0 },
    paymentDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue', 'failed', 'refunded'],
      default: 'pending',
    },
    dueDate: { type: Date, default: null },
    paymentMethod: { type: String, default: '-' },
    transactionId: { type: String, default: '-' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RentPayment', rentPaymentSchema);
