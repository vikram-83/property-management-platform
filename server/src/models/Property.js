const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String,
      country: { type: String, default: "India" },
    },
    type: {
      type: String,
      enum: ["residential", "commercial", "mixed"],
      default: "residential",
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: String,
    images: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
