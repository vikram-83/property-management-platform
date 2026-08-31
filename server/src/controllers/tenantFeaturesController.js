const { Inspection, MoveOutRequest, Utility } = require('../models/MoveAndUtility');

// --- INSPECTION HANDLERS ---
exports.getInspection = async (req, res) => {
  try {
    let inspection = await Inspection.findOne({ tenantId: req.user._id });
    if (!inspection) {
      inspection = await Inspection.create({
        tenantId: req.user._id,
        moveIn: {
          date: new Date(),
          status: 'completed',
          rooms: [
            { room: 'Living Room', condition: 'Good', photos: [] },
            { room: 'Bedroom', condition: 'Good', photos: [] }
          ]
        }
      });
    }
    res.status(200).json({ success: true, data: inspection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateInspectionRoom = async (req, res) => {
  try {
    const { type, room, condition, photos } = req.body; // type: 'moveIn' or 'moveOut'
    const inspection = await Inspection.findOne({ tenantId: req.user._id });

    if (inspection) {
      inspection[type].rooms.push({ room, condition, photos });
      await inspection.save();
    }
    res.status(200).json({ success: true, data: inspection });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- MOVE-OUT HANDLERS ---
exports.getMoveOutRequest = async (req, res) => {
  try {
    const request = await MoveOutRequest.findOne({ tenantId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: request || { status: 'not_requested' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMoveOutRequest = async (req, res) => {
  try {
    const { requestedDate, reason } = req.body;
    const newRequest = await MoveOutRequest.create({
      tenantId: req.user._id,
      requestedDate,
      reason,
      status: 'pending'
    });
    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- UTILITY HANDLERS ---
exports.getUtilities = async (req, res) => {
  try {
    const utilities = await Utility.find({ tenantId: req.user._id }).sort({ month: -1 });
    res.status(200).json({ success: true, data: utilities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};