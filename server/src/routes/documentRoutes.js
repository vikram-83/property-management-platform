// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDocuments,
  uploadDocument,
  deleteDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router
  .route('/')
  .get(getDocuments)
  .post(authorize('tenant', 'admin', 'manager'), uploadDocument);

router
  .route('/:id')
  .delete(authorize('admin', 'manager'), deleteDocument);

module.exports = router;