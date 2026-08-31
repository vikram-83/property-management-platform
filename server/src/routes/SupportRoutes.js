const express = require('express');
const router = express.Router();
const {
  getTickets,
  createTicket,
  addMessage,
  updateTicketStatus
} = require('../controllers/SupportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(authorize('tenant'), createTicket);

router.post('/:id/message', addMessage);
router.put('/:id/status', authorize('admin', 'manager'), updateTicketStatus);

module.exports = router;