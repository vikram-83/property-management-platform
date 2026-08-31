const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}, { _id: false });

const maintenanceTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    category: {
      type: String,
      enum: ['Electrical', 'Plumbing', 'AC', 'Internet', 'Cleaning', 'Appliance', 'Carpentry', 'Security', 'Other'],
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    isEmergency: { type: Boolean, default: false },
    emergencyCategory: {
      type: String,
      enum: ['Major Water Leakage', 'Power Failure', 'Gas Problem', 'Security Issue', 'Lockout', 'None'],
      default: 'None'
    },
    location: { type: String, default: '' },
    preferredDate: { type: String },
    preferredTime: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    status: {
      type: String,
      enum: ['reported', 'reviewed', 'assigned', 'staffAccepted', 'onTheWay', 'inProgress', 'completed', 'tenantConfirmed'],
      default: 'reported'
    },
    assignedTo: {
      type: { type: String, enum: ['staff', 'vendor'] },
      id: { type: mongoose.Schema.Types.ObjectId, refPath: 'assignedTo.type' }
    },
    comments: [commentSchema],
    timeline: [timelineSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);