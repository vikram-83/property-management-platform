const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

router.use(protect);

// ─────────────────────────────────────────────
// GET /api/vendors  — list all vendors
// Admin & Manager can view all; Vendor sees own profile
// ─────────────────────────────────────────────
router.get(
  '/',
  authorize('admin', 'manager', 'vendor'),
  asyncHandler(async (req, res) => {
    let vendors;

    if (req.user.role === 'vendor') {
      // Vendor sees only their own profile
      vendors = await Vendor.find({ user: req.user._id }).populate(
        'user',
        'name email phone isActive'
      );
    } else {
      // Admin / Manager see all vendors with optional filters
      const { search, category, isActive } = req.query;
      const userQuery = {};
      const vendorQuery = {};

      if (search) {
        userQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      if (category) vendorQuery.serviceCategory = category;
      if (isActive !== undefined) vendorQuery.isActive = isActive === 'true';

      // Find matching users with role=vendor
      let matchingUserIds;
      if (search) {
        const matchingUsers = await User.find({ role: 'vendor', ...userQuery }).select('_id');
        matchingUserIds = matchingUsers.map((u) => u._id);
        vendorQuery.user = { $in: matchingUserIds };
      }

      vendors = await Vendor.find(vendorQuery)
        .populate('user', 'name email phone isActive createdAt')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, count: vendors.length, data: vendors });
  })
);

// ─────────────────────────────────────────────
// POST /api/vendors  — create a vendor profile
// Admin & Manager can create
// ─────────────────────────────────────────────
router.post(
  '/',
  authorize('admin', 'manager'),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password, companyName, serviceCategory } = req.body;

    if (!name || !email || !password || !companyName) {
      res.status(400);
      throw new Error('name, email, password and companyName are required');
    }

    // Check for existing user
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(400);
      throw new Error('A user with this email already exists');
    }

    // Create the User account first (role = vendor)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      role: 'vendor',
      isActive: true,
    });

    // Create the Vendor profile
    const vendor = await Vendor.create({
      user: user._id,
      companyName: companyName.trim(),
      serviceCategory: serviceCategory || 'general',
    });

    const populated = await vendor.populate('user', 'name email phone isActive');
    res.status(201).json({ success: true, data: populated });
  })
);

// ─────────────────────────────────────────────
// GET /api/vendors/:id  — get single vendor
// ─────────────────────────────────────────────
router.get(
  '/:id',
  authorize('admin', 'manager', 'vendor'),
  asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id).populate(
      'user',
      'name email phone isActive createdAt'
    );

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    // Vendors can only see their own profile
    if (req.user.role === 'vendor' && vendor.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied');
    }

    res.status(200).json({ success: true, data: vendor });
  })
);

// ─────────────────────────────────────────────
// PUT /api/vendors/:id  — update vendor
// Admin, Manager, or the Vendor themselves
// ─────────────────────────────────────────────
router.put(
  '/:id',
  authorize('admin', 'manager', 'vendor'),
  asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id).populate('user');

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    // Vendor can only edit their own profile
    if (req.user.role === 'vendor' && vendor.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied');
    }

    const { companyName, serviceCategory, isActive, name, phone } = req.body;

    if (companyName) vendor.companyName = companyName;
    if (serviceCategory) vendor.serviceCategory = serviceCategory;
    if (req.user.role !== 'vendor' && isActive !== undefined) vendor.isActive = isActive;

    await vendor.save();

    // Update user fields if provided
    if (name || phone) {
      await User.findByIdAndUpdate(vendor.user._id, {
        ...(name && { name }),
        ...(phone && { phone }),
      });
    }

    const updated = await Vendor.findById(req.params.id).populate(
      'user',
      'name email phone isActive createdAt'
    );
    res.status(200).json({ success: true, data: updated });
  })
);

// ─────────────────────────────────────────────
// DELETE /api/vendors/:id  — delete vendor (Admin only)
// ─────────────────────────────────────────────
router.delete(
  '/:id',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    // Deactivate the associated user
    await User.findByIdAndUpdate(vendor.user, { isActive: false });
    await vendor.deleteOne();

    res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
  })
);

// ─────────────────────────────────────────────
// PATCH /api/vendors/:id/toggle  — toggle active/inactive (Admin & Manager)
// ─────────────────────────────────────────────
router.patch(
  '/:id/toggle',
  authorize('admin', 'manager'),
  asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id).populate('user');

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();
    await User.findByIdAndUpdate(vendor.user._id, { isActive: vendor.isActive });

    res.status(200).json({
      success: true,
      message: `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: vendor.isActive,
    });
  })
);

module.exports = router;
