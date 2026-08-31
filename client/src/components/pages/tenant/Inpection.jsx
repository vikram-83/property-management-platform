import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { getInspection } from '../../../services/tenantFeaturesService';

const Inspection = () => {
  const [inspection, setInspection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getInspection();
      if (res.success) setInspection(res.data);
    } catch (err) {
      setError('Failed to fetch inspection data');
      console.error(err);
    }
  };

  if (!inspection) return <div>Loading Inspection Data...</div>;

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <h2>📋 Move-In / Move-Out Inspection</h2>

      {/* Move-In Section */}
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>🔑 Move-In Inspection</h3>
        <p><strong>Status:</strong> {inspection.moveIn.status.toUpperCase()}</p>
        <p><strong>Date:</strong> {new Date(inspection.moveIn.date).toLocaleDateString()}</p>

        <h4>Room Conditions:</h4>
        <ul>
          {inspection.moveIn.rooms.map((r, i) => (
            <li key={i}>
              <strong>{r.room}:</strong> {r.condition}
            </li>
          ))}
        </ul>
      </div>

      {/* Move-Out Section */}
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>🚪 Move-Out Inspection</h3>
        <p><strong>Scheduled:</strong> {inspection.moveOut.scheduled ? 'Yes' : 'Not Scheduled'}</p>
        {inspection.moveOut.date && <p><strong>Date:</strong> {new Date(inspection.moveOut.date).toLocaleDateString()}</p>}
      </div>
      </div>
    </>
  );
};

export default Inspection;