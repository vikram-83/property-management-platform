const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Roles that a manager is allowed to manage
const MANAGER_ALLOWED_ROLES = ["staff", "vendor"];

// ─────────────────────────────────────────────
// @desc    Get all users with filters
// @route   GET /api/users
// @access  Admin (all roles) | Manager (staff & vendor only)
// ─────────────────────────────────────────────
const getUsers = asyncHandler(async (req, res) => {
  const { role, status, search } = req.query;
  let query = {};

  // Manager can only see staff & vendor
  if (req.user.role === "manager") {
    query.role = { $in: MANAGER_ALLOWED_ROLES };

    // Allow further narrowing within allowed roles
    if (role && MANAGER_ALLOWED_ROLES.includes(role)) {
      query.role = role;
    }
  } else {
    // Admin sees all
    if (role && role !== "all") query.role = role;
  }

  if (status && status !== "all") {
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// ─────────────────────────────────────────────
// @desc    Create a new user
// @route   POST /api/users
// @access  Admin (any role) | Manager (staff & vendor only)
// ─────────────────────────────────────────────
const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, role, password } = req.body;

  // Manager can only create staff or vendor users
  if (req.user.role === "manager" && !MANAGER_ALLOWED_ROLES.includes(role)) {
    res.status(403);
    throw new Error(
      `Managers can only create users with roles: ${MANAGER_ALLOWED_ROLES.join(", ")}`
    );
  }

  const userExists = await User.findOne({ email: email?.toLowerCase().trim() });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name: name?.trim(),
    email: email?.toLowerCase().trim(),
    phone: phone?.trim(),
    role,
    password,
    isActive: true,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
  });
});

// ─────────────────────────────────────────────
// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Admin (all) | Manager (only staff & vendor)
// ─────────────────────────────────────────────
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Manager cannot edit admin/manager/tenant users
  if (req.user.role === "manager" && !MANAGER_ALLOWED_ROLES.includes(user.role)) {
    res.status(403);
    throw new Error("Managers can only edit staff or vendor users");
  }

  // Manager cannot change a user's role to admin/manager/tenant
  const newRole = req.body.role;
  if (req.user.role === "manager" && newRole && !MANAGER_ALLOWED_ROLES.includes(newRole)) {
    res.status(403);
    throw new Error(
      `Managers can only assign roles: ${MANAGER_ALLOWED_ROLES.join(", ")}`
    );
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.role) user.role = req.body.role;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    isActive: updatedUser.isActive,
  });
});

// ─────────────────────────────────────────────
// @desc    Toggle user active/inactive status
// @route   PATCH /api/users/:id/status
// @access  Admin & Manager (manager only for staff/vendor)
// ─────────────────────────────────────────────
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.user.role === "manager" && !MANAGER_ALLOWED_ROLES.includes(user.role)) {
    res.status(403);
    throw new Error("Managers can only change status of staff or vendor users");
  }

  user.isActive = typeof isActive === "boolean" ? isActive : !user.isActive;
  await user.save();

  res.json({ message: "User status updated successfully", isActive: user.isActive });
});

// ─────────────────────────────────────────────
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin only
// ─────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};