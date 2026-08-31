const express = require('express');
const router = express.Router();
const { getPaymentHistory } = require('../controllers/paymentControllers');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getPaymentHistory);

module.exports = router;