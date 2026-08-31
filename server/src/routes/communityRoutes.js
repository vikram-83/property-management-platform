const express = require('express');
const router = express.Router();
const {
  getCommunityData,
  createAnnouncement,
  votePoll,
  createLostFound
} = require('../controllers/CommunityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getCommunityData);
router.post('/announcement', authorize('admin', 'manager'), createAnnouncement);
router.post('/poll/vote', votePoll);
router.post('/lost-found', createLostFound);

module.exports = router;