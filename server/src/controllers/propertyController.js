const Property = require('../models/Property');
const Building = require('../models/Building');
const Unit = require('../models/Unit');
const Lease = require('../models/Lease');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Booking = require('../models/booking');

// @desc    Get all properties with optional search filter
// @route   GET /api/properties
// @access  Private
exports.getProperties = async (req, res, next) => {
  try {
    const query = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};
    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Manager/Admin)
exports.createProperty = async (req, res, next) => {
  try {
    const property = await Property.create({ ...req.body, manager: req.user._id });
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing property
// @route   PUT /api/properties/:id
// @access  Private (Manager/Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Manager/Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed property statistics and metadata
// @route   GET /api/properties/:id/details
// @access  Private (Manager/Admin)
exports.getPropertyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const buildingsCount = await Building.countDocuments({ property: id });
    const totalUnits = await Unit.countDocuments({ property: id });
    const occupiedUnits = await Unit.countDocuments({ property: id, isOccupied: true });
    const vacantUnits = totalUnits - occupiedUnits;

    const activeTenants = await Lease.countDocuments({
      property: id,
      status: 'Active',
    });

    const maintenanceTicketsCount = await MaintenanceTicket.countDocuments({
      property: id,
      status: { $in: ['Pending', 'In Progress'] },
    });

    const amenityBookingsCount = await Booking.countDocuments({
      property: id,
      status: 'Confirmed',
    });

    const responsePayload = {
      overview: {
        propertyName: property.name,
        address: `${property.address?.city || ''}, ${property.address?.state || ''}`.trim(),
        propertyType: property.type || 'Apartment',
        status: property.status || 'active',
      },
      statistics: {
        buildings: buildingsCount,
        units: totalUnits,
        occupied: occupiedUnits,
        vacant: vacantUnits,
        tenants: activeTenants,
        maintenanceTickets: maintenanceTicketsCount,
        amenityBookings: amenityBookingsCount,
      },
      tabs: [
        'Overview',
        'Buildings',
        'Units',
        'Tenants',
        'Maintenance',
        'Amenities',
        'Bookings',
        'Payments',
      ],
    };

    res.status(200).json({ success: true, data: responsePayload });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Digital Property Pass & Specs for Tenant
// @route   GET /api/properties/my-digital-property
// @access  Private (Tenant)
exports.getMyDigitalProperty = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const lease = await Lease.findOne({ tenant: userId, status: 'Active' })
      .populate({
        path: 'unit',
        populate: { path: 'building property' }
      });

    if (!lease || !lease.unit) {
      return res.status(404).json({
        success: false,
        message: 'No active property assignment found for this tenant.'
      });
    }

    const { unit } = lease;
    const property = unit.property;
    const building = unit.building;

    const responsePayload = {
      property: {
        name: property?.name || "Green Valley Residency",
        address: `${property?.address?.street || 'Satna'}, ${property?.address?.city || 'Madhya Pradesh'}`,
        building: building?.name || "Tower A",
        unit: unit.unitNumber || "A-203"
      },
      unit: {
        type: unit.type || "2BHK",
        floor: unit.floor || 2,
        area: unit.area ? `${unit.area} sqft` : "1200 sqft",
        bedrooms: unit.bedrooms || 2,
        bathrooms: unit.bathrooms || 2,
        balcony: unit.balcony || 1
      },
      assets: unit.assets && unit.assets.length > 0 ? unit.assets : [
        { name: "AC", assetId: "AST001", condition: "Good", installedDate: "2025-06-10" },
        { name: "Geyser", assetId: "AST002", condition: "Good" }
      ],
      parking: {
        slot: unit.parkingSlot || "P-23",
        type: unit.parkingType || "Car"
      },
      meterReading: {
        electricity: unit.currentElectricityMeter || 12450,
        water: unit.currentWaterMeter || 3200
      }
    };

    res.status(200).json({ success: true, myProperty: responsePayload });
  } catch (error) {
    next(error);
  }
};