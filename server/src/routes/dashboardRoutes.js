const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardontrollers");
const { getStaffDashboard } = require("../controllers/staffControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const asyncHandler = require("express-async-handler");
const MaintenanceTicket = require("../models/MaintenanceTicket");
const Vendor = require("../models/Vendor");

// Admin dashboard — full platform stats
router.get("/admin", protect, authorize("admin"), getDashboardStats);

// Manager dashboard — property-level stats (reuse same controller filtered by role in controller)
router.get("/manager", protect, authorize("manager", "admin"), getDashboardStats);

// Staff dashboard — own tasks & schedule
router.get("/staff", protect, authorize("staff", "manager", "admin"), getStaffDashboard);

// Vendor dashboard — own assigned jobs summary
router.get(
  "/vendor",
  protect,
  authorize("vendor", "manager", "admin"),
  asyncHandler(async (req, res) => {
    // Find the vendor profile
    const vendorProfile = await Vendor.findOne({ user: req.user._id });

    // Build query — for manager/admin showing a specific vendor, use query param
    const targetUserId = req.user.role === "vendor" ? req.user._id : req.query.userId;

    const query = targetUserId
      ? { "assignedTo.type": "vendor", "assignedTo.id": targetUserId }
      : { "assignedTo.type": "vendor" };

    const tickets = await MaintenanceTicket.find(query)
      .populate("property", "name")
      .populate("building", "name")
      .populate("unit", "unitNumber")
      .sort({ createdAt: -1 });

    const totalJobs = tickets.length;
    const pendingJobs = tickets.filter((t) =>
      ["reported", "reviewed", "assigned"].includes(t.status)
    ).length;
    const inProgressJobs = tickets.filter((t) => t.status === "inProgress").length;
    const completedJobs = tickets.filter((t) =>
      ["completed", "tenantConfirmed"].includes(t.status)
    ).length;

    const recentJobs = tickets.slice(0, 5).map((t) => ({
      id: t._id,
      ticketId: t.ticketId,
      title: t.title,
      category: t.category,
      priority: t.priority,
      status: t.status,
      property: t.property?.name || "N/A",
      building: t.building?.name || "N/A",
      unit: t.unit?.unitNumber || "N/A",
      createdAt: t.createdAt,
    }));

    res.status(200).json({
      success: true,
      header: {
        title: "Vendor Dashboard",
        welcomeMessage: `Welcome, ${req.user.name} 👋`,
        company: vendorProfile?.companyName || "",
        category: vendorProfile?.serviceCategory || "",
      },
      summaryCards: [
        { title: "Total Jobs", value: totalJobs, icon: "briefcase", color: "blue" },
        { title: "Pending Jobs", value: pendingJobs, icon: "clock", color: "amber" },
        { title: "In Progress", value: inProgressJobs, icon: "loader", color: "indigo" },
        { title: "Completed Jobs", value: completedJobs, icon: "check-circle", color: "emerald" },
      ],
      recentJobs,
    });
  })
);

module.exports = router;