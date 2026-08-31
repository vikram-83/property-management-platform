// controllers/documentController.js
const Document = require('../models/Document');

// 1. Get Documents (Supports Filtering & Searching)
exports.getDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by tenant if role is tenant
    if (req.user.role === 'tenant') {
      query.tenantId = req.user._id;
    }

    // Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by document name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching documents', error: error.message });
  }
};

// 2. Upload/Create Document Record
exports.uploadDocument = async (req, res) => {
  try {
    const { name, fileUrl, category, version, date } = req.body;

    const docId = 'DOC' + Math.floor(1000 + Math.random() * 9000);

    const newDocument = await Document.create({
      docId,
      tenantId: req.user._id,
      name,
      fileUrl,
      category,
      version: version || 'v1',
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, data: newDocument });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error uploading document', error: error.message });
  }
};

// 3. Delete Document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await document.deleteOne();
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting document', error: error.message });
  }
};