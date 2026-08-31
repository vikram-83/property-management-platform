// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  type: { type: String, default: 'PDF' },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Lease Agreement', 
      'Rent Invoice', 
      'Payment Receipt', 
      'Maintenance Report', 
      'Notices', 
      'Property Documents'
    ] 
  },
  version: { type: String, default: 'v1' },
  date: { type: String, required: true } // Format: YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);