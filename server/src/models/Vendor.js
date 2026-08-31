const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    serviceCategory: {
      type: String,
      enum: ["plumbing", "electrical", "hvac", "cleaning", "security", "general"],
      default: "general",
    },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
