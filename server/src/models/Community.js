const mongoose = require('mongoose');

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, default: 'Community Hall' },
  type: { type: String, enum: ['Event', 'Notice', 'Update'], default: 'Notice' },
  createdBy: { type: String, default: 'Property Manager' }
}, { timestamps: true });

// Poll Schema
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    optionText: { type: String, required: true },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Lost & Found Schema
const lostAndFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['LOST', 'FOUND'], required: true },
  contactInfo: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = {
  Announcement: mongoose.model('Announcement', announcementSchema),
  Poll: mongoose.model('Poll', pollSchema),
  LostAndFound: mongoose.model('LostAndFound', lostAndFoundSchema)
};