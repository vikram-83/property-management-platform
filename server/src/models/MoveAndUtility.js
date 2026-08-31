const mongoose = require('mongoose');

// 1. Move-In / Move-Out Inspection Schema
const inspectionSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  moveIn: {
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
    rooms: [{
      room: { type: String, required: true },
      condition: { type: String, required: true },
      photos: [{ type: String }]
    }]
  },
  moveOut: {
    scheduled: { type: Boolean, default: false },
    date: { type: Date, default: null },
    rooms: [{
      room: { type: String },
      condition: { type: String },
      photos: [{ type: String }]
    }]
  }
}, { timestamps: true });

// 2. Move-Out Request Schema
const moveOutRequestSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedDate: { type: Date, required: true },
  inspectionDate: { type: Date, default: null },
  reason: { type: String, required: true },
  status: { type: String, enum: ['not_requested', 'pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  depositStatus: { type: String, enum: ['pending', 'processing', 'refunded'], default: 'pending' },
  refundAmount: { type: Number, default: 0 },
  requiredDocuments: [{ type: String, default: 'NOC / Agreement' }]
}, { timestamps: true });

// 3. Utility Consumption Schema
const utilitySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // Format: "YYYY-MM"
  electricity: {
    currentReading: { type: Number, required: true },
    previousReading: { type: Number, required: true },
    consumption: { type: Number, required: true },
    unit: { type: String, default: 'kWh' }
  },
  water: {
    currentReading: { type: Number, required: true },
    previousReading: { type: Number, required: true },
    consumption: { type: Number, required: true },
    unit: { type: String, default: 'KL' }
  }
}, { timestamps: true });

module.exports = {
  Inspection: mongoose.model('Inspection', inspectionSchema),
  MoveOutRequest: mongoose.model('MoveOutRequest', moveOutRequestSchema),
  Utility: mongoose.model('Utility', utilitySchema)
};