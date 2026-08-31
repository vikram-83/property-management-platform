const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['reported', 'reviewed', 'assigned', 'staffAccepted', 'onTheWay', 'workStarted', 'completed', 'tenantConfirmed'],
    required: true
  },
  time: {
    type: String,
    required: true,
    default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}, { _id: false });

const maintenanceSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    default: () => `MT${Math.floor(1000 + Math.random() * 9000)}`
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'inProgress', 'completed', 'resolved'],
    default: 'open'
  },
  assignedStaff: {
    name: { type: String, default: 'Not Assigned' },
    phone: { type: String, default: '**********' }
  },
  timeline: [timelineSchema]
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);