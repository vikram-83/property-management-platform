const Building = require('../models/Building');
const Unit = require('../models/Unit');
const MaintenanceTicket = require('../models/MaintenanceTicket');

// @desc    Get all buildings with search, filter, and property scoping
// @route   GET /api/buildings
// @access  Private (Manager/Admin)
exports.getBuildings = async (req, res, next) => {
  try {
    const { search, propertyId, status } = req.query;
    let query = {};

    if (propertyId) query.property = propertyId;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { buildingId: { $regex: search, $options: 'i' } },
      ];
    }

    const buildings = await Building.find(query)
      .populate('property', 'name address')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: buildings.length, data: buildings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single building with linked units & maintenance stats
// @route   GET /api/buildings/:id
// @access  Private (Manager/Admin)
exports.getBuildingById = async (req, res, next) => {
  try {
    const building = await Building.findById(req.params.id).populate('property', 'name');

    if (!building) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    const units = await Unit.find({ building: req.params.id });
    const maintenanceTickets = await MaintenanceTicket.find({
      building: req.params.id,
      status: { $in: ['Pending', 'In Progress'] },
    });

    res.status(200).json({
      success: true,
      data: {
        building,
        units,
        maintenanceCount: maintenanceTickets.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new building
// @route   POST /api/buildings
// @access  Private (Manager/Admin)
exports.createBuilding = async (req, res, next) => {
  try {
    const { buildingId, name, floors, totalUnits, property } = req.body;

    const existing = await Building.findOne({ buildingId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Building ID already exists' });
    }

    const building = await Building.create({
      buildingId,
      name,
      floors,
      totalUnits,
      property,
      vacantUnits: totalUnits,
    });

    res.status(201).json({ success: true, data: building });
  } catch (error) {
    next(error);
  }
};

// @desc    Update building details
// @route   PUT /api/buildings/:id
// @access  Private (Manager/Admin)
exports.updateBuilding = async (req, res, next) => {
  try {
    let building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    if (req.body.totalUnits !== undefined || req.body.occupiedUnits !== undefined) {
      const total = req.body.totalUnits ?? building.totalUnits;
      const occupied = req.body.occupiedUnits ?? building.occupiedUnits;
      req.body.vacantUnits = Math.max(0, total - occupied);
    }

    building = await Building.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: building });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or archive building
// @route   DELETE /api/buildings/:id
// @access  Private (Manager/Admin)
exports.deleteBuilding = async (req, res, next) => {
  try {
    const { mode } = req.query; // 'archive' or 'permanent'

    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    if (mode === 'archive') {
      building.status = 'archived';
      await building.save();
      return res.status(200).json({ success: true, message: 'Building archived successfully' });
    }

    await building.deleteOne();
    res.status(200).json({ success: true, message: 'Building removed permanently' });
  } catch (error) {
    next(error);
  }
};