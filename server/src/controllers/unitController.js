const Unit = require('../models/Unit');
const Building = require('../models/Building');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Lease = require('../models/Lease');

// @desc    Get units with complex filtering, search, and pagination
// @route   GET /api/units
// @access  Private (Manager/Admin/Staff)
exports.getUnits = async (req, res, next) => {
  try {
    const {
      search,
      building,
      floor,
      unitType,
      occupancyStatus,
      minRent,
      maxRent,
      propertyId,
    } = req.query;

    let query = {};

    if (propertyId) query.property = propertyId;
    if (building) query.building = building;
    if (floor !== undefined && floor !== '') query.floor = Number(floor);
    if (unitType) query.type = unitType;
    if (occupancyStatus) query.status = occupancyStatus;

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (search) {
      query.$or = [
        { unitNumber: { $regex: search, $options: 'i' } },
        { unitId: { $regex: search, $options: 'i' } },
      ];
    }

    const units = await Unit.find(query)
      .populate('building', 'name buildingId')
      .populate('tenant', 'name email phone')
      .populate('currentLease', 'startDate endDate rentAmount status')
      .sort({ floor: 1, unitNumber: 1 });

    res.status(200).json({ success: true, count: units.length, data: units });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single unit overview with maintenance history & active lease
// @route   GET /api/units/:id
// @access  Private
exports.getUnitById = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('building', 'name buildingId')
      .populate('tenant', 'name email phone')
      .populate('currentLease');

    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    const maintenanceTickets = await MaintenanceTicket.find({ unit: unit._id })
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        unit,
        maintenanceTickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new unit
// @route   POST /api/units
// @access  Private (Manager/Admin)
exports.createUnit = async (req, res, next) => {
  try {
    const { unitId, unitNumber, property, building, floor, type, rent, status } = req.body;

    const existing = await Unit.findOne({ unitId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Unit ID already exists' });
    }

    const unit = await Unit.create({
      unitId,
      unitNumber,
      property,
      building,
      floor,
      type,
      rent,
      status: status || 'available',
    });

    // Update parent building metrics
    if (building) {
      const total = await Unit.countDocuments({ building });
      const occupied = await Unit.countDocuments({ building, status: 'occupied' });
      await Building.findByIdAndUpdate(building, {
        totalUnits: total,
        occupiedUnits: occupied,
        vacantUnits: total - occupied,
      });
    }

    res.status(201).json({ success: true, data: unit });
  } catch (error) {
    next(error);
  }
};

// @desc    Update unit specifications
// @route   PUT /api/units/:id
// @access  Private (Manager/Admin)
exports.updateUnit = async (req, res, next) => {
  try {
    let unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: unit });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign tenant to a unit
// @route   PUT /api/units/:id/assign-tenant
// @access  Private (Manager/Admin)
exports.assignTenant = async (req, res, next) => {
  try {
    const { tenantId, leaseId } = req.body;

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      {
        tenant: tenantId,
        currentLease: leaseId || null,
        status: 'occupied',
        isOccupied: true,
      },
      { new: true }
    ).populate('tenant', 'name email phone');

    if (unit.building) {
      const total = await Unit.countDocuments({ building: unit.building });
      const occupied = await Unit.countDocuments({ building: unit.building, status: 'occupied' });
      await Building.findByIdAndUpdate(unit.building, {
        totalUnits: total,
        occupiedUnits: occupied,
        vacantUnits: total - occupied,
      });
    }

    res.status(200).json({ success: true, message: 'Tenant assigned successfully', data: unit });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark unit as vacant / remove tenant assignment
// @route   PUT /api/units/:id/mark-vacant
// @access  Private (Manager/Admin)
exports.markVacant = async (req, res, next) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      {
        tenant: null,
        currentLease: null,
        status: 'available',
        isOccupied: false,
      },
      { new: true }
    );

    if (unit.building) {
      const total = await Unit.countDocuments({ building: unit.building });
      const occupied = await Unit.countDocuments({ building: unit.building, status: 'occupied' });
      await Building.findByIdAndUpdate(unit.building, {
        totalUnits: total,
        occupiedUnits: occupied,
        vacantUnits: total - occupied,
      });
    }

    res.status(200).json({ success: true, message: 'Unit marked as vacant', data: unit });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete unit
// @route   DELETE /api/units/:id
// @access  Private (Manager/Admin)
exports.deleteUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    await unit.deleteOne();

    if (unit.building) {
      const total = await Unit.countDocuments({ building: unit.building });
      const occupied = await Unit.countDocuments({ building: unit.building, status: 'occupied' });
      await Building.findByIdAndUpdate(unit.building, {
        totalUnits: total,
        occupiedUnits: occupied,
        vacantUnits: total - occupied,
      });
    }

    res.status(200).json({ success: true, message: 'Unit removed successfully' });
  } catch (error) {
    next(error);
  }
};