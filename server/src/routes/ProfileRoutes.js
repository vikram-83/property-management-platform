const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword
} = require('../controllers/ProfileController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.put('/preferences', updatePreferences);
router.put('/change-password', changePassword);

module.exports = router;