const MaintenanceTicket = require('../models/MaintenanceTicket');
const { getPagination } = require('../utils/pagination');

// Helper: Race-condition safe sequence generator
const generateTicketId = async () => {
  const lastTicket = await MaintenanceTicket.findOne().sort({ createdAt: -1 }).select('ticketId');
  if (!lastTicket || !lastTicket.ticketId) {
    return 'MT1001';
  }
  const numericId = parseInt(lastTicket.ticketId.replace('MT', ''), 10);
  return `MT${isNaN(numericId) ? 1001 : numericId + 1}`;
};

// GET /api/maintenance
exports.getTickets = async (req, res, next) => {
  try {
    const { property, building, unit, category, priority, status, assignedStaff, assignedVendor, search, page, limit } = req.query;
    const query = {};

    if (property) query.property = property;
    if (building) query.building = building;
    if (unit) query.unit = unit;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    if (assignedStaff) {
      query['assignedTo.type'] = 'staff';
      query['assignedTo.id'] = assignedStaff;
    }
    if (assignedVendor) {
      query['assignedTo.type'] = 'vendor';
      query['assignedTo.id'] = assignedVendor;
    }

    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Role-based Access Control
    if (req.user.role === 'tenant') query.tenant = req.user._id;
    if (req.user.role === 'staff') {
      query['assignedTo.type'] = 'staff';
      query['assignedTo.id'] = req.user._id;
    }

    const { skip, take } = getPagination(page, limit);
    const [tickets, total] = await Promise.all([
      MaintenanceTicket.find(query)
        .populate('property', 'name')
        .populate('building', 'name')
        .populate('unit', 'unitNumber')
        .populate('tenant', 'name email phone')
        .populate({
          path: 'assignedTo.id',
          select: 'name phone email companyName'
        })
        .populate('comments.author', 'name role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      MaintenanceTicket.countDocuments(query)
    ]);

    res.status(200).json({ success: true, count: tickets.length, total, data: tickets });
  } catch (error) {
    next(error);
  }
};

// GET /api/maintenance/:id
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await MaintenanceTicket.findById(req.params.id)
      .populate('property', 'name address')
      .populate('building', 'name')
      .populate('unit', 'unitNumber')
      .populate('tenant', 'name email phone')
      .populate({
        path: 'assignedTo.id',
        select: 'name phone email companyName'
      })
      .populate('comments.author', 'name role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// POST /api/maintenance
exports.createTicket = async (req, res, next) => {
  try {
    const ticketId = await generateTicketId();
    const imagePaths = req.files ? req.files.map((f) => f.path) : [];

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const ticketData = {
      ...req.body,
      ticketId,
      tenant: req.user.role === 'tenant' ? req.user._id : req.body.tenant,
      images: imagePaths,
      status: req.body.status || 'reported',
      timeline: [
        {
          status: 'reported',
          time: currentTime
        }
      ]
    };

    const ticket = await MaintenanceTicket.create(ticketData);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// PUT /api/maintenance/:id
exports.updateTicket = async (req, res, next) => {
  try {
    const { priority, status, assignedTo, expectedCompletion } = req.body;
    
    const ticket = await MaintenanceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const role = req.user.role;
    const userId = req.user._id.toString();

    // Staff can only update status on their assigned ticket
    if (role === 'staff') {
      const assignedId = ticket.assignedTo?.id?.toString();
      if (ticket.assignedTo?.type !== 'staff' || assignedId !== userId) {
        return res.status(403).json({ success: false, message: 'You can only update your own assigned tickets' });
      }
    }

    // Vendor can only update status on their assigned ticket
    if (role === 'vendor') {
      const assignedId = ticket.assignedTo?.id?.toString();
      if (ticket.assignedTo?.type !== 'vendor' || assignedId !== userId) {
        return res.status(403).json({ success: false, message: 'You can only update your own assigned jobs' });
      }
    }

    // Only admin/manager can reassign or change priority/expectedCompletion
    if (['admin', 'manager'].includes(role)) {
      if (priority) ticket.priority = priority;
      if (assignedTo) ticket.assignedTo = assignedTo;
      if (expectedCompletion) ticket.expectedCompletion = expectedCompletion;
    }

    // Any authorized role can update status
    if (status && status !== ticket.status) {
      ticket.status = status;
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ticket.timeline.push({ status, time: currentTime });
    }

    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// POST /api/maintenance/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const ticket = await MaintenanceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.comments.push({ author: req.user._id, text });
    await ticket.save();

    const updatedTicket = await MaintenanceTicket.findById(req.params.id)
      .populate('comments.author', 'name role');

    res.status(200).json({ success: true, data: updatedTicket.comments });
  } catch (error) {
    next(error);
  }
};