// src/components/Documents.jsx
import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { getDocuments } from '../../../services/documentService';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'All',
    'Lease Agreement',
    'Rent Invoice',
    'Payment Receipt',
    'Maintenance Report',
    'Notices',
    'Property Documents'
  ];

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;

      const res = await getDocuments(params);
      if (res.success) {
        setDocuments(res.data);
        setError(null);
      } else {
        setError(res.message || 'Failed to fetch documents');
      }
    } catch (err) {
      setError('Error fetching documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [category, search]);

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>📁 Digital Document Vault</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Document List */}
      {loading ? (
        <p>Loading documents...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textWrap: 'wrap' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Document Name</th>
              <th>Category</th>
              <th>Version</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.docId}</td>
                  <td><strong>{doc.name}</strong> ({doc.type})</td>
                  <td>{doc.category}</td>
                  <td>{doc.version}</td>
                  <td>{doc.date}</td>
                  <td>
                    <button onClick={() => setPreviewDoc(doc.fileUrl)} style={{ marginRight: '5px' }}>
                      Preview PDF
                    </button>
                    <a href={doc.fileUrl} download={`${doc.name}.pdf`} target="_blank" rel="noreferrer">
                      <button>Download</button>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No documents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* PDF Preview Modal */}
      {previewDoc && (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3>PDF Preview</h3>
            <button onClick={() => setPreviewDoc(null)}>Close Preview</button>
          </div>
          <iframe 
            src={previewDoc} 
            title="PDF Preview" 
            width="100%" 
            height="400px"
          />
        </div>
      )}
      </div>
      
    </>
  );
};

export default Documents;