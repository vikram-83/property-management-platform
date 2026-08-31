const express = require('express');
const router = express.Router();
const {
  getTaskDetails,
  executeTaskAction,
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getStaffPerformance } = require('../controllers/staffPerformanceController');

router.use(protect);
router.use(authorize('staff', 'manager', 'admin'));

router.get('/tasks/:id', getTaskDetails);
router.put('/tasks/:id/action', executeTaskAction);
router.get('/performance', protect, getStaffPerformance);

module.exports = router;