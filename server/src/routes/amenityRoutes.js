// routes/amenityRoutes.js
const express = require('express');
const router = express.Router();
const { getAmenities, createAmenity } = require('../controllers/amenityController');

router.get('/', getAmenities);
router.post('/', createAmenity);

module.exports = router;