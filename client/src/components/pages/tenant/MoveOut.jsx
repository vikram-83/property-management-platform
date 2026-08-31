import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { getMoveOutRequest, createMoveOutRequest } from '../../../services/tenantFeaturesService';

const MoveOut = () => {
  const [moveOut, setMoveOut] = useState(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoveOut();
  }, []);

  const fetchMoveOut = async () => {
    try {
      const res = await getMoveOutRequest();
      if (res.success) setMoveOut(res.data);
    } catch (err) {
      setError('Failed to fetch move-out data');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createMoveOutRequest({ requestedDate, reason });
      if (res.success) {
        setRequestedDate('');
        setReason('');
        await fetchMoveOut();
      }
    } catch (err) {
      setError('Failed to submit move-out request');
      console.error(err);
    }
  };

  if (!moveOut) return <div>Loading...</div>;

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <h2>📦 Move-Out Request</h2>

      {moveOut.status === 'not_requested' ? (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>Submit Move-Out Request</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Move-Out Date: </label>
            <input
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              placeholder="Reason for leaving..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              style={{ width: '100%', height: '80px' }}
            />
          </div>
          <button type="submit">Submit Request</button>
        </form>
      ) : (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>Request Status Details</h3>
          <p><strong>Status:</strong> {moveOut.status.toUpperCase()}</p>
          <p><strong>Requested Date:</strong> {new Date(moveOut.requestedDate).toLocaleDateString()}</p>
          <p><strong>Inspection Date:</strong> {moveOut.inspectionDate ? new Date(moveOut.inspectionDate).toLocaleDateString() : 'Pending Schedule'}</p>
          <p><strong>Security Deposit Status:</strong> {moveOut.depositStatus.toUpperCase()}</p>
        </div>
      )}
      </div>
    
    </>
  );
};

export default MoveOut;