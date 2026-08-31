const express = require('express');
const router = express.Router();
const {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyDetails,
  getMyDigitalProperty, // Added controller
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware'); // Standardized middleware import

// All routes require authentication
router.use(protect);

// 1. Digital Pass Route (Tenant specific) - Specific route before dynamic /:id route
router.get(
  '/my-digital-property', 
  checkRole('tenant'), 
  getMyDigitalProperty
);

// 2. Base Property Routes
router.route('/')
  .get(getProperties)
  .post(checkRole('manager', 'admin'), createProperty);

// 3. Single Property Routes
router.route('/:id')
  .put(checkRole('manager', 'admin'), updateProperty)
  .delete(checkRole('manager', 'admin'), deleteProperty);

// 4. Property Metadata & Details
router.route('/:id/details')
  .get(checkRole('manager', 'admin'), getPropertyDetails);

module.exports = router;