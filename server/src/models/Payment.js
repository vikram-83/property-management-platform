const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    building: { type: String, required: true },
    unit: { type: String, required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true }, // Format: YYYY-MM-DD
    paymentDate: { type: String, default: null }, // Format: YYYY-MM-DD
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: { type: String, default: '-' },
    transactionId: { type: String, default: '-' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);