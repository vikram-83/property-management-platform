const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ==========================================
// PUBLIC AUTHENTICATION ROUTES
// ==========================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (tenant, staff, vendor, owner)
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user/vendor with email or phone, check verification & suspension
 * @access  Public
 */
router.post("/login", loginUser);

// ==========================================
// PRIVATE AUTHENTICATION ROUTES (Protected)
// ==========================================

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user's profile details using JWT bearer token
 * @access  Private
 */
router.get("/me", protect, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear session/token client-side instruction endpoint
 * @access  Private
 */
router.post("/logout", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Clear local storage tokens on client side."
  });
});

module.exports = router;