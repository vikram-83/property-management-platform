const ReportLog = require('../models/ReportLog');
const Property = require('../models/Property');

// GET /api/reports/available
exports.getAvailableReports = async (req, res, next) => {
  try {
    const reports = [
      'Property Occupancy Report',
      'Rent Collection Report',
      'Pending Payment Report',
      'Tenant Report',
      'Maintenance Report',
      'Maintenance Cost Report',
      'Amenity Usage Report',
      'Booking Report',
      'Unit Vacancy Report',
      'Lease Expiry Report'
    ];

    res.status(200).json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// POST /api/reports/generate (Strictly Scope-Limited to Manager's Assigned Properties)
exports.generateReport = async (req, res, next) => {
  try {
    const { reportType, filters, format } = req.body;

    // Fetch Manager's Assigned Properties
    let assignedPropertyIds = req.user.assignedProperties || [];

    // Override filter property if explicitly supplied, provided it belongs to assigned list
    if (filters?.property) {
      if (!assignedPropertyIds.includes(filters.property) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Requested property is not assigned to your manager profile.'
        });
      }
      assignedPropertyIds = [filters.property];
    }

    // Log the generated report audit trail
    const log = await ReportLog.create({
      reportType,
      generatedBy: req.user._id,
      assignedProperties: assignedPropertyIds,
      filtersApplied: filters || {},
      format: format || 'PDF'
    });

    res.status(200).json({
      success: true,
      message: `${reportType} successfully generated as ${format}`,
      auditLogId: log._id,
      scopedPropertyCount: assignedPropertyIds.length
    });
  } catch (error) {
    next(error);
  }
};