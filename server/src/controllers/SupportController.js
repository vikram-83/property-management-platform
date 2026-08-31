const SupportTicket = require('../models/SupportTicket');

// 1. Get Tickets (Tenants view own tickets, Admin/Manager view all)
exports.getTickets = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'tenant') {
      query.tenantId = req.user._id;
    }

    const tickets = await SupportTicket.find(query)
      .populate('tenantId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tickets', error: error.message });
  }
};

// 2. Create Support Ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, category, description } = req.body;
    const ticketId = 'SUP' + Math.floor(100 + Math.random() * 900);

    const newTicket = await SupportTicket.create({
      ticketId,
      tenantId: req.user._id,
      subject,
      category,
      description,
      messages: [{
        sender: req.user._id,
        senderRole: req.user.role,
        text: description
      }]
    });

    res.status(201).json({ success: true, data: newTicket });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating ticket', error: error.message });
  }
};

// 3. Add Chat Message to Ticket
exports.addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.messages.push({
      sender: req.user._id,
      senderRole: req.user.role,
      text
    });

    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};

// 4. Update Ticket Status (Admin/Manager)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating ticket status', error: error.message });
  }
};