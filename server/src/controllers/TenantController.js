const MaintenanceTicket = require('../models/MaintenanceTicket');
const Payment = require('../models/Payment');
const Booking = require('../models/booking');
const Lease = require('../models/Lease');

// @desc    Get Tenant Dashboard Data with Property Health
// @route   GET /api/tenant/dashboard
// @access  Private (Tenant Only)
const getTenantDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch User Active Lease
    const lease = await Lease.findOne({ tenant: userId, status: 'active' });

    // 2. Aggregate Maintenance Stats
    const openTickets = await MaintenanceTicket.countDocuments({ createdBy: userId, status: 'open' });
    const inProgressTickets = await MaintenanceTicket.countDocuments({ createdBy: userId, status: 'in_progress' });
    const completedTickets = await MaintenanceTicket.countDocuments({ createdBy: userId, status: 'resolved' });

    // 3. Aggregate Bookings & Payments
    const upcomingBookings = await Booking.countDocuments({ user: userId, status: 'confirmed' });
    const pendingPayment = await Payment.findOne({ tenant: userId, status: 'pending' }).sort({ dueDate: 1 });

    // 4. Calculate Lease Days Remaining
    let daysRemaining = 0;
    if (lease && lease.endDate) {
      const diffTime = Math.abs(new Date(lease.endDate) - new Date());
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Dynamic Payload Matching Architecture Spec
    const dashboardData = {
      welcome: `Good Morning, ${req.user.name} 👋`,
      quickStats: {
        rentDue: {
          amount: pendingPayment ? pendingPayment.amount : 0,
          dueDate: pendingPayment ? pendingPayment.dueDate : "N/A",
          status: pendingPayment ? "due" : "paid"
        },
        maintenance: {
          open: openTickets,
          inProgress: inProgressTickets,
          completed: completedTickets
        },
        bookings: {
          upcoming: upcomingBookings
        },
        lease: {
          daysRemaining
        }
      },
      smartAlerts: [
        {
          type: "rent",
          message: pendingPayment ? `Rent payment is due on ${pendingPayment.dueDate}` : "No pending rent dues",
          priority: pendingPayment ? "medium" : "low"
        }
      ],
      // ⭐ Unique Property Health Monitor State
      propertyHealth: {
        water: { status: "normal", lastUpdated: "10 minutes ago" },
        electricity: { status: "normal", lastUpdated: "5 minutes ago" },
        internet: { status: "maintenance", estimatedResolution: "6 PM" },
        security: { status: "normal", lastUpdated: "Just now" }
      },
      quickActions: [
        "Pay Rent",
        "Report Problem",
        "Book Amenity",
        "Contact Manager",
        "View Lease",
        "Download Receipt"
      ]
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tenant dashboard data',
      error: error.message
    });
  }
};

module.exports = { getTenantDashboard };