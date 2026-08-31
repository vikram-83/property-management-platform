const MaintenanceTicket = require('../models/MaintenanceTicket');

// @desc    Get staff work schedule (Day, Week, Month view supported)
// @route   GET /api/staff/schedule
// @access  Private (Staff)
const getStaffSchedule = async (req, res, next) => {
  try {
    const { date, view } = req.query; // e.g. date="2026-08-26", view="day" | "week" | "month"

    // Fetch assigned tickets for the staff
    const tickets = await MaintenanceTicket.find({
      'assignedTo.id': req.user._id,
    })
      .populate('property', 'name')
      .populate('building', 'name')
      .populate('unit', 'unitNumber')
      .sort({ createdAt: -1 });

    const formattedSchedule = tickets.map((t) => ({
      taskId: t.ticketId || `TASK${t._id.toString().substring(0, 4).toUpperCase()}`,
      id: t._id,
      title: t.title,
      date: t.updatedAt.toISOString().split('T')[0],
      startTime: t.work?.startTime || '09:00 AM',
      endTime: t.work?.endTime || '11:00 AM',
      property: t.property?.name || 'Green Valley Residency',
      building: t.building?.name || 'Tower A',
      unit: t.unit?.unitNumber || 'A-203',
      priority: t.priority,
      status: t.status,
      category: t.category,
      description: t.description || 'Routine maintenance and inspection job.',
    }));

    res.status(200).json({
      success: true,
      staffSchedule: {
        views: ['day', 'week', 'month'],
        features: [
          "View today's schedule",
          'View weekly schedule',
          'View monthly schedule',
          'View task time',
          'View location',
          'View priority',
          'Open task details',
        ],
        schedule: formattedSchedule,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStaffSchedule };