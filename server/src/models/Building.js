const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
  {
    buildingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Please assign a property'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a building name'],
      trim: true,
    },
    floors: {
      type: Number,
      required: [true, 'Please specify total floors'],
      min: 1,
    },
    totalUnits: {
      type: Number,
      required: [true, 'Please specify total units'],
      default: 0,
    },
    occupiedUnits: {
      type: Number,
      default: 0,
    },
    vacantUnits: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'under_maintenance'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate vacant units automatically
buildingSchema.pre('save', function (next) {
  this.vacantUnits = Math.max(0, this.totalUnits - this.occupiedUnits);
  next();
});

module.exports = mongoose.model('Building', buildingSchema);