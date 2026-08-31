const express = require('express');
const router = express.Router();
const { getMyRentDetails, processRentPayment } = require('../controllers/rentController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my-rent', checkRole('tenant'), getMyRentDetails);
router.post('/pay', checkRole('tenant'), processRentPayment);

module.exports = router;