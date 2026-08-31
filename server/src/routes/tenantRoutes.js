const express = require('express');
const router = express.Router();
const { getTenantDashboard } = require('../controllers/TenantController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Dashboard access only for authenticated Tenants
router.get('/dashboard', protect, checkRole('tenant'), getTenantDashboard);

module.exports = router;