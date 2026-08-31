const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addComment
} = require('../controllers/MaintenceController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All maintenance routes require login
router.use(protect);

// GET /api/maintenance  — role-filtered in controller (tenant=own, staff=assigned, vendor=assigned, admin/manager=all)
// POST /api/maintenance — any authenticated user can create a ticket
router
  .route('/')
  .get(getTickets)
  .post(upload.array('images', 5), createTicket);

// GET /api/maintenance/:id  — get a single ticket
// PUT /api/maintenance/:id  — update ticket (admin, manager can do anything; staff & vendor can update their assigned tickets)
router
  .route('/:id')
  .get(getTicketById)
  .put(updateTicket);

// POST /api/maintenance/:id/comments  — anyone involved can comment
router
  .route('/:id/comments')
  .post(addComment);

module.exports = router;