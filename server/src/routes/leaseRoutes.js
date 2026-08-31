const express = require('express');
const router = express.Router();
const {
  getLeases,
  getLeaseById,
  createLease,
  renewLease,
  terminateLease,
  getLeaseStatistics
} = require('../controllers/leaseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getLeases);
router.get('/statistics', getLeaseStatistics);
router.get('/:id', getLeaseById);
router.post('/', createLease);
router.post('/:id/renew', renewLease);
router.put('/:id/terminate', terminateLease);

module.exports = router;