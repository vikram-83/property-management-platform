const express = require('express');
const router = express.Router();
const {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} = require('../controllers/buildingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router
  .route('/')
  .get(getBuildings)
  .post(authorize('manager', 'admin'), createBuilding);

router
  .route('/:id')
  .get(getBuildingById)
  .put(authorize('manager', 'admin'), updateBuilding)
  .delete(authorize('manager', 'admin'), deleteBuilding);

module.exports = router;