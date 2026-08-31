const MaintenanceTicket = require('../models/MaintenanceTicket');

const assignedQuery = (userId) => ({
  $or: [{ 'assignedTo.id': userId }, { 'assignedTo.id': userId.toString() }],
});

const formatTime = (date) =>
  date
    ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

const availableActions = (status) => {
  switch (status) {
    case 'assigned':
    case 'open':
      return ['Accept Task', 'Report Issue'];
    case 'accepted':
      return ['Start Task', 'Report Issue'];
    case 'inProgress':
      return ['Pause Task', 'Complete Task', 'Report Issue'];
    case 'onHold':
      return ['Resume Task', 'Report Issue'];
    default:
      return [];
  }
};

const formatTask = (t, user) => ({
  taskId: t._id,
  ticketId: t.ticketId || `MT-${t._id.toString().substring(0, 6)}`,
  title: t.title,
  description: t.description,
  category: t.category,
  priority: t.priority,
  property: {
    id: t.property?._id,
    name: t.property?.name || 'N/A',
  },
  location: {
    building: t.building?.name || 'N/A',
    floor: t.floor || 1,
    unit: t.unit?.unitNumber || 'N/A',
  },
  assignedBy: {
    id: t.assignedBy?._id || t.createdBy,
    name: t.assignedBy?.name || 'Property Manager',
    role: t.assignedBy?.role || 'manager',
  },
  assignedTo: {
    id: user._id,
    name: user.name,
  },
  scheduledDate: t.createdAt ? t.createdAt.toISOString().split('T')[0] : '',
  scheduledTime: formatTime(t.createdAt),
  status: t.status,
  createdAt: t.createdAt,
  deadline: t.expectedCompletion || t.createdAt,
  workNotes: t.comments || [],
  workImages: t.images || [],
});

// @desc    Staff dashboard summary
// @route   GET /api/staff/dashboard
const getStaffDashboard = async (req, res, next) => {
  try {
    const tickets = await MaintenanceTicket.find(assignedQuery(req.user._id))
      .populate('property', 'name')
      .populate('building', 'name')
      .populate('unit', 'unitNumber')
      .sort({ createdAt: -1 });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayTickets = tickets.filter(
      (t) => t.createdAt >= start && t.createdAt <= end
    );

    const summaryCards = [
      { title: "Today's Tasks", value: todayTickets.length || tickets.length, icon: 'clipboard', color: 'blue' },
      { title: 'Pending Tasks', value: tickets.filter((t) => ['assigned', 'accepted', 'open'].includes(t.status)).length, icon: 'clock', color: 'amber' },
      { title: 'In Progress', value: tickets.filter((t) => t.status === 'inProgress').length, icon: 'loader', color: 'indigo' },
      { title: 'Completed', value: tickets.filter((t) => ['completed', 'resolved', 'closed'].includes(t.status)).length, icon: 'check-circle', color: 'emerald' },
    ];

    const todaySchedule = (todayTickets.length ? todayTickets : tickets.slice(0, 5)).map((t, idx) => ({
      id: t._id,
      time: t.work?.startTime || formatTime(t.createdAt) || '09:00 AM',
      task: t.title,
      location: t.unit?.unitNumber || t.building?.name || 'N/A',
      property: t.property?.name || 'N/A',
      status: t.status === 'open' ? 'pending' : t.status,
    }));

    const recentTasks = tickets.slice(0, 5).map((t) => ({
      taskId: t.ticketId || `TASK${idxPlaceholder(t)}`,
      id: t._id,
      title: t.title,
      priority: t.priority,
      status: t.status,
    }));

    const alerts = [];
    if (tickets.some((t) => t.priority === 'urgent')) alerts.push('Urgent maintenance task assigned');
    if (tickets.some((t) => t.status === 'assigned')) alerts.push('New task assigned by manager');
    if (tickets.some((t) => t.expectedCompletion && new Date(t.expectedCompletion) < new Date())) {
      alerts.push('Task deadline approaching');
    }

    res.status(200).json({
      success: true,
      header: {
        title: 'Staff Dashboard',
        welcomeMessage: `Welcome, ${req.user.name} 👋`,
      },
      summaryCards,
      todaySchedule,
      recentTasks,
      alerts: alerts.length ? alerts : ['No urgent alerts right now'],
      quickActions: [
        { label: 'View My Tasks', to: '/staff/tasks' },
        { label: "Today's Schedule", to: '/staff/schedule' },
        { label: 'Active Maintenance', to: '/staff/maintenance' },
        { label: 'View Performance', to: '/staff/performance' },
      ],
    });
  } catch (error) {
    next(error);
  }
};

function idxPlaceholder(t) {
  return t._id.toString().substring(0, 4).toUpperCase();
}

// @desc    Get all assigned tasks for logged-in staff with filtering, sorting & search
// @route   GET /api/staff/tasks
// @access  Private (Staff only)
const getMyTasks = async (req, res, next) => {
  try {
    const { status, priority, category, property, date, search, sortBy } = req.query;

    let query = {
      ...assignedQuery(req.user._id),
      'assignedTo.type': 'staff',
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (property) query.property = property;
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'priority') sortOptions = { priority: -1 };
    if (sortBy === 'deadline') sortOptions = { deadline: 1 };

    const tickets = await MaintenanceTicket.find(query)
      .populate('property', 'name')
      .populate('building', 'name')
      .populate('unit', 'unitNumber')
      .populate('assignedBy', 'name role')
      .sort(sortOptions);

    const formattedTasks = tickets.map((t) => formatTask(t, req.user));

    res.status(200).json({
      success: true,
      count: formattedTasks.length,
      data: formattedTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (accept, start, pause, complete, cancel)
// @route   PUT /api/staff/tasks/:id/status
// @access  Private (Staff only)
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['assigned', 'accepted', 'inProgress', 'onHold', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const ticket = await MaintenanceTicket.findOne({
      _id: req.params.id,
      ...assignedQuery(req.user._id),
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    ticket.status = status;
    if (status === 'completed') {
      ticket.resolvedAt = Date.now();
    }
    await ticket.save();

    res.status(200).json({ success: true, message: `Task status updated to ${status}`, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Add work note or issue report to task
// @route   POST /api/staff/tasks/:id/notes
// @access  Private (Staff only)
const addWorkNote = async (req, res, next) => {
  try {
    const { note, isIssue } = req.body;
    const ticket = await MaintenanceTicket.findOne({
      _id: req.params.id,
      ...assignedQuery(req.user._id),
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    ticket.comments.push({
      author: req.user._id,
      text: isIssue ? `[ISSUE REPORTED]: ${note}` : note,
      createdAt: new Date(),
    });

    if (isIssue) {
      ticket.status = 'onHold';
    }

    await ticket.save();

    res.status(200).json({ success: true, message: 'Work note added successfully', data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload proof / work image to task
// @route   POST /api/staff/tasks/:id/images
// @access  Private (Staff only)
const uploadWorkImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body; // Expecting uploaded image URL
    const ticket = await MaintenanceTicket.findOne({
      _id: req.params.id,
      ...assignedQuery(req.user._id),
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    ticket.images.push(imageUrl);
    await ticket.save();

    res.status(200).json({ success: true, message: 'Work image attached successfully', data: ticket });
  } catch (error) {
    next(error);
  }
};

const getTaskDetails = async (req, res, next) => {
  try {
    const ticket = await MaintenanceTicket.findOne({
      _id: req.params.id,
      ...assignedQuery(req.user._id),
    })
      .populate('property', 'name address')
      .populate('building', 'name')
      .populate('unit', 'unitNumber')
      .populate('tenant', 'name phone email')
      .populate('assignedBy', 'name role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      taskDetails: {
        taskInformation: {
          ticketId: ticket.ticketId || `MT-${ticket._id.toString().substring(0, 6)}`,
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          category: ticket.category,
        },
        location: {
          property: ticket.property?.name || 'N/A',
          building: ticket.building?.name || 'N/A',
          floor: ticket.floor || 1,
          unit: ticket.unit?.unitNumber || 'N/A',
        },
        tenant: {
          name: ticket.tenant?.name || 'N/A',
          phone: ticket.tenant?.phone || 'N/A',
        },
        assignment: {
          assignedBy: ticket.assignedBy?.name || 'Property Manager',
          assignedTo: req.user.name,
          assignedDate: ticket.createdAt ? ticket.createdAt.toISOString().split('T')[0] : '',
        },
        schedule: {
          date: ticket.createdAt ? ticket.createdAt.toISOString().split('T')[0] : '',
          startTime: ticket.work?.startTime || '09:00 AM',
          expectedEndTime: ticket.work?.endTime || '11:00 AM',
        },
        actions: availableActions(ticket.status),
        workLog: ticket.workLog || [],
        attachments: (ticket.attachments || []).concat(
          (ticket.images || []).map((url) => ({ url }))
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

const executeTaskAction = async (req, res, next) => {
  try {
    const { action, note, imageUrl } = req.body;
    const ticket = await MaintenanceTicket.findOne({
      _id: req.params.id,
      ...assignedQuery(req.user._id),
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const actionMap = {
      'Accept Task': 'accepted',
      'Start Task': 'inProgress',
      'Pause Task': 'onHold',
      'Resume Task': 'inProgress',
      'Complete Task': 'completed',
      'Report Issue': 'onHold',
    };

    if (actionMap[action]) {
      ticket.status = actionMap[action];
      if (action === 'Complete Task') ticket.resolvedAt = Date.now();
    }

    if (note) {
      ticket.workLog.push({
        time: formatTime(new Date()) || new Date().toLocaleTimeString(),
        action: action || 'Update Work Log',
        note,
      });
      ticket.comments.push({ author: req.user._id, text: note });
    }

    if (imageUrl) {
      ticket.images.push(imageUrl);
      ticket.attachments.push({ url: imageUrl });
    }

    await ticket.save();
    res.status(200).json({ success: true, message: `${action || 'Action'} completed`, data: ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTasks,
  getTaskDetails,
  executeTaskAction,
  updateTaskStatus,
  addWorkNote,
  uploadWorkImage,
  getStaffDashboard,
};