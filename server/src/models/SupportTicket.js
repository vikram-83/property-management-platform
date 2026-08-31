const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Parking', 'Billing', 'Maintenance', 'General', 'Security']
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String, enum: ['tenant', 'admin', 'manager'] },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);