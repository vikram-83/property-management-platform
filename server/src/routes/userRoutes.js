const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Apply auth to all routes
router.use(protect);

// GET all users
// - Admin: sees ALL roles
// - Manager: sees only staff & vendor roles
router.get("/", authorize("admin", "manager"), getUsers);

// POST create user
// - Admin: can create any role
// - Manager: can only create staff or vendor roles
router.post("/", authorize("admin", "manager"), createUser);

// PUT update user (admin all roles, manager only staff/vendor)
router.put("/:id", authorize("admin", "manager"), updateUser);

// DELETE user (admin only)
router.delete("/:id", authorize("admin"), deleteUser);

// PATCH toggle active status (admin & manager)
router.patch("/:id/status", authorize("admin", "manager"), updateUserStatus);

module.exports = router;