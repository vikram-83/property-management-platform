import React, { useState } from 'react';

const Maintenance = ({ taskId = 'MT1001' }) => {
  const [taskStatus, setTaskStatus] = useState('IN_PROGRESS'); // 'ASSIGNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED'
  const [workNote, setWorkNote] = useState('Pipeline joint repaired successfully');
  
  // Materials state management
  const [materialsUsed, setMaterialsUsed] = useState([
    { name: 'PVC Connector', quantity: 2 },
    { name: 'Teflon Tape', quantity: 1 },
  ]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialQty, setNewMaterialQty] = useState(1);

  // Photo uploads mock state
  const [beforePhoto, setBeforePhoto] = useState('leakage_before.png');
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterialName.trim()) return;
    setMaterialsUsed((prev) => [
      ...prev,
      { name: newMaterialName.trim(), quantity: Number(newMaterialQty) },
    ]);
    setNewMaterialName('');
    setNewMaterialQty(1);
  };

  const handleRemoveMaterial = (index) => {
    setMaterialsUsed((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompleteTask = () => {
    const reportPayload = {
      taskId,
      status: 'COMPLETED',
      workNote,
      materialsUsed,
      beforePhoto,
      afterPhoto: afterPhoto || 'leakage_after_fixed.png',
      completedAt: new Date().toISOString(),
    };
    setTaskStatus('COMPLETED');
    setSubmittedReport(reportPayload);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Maintenance Execution Workspace</h1>
          <p style={styles.subtitle}>Log work progress, materials consumed, and photo evidence for {taskId}.</p>
        </div>
        <div style={styles.statusGroup}>
          <span style={{
            ...styles.badge,
            padding: '6px 12px',
            fontSize: '14px',
            backgroundColor: taskStatus === 'COMPLETED' ? '#f0fff4' : '#ebf8ff',
            color: taskStatus === 'COMPLETED' ? '#276749' : '#2b6cb0'
          }}>
            STATUS: {taskStatus}
          </span>
        </div>
      </header>

      {/* Task Controller Bar */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Execution State Actions</h3>
        <div style={styles.actionRow}>
          <button
            onClick={() => setTaskStatus('IN_PROGRESS')}
            disabled={taskStatus === 'IN_PROGRESS' || taskStatus === 'COMPLETED'}
            style={styles.stateBtn('#3182ce', taskStatus === 'IN_PROGRESS' || taskStatus === 'COMPLETED')}
          >
            ▶ Start Task
          </button>
          <button
            onClick={() => setTaskStatus('PAUSED')}
            disabled={taskStatus !== 'IN_PROGRESS'}
            style={styles.stateBtn('#dd6b20', taskStatus !== 'IN_PROGRESS')}
          >
            ⏸ Pause Task
          </button>
          <button
            onClick={() => setTaskStatus('IN_PROGRESS')}
            disabled={taskStatus !== 'PAUSED'}
            style={styles.stateBtn('#38a169', taskStatus !== 'PAUSED')}
          >
            🔄 Resume Task
          </button>
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Work Log & Notes */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Work Notes & Remarks</h3>
          <div style={styles.inputGroup}>
            <label style={styles.detailLabel}>Detailed Execution Summary</label>
            <textarea
              rows="4"
              value={workNote}
              onChange={(e) => setWorkNote(e.target.value)}
              placeholder="Describe repairs undertaken, root cause, and recommendations..."
              style={styles.textarea}
              disabled={taskStatus === 'COMPLETED'}
            />
          </div>

          {/* Photo Evidence Section */}
          <h3 style={{ ...styles.cardTitle, marginTop: '20px' }}>Visual Evidence</h3>
          <div style={styles.photoGrid}>
            <div style={styles.photoBox}>
              <span style={styles.photoLabel}>Before Repair Photo</span>
              <div style={styles.photoPreview}>📷 {beforePhoto || 'No photo uploaded'}</div>
              <button disabled={taskStatus === 'COMPLETED'} style={styles.secondaryBtn}>Upload Before Photo</button>
            </div>
            <div style={styles.photoBox}>
              <span style={styles.photoLabel}>After Repair Photo</span>
              <div style={styles.photoPreview}>📷 {afterPhoto || 'leakage_after_fixed.png'}</div>
              <button disabled={taskStatus === 'COMPLETED'} onClick={() => setAfterPhoto('leakage_after_fixed.png')} style={styles.secondaryBtn}>
                Upload After Photo
              </button>
            </div>
          </div>
        </div>

        {/* Materials Used Logging */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Materials & Spares Used</h3>
          
          {taskStatus !== 'COMPLETED' && (
            <form onSubmit={handleAddMaterial} style={styles.materialForm}>
              <input
                type="text"
                placeholder="Item Name (e.g. Teflon Tape)"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                style={{ ...styles.searchInput, flex: 2 }}
                required
              />
              <input
                type="number"
                min="1"
                value={newMaterialQty}
                onChange={(e) => setNewMaterialQty(e.target.value)}
                style={{ ...styles.searchInput, flex: 1 }}
                required
              />
              <button type="submit" style={styles.addBtn}>+ Add</button>
            </form>
          )}

          <ul style={styles.materialList}>
            {materialsUsed.map((mat, idx) => (
              <li key={idx} style={styles.materialItem}>
                <span>🔧 <strong>{mat.name}</strong> (Qty: {mat.quantity})</span>
                {taskStatus !== 'COMPLETED' && (
                  <button onClick={() => handleRemoveMaterial(idx)} style={styles.removeBtn}>✕</button>
                )}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '30px' }}>
            <button
              onClick={handleCompleteTask}
              disabled={taskStatus === 'COMPLETED'}
              style={{
                ...styles.completeBtn,
                opacity: taskStatus === 'COMPLETED' ? 0.6 : 1,
                cursor: taskStatus === 'COMPLETED' ? 'not-allowed' : 'pointer'
              }}
            >
              {taskStatus === 'COMPLETED' ? '✅ Work Order Submitted' : 'Submit & Complete Work Order'}
            </button>
          </div>
        </div>
      </div>

      {/* JSON Payload Output Box (Demonstration) */}
      {submittedReport && (
        <div style={{ ...styles.card, marginTop: '24px', backgroundColor: '#2d3748', color: '#ffffff' }}>
          <h3 style={{ color: '#63b3ed', margin: '0 0 10px 0' }}>Submitted Report Output (JSON Payload)</h3>
          <pre style={{ margin: 0, fontSize: '13px', overflowX: 'auto' }}>
            {JSON.stringify(submittedReport, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Maintenance;