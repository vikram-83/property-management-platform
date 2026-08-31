const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const normalizedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !password?.trim()) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  const allowedSelfRoles = ["manager", "tenant", "staff", "vendor", "owner"];
  const finalRole = allowedSelfRoles.includes(role) ? role : "tenant";

  // New vendors register with verification pending state by default if needed
  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: password.trim(),
    phone: phone?.trim(),
    role: finalRole,
    status: finalRole === 'vendor' ? 'PENDING_VERIFICATION' : 'VERIFIED',
    isActive: true
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Login user (Supports Vendor Verification & Suspension Checks)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const identifier = email?.trim().toLowerCase();

  if (!identifier || !password) {
    res.status(400);
    throw new Error("Email/Phone and password are required");
  }

  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }]
  }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Account Suspended Check (using user.isActive or custom status flag)
  if (!user.isActive || user.status === "SUSINED" || user.status === "SUSPENDED") {
    res.status(403);
    throw new Error("Access Denied: This vendor account has been suspended due to policy violations. Contact support.");
  }

  // Account Verification Check for Vendors
  if (user.role === 'vendor' && user.status === "PENDING_VERIFICATION") {
    res.status(403);
    throw new Error("Verification Pending: Your KYC documents are currently under review by the property management team.");
  }

  res.json({
    success: true,
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "VERIFIED"
    },
    message: "Login successful"
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, getMe };