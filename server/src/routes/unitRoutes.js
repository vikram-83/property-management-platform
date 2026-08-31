const express = require("express");
const router = express.Router();
const {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  assignTenant,
  markVacant,
} = require("../controllers/unitController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router
  .route("/")
  .get(protect, getUnits)
  .post(protect, authorize("admin", "manager"), createUnit);

router
  .route("/:id")
  .get(protect, getUnitById)
  .put(protect, authorize("admin", "manager"), updateUnit)
  .delete(protect, authorize("admin", "manager"), deleteUnit);

router.patch("/:id/assign-tenant", protect, authorize("admin", "manager"), assignTenant);
router.patch("/:id/vacant", protect, authorize("admin", "manager"), markVacant);

module.exports = router;
