import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { getUtilities } from '../../../services/tenantFeaturesService';

const Utilities = () => {
  const [utilities, setUtilities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUtilities();
  }, []);

  const fetchUtilities = async () => {
    try {
      const res = await getUtilities();
      if (res.success) setUtilities(res.data);
    } catch (err) {
      setError('Failed to fetch utilities data');
      console.error(err);
    }
  };

  const current = utilities[0] || {
    electricity: { currentReading: 12450, previousReading: 12100, consumption: 350, unit: 'kWh' },
    water: { currentReading: 3200, previousReading: 3100, consumption: 100, unit: 'KL' }
  };

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <h2>⚡ Utility Consumption Tracking</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Electricity Card */}
        <div style={{ border: '1px solid #fbc02d', padding: '15px', borderRadius: '8px', backgroundColor: '#fffde7' }}>
          <h3>⚡ Electricity</h3>
          <p><strong>Current Reading:</strong> {current.electricity.currentReading} {current.electricity.unit}</p>
          <p><strong>Previous Reading:</strong> {current.electricity.previousReading} {current.electricity.unit}</p>
          <h4>Usage: {current.electricity.consumption} {current.electricity.unit}</h4>
        </div>

        {/* Water Card */}
        <div style={{ border: '1px solid #0288d1', padding: '15px', borderRadius: '8px', backgroundColor: '#e1f5fe' }}>
          <h3>💧 Water</h3>
          <p><strong>Current Reading:</strong> {current.water.currentReading} {current.water.unit}</p>
          <p><strong>Previous Reading:</strong> {current.water.previousReading} {current.water.unit}</p>
          <h4>Usage: {current.water.consumption} {current.water.unit}</h4>
        </div>
      </div>
      </div>
      
    </>
  );
};

export default Utilities;