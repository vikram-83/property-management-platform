const express = require('express');
const router = express.Router();
const {
  getInspection,
  updateInspectionRoom,
  getMoveOutRequest,
  createMoveOutRequest,
  getUtilities
} = require('../controllers/tenantFeaturesController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Inspection Routes
router.get('/inspection', getInspection);
router.post('/inspection/room', updateInspectionRoom);

// Move-Out Routes
router.get('/move-out', getMoveOutRequest);
router.post('/move-out', createMoveOutRequest);

// Utility Routes
router.get('/utilities', getUtilities);

module.exports = router;