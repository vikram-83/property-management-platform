const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Property = require("../models/Property");
const Payment = require("../models/Payment");
const Building = require("../models/Building");
const Unit = require("../models/Unit");
const MaintenanceTicket = require("../models/MaintenanceTicket");

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const totalOccupied = await Property.countDocuments({ status: "Occupied" });
  const totalBuildings = await Building.countDocuments();
  const totalUnits = await Unit.countDocuments();
  const occupiedUnits = await Unit.countDocuments({ status: "occupied" });
  const pendingMaintenance = await MaintenanceTicket.countDocuments({ status: { $in: ["Pending", "pending"] } });

  const revenueData = await Payment.aggregate([
    { $match: { status: "Completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const recentPayments = await Payment.find()
    .populate("tenant", "name")
    .populate("property", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    stats: {
      totalUsers,
      totalProperties,
      occupancyRate: totalProperties ? Math.round((totalOccupied / totalProperties) * 100) : 0,
      totalRevenue: revenueData[0]?.total || 0,
    },
    summary: {
      properties: totalProperties,
      buildings: totalBuildings,
      totalUnits,
      occupiedUnits,
      vacantUnits: Math.max(0, totalUnits - occupiedUnits),
      tenants: await User.countDocuments({ role: "tenant", isActive: true }),
      pendingMaintenance,
      pendingPayments: await Payment.countDocuments({ status: { $in: ["Pending", "pending"] } }),
    },
    recentPayments,
  });
});

module.exports = { getDashboardStats };