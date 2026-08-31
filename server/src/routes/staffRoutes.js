const express = require("express");
const router = express.Router();
const {
  getMyTasks,
  getTaskDetails,
  executeTaskAction,
  updateTaskStatus,
  addWorkNote,
  uploadWorkImage,
  getStaffDashboard,
} = require("../controllers/staffControllers");
const { getStaffPerformance } = require("../controllers/Staffperformance.controller");
const { getStaffSchedule } = require("../controllers/SceduleController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorize("staff", "manager", "admin"));

router.get("/dashboard", getStaffDashboard);
router.get("/tasks", getMyTasks);
router.get("/tasks/:id", getTaskDetails);
router.put("/tasks/:id/status", updateTaskStatus);
router.put("/tasks/:id/action", executeTaskAction);
router.post("/tasks/:id/notes", addWorkNote);
router.post("/tasks/:id/images", uploadWorkImage);
router.get("/performance", getStaffPerformance);
router.get("/schedule", getStaffSchedule);

module.exports = router;
