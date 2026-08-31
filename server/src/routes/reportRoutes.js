const express = require('express');
const router = express.Router();
const {
  getAvailableReports,
  generateReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/available', getAvailableReports);
router.post('/generate', generateReport);

module.exports = router;