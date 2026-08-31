const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['MAINTENANCE', 'PAYMENT', 'BOOKING', 'SYSTEM', 'ANNOUNCEMENT'], 
      default: 'SYSTEM' 
    },
    referenceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      default: null 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    readAt: { 
      type: Date, 
      default: null 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);