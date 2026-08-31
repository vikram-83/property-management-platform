const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPaymentStatistics,
  getPaymentDetails
} = require('../controllers/paymentControllers');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getPayments);
router.get('/statistics', getPaymentStatistics);
router.get('/:id', getPaymentDetails);

module.exports = router;