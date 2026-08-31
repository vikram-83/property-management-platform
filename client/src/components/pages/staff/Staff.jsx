import React, { useState } from 'react';
import StaffDashboard from './Dashboard';
import MyTasks from './myTask';
import TaskDetails from './taskDetail';
import Schedule from './Sudule';
import Maintenance from './Maintainence';

const Staff = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState('MT1001');

  const handleNavigateToTask = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab('task-details');
  };

  const handleNavigateToMaintenance = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab('maintenance');
  };

  return (
    <div style={styles.masterWrapper}>
      {/* Top Tab Bar Nav */}
      <nav style={styles.topNav}>
        <div style={styles.navBrand}>Staff Workspace</div>
        <div style={styles.tabGroup}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={styles.tabBtn(activeTab === 'dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('my-tasks')}
            style={styles.tabBtn(activeTab === 'my-tasks')}
          >
            📋 My Tasks
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            style={styles.tabBtn(activeTab === 'schedule')}
          >
            📅 Schedule
          </button>
          <button
            onClick={() => setActiveTab('task-details')}
            style={styles.tabBtn(activeTab === 'task-details')}
          >
            🔍 Task Details
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            style={styles.tabBtn(activeTab === 'maintenance')}
          >
            🛠️ Maintenance Workspace
          </button>
        </div>
      </nav>

      {/* Dynamic View Rendering */}
      <main style={styles.mainContent}>
        {activeTab === 'dashboard' && <StaffDashboard onNavigateToTask={handleNavigateToTask} />}
        {activeTab === 'my-tasks' && <MyTasks onSelectTask={handleNavigateToTask} />}
        {activeTab === 'schedule' && <Schedule onSelectTask={handleNavigateToTask} />}
        {activeTab === 'task-details' && (
          <TaskDetails
            taskId={selectedTaskId}
            onNavigateToMaintenance={handleNavigateToMaintenance}
          />
        )}
        {activeTab === 'maintenance' && <Maintenance taskId={selectedTaskId} />}
      </main>
    </div>
  );
};

// Global Consolidated Component Stylesheet
const styles = {
  masterWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  topNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a202c',
    padding: '0 24px',
    height: '60px',
    color: '#ffffff',
  },
  navBrand: {
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '0.5px',
  },
  tabGroup: {
    display: 'flex',
    gap: '8px',
    height: '100%',
  },
  tabBtn: (isActive) => ({
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid #63b3ed' : '3px solid transparent',
    color: isActive ? '#ffffff' : '#a0aec0',
    fontWeight: '600',
    fontSize: '14px',
    padding: '0 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  container: {
    padding: '24px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3182ce',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    color: '#4a5568',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  ratingBadge: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ratingStar: { color: '#ecc94b', fontSize: '18px' },
  ratingValue: { fontWeight: '700', color: '#2d3748' },
  ratingLabel: { fontSize: '12px', color: '#a0aec0', marginLeft: '6px' },

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  metricHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  metricTitle: { fontSize: '13px', fontWeight: '600', color: '#718096', textTransform: 'uppercase' },
  badge: { padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  metricValue: { fontSize: '28px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' },
  metricSubtext: { fontSize: '13px', color: '#a0aec0', margin: 0 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    padding: '20px',
    marginBottom: '20px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#2d3748', margin: 0 },
  countBadge: { backgroundColor: '#feebc8', color: '#9c4221', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },

  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#718096', borderBottom: '2px solid #edf2f7', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #edf2f7' },
  td: { padding: '12px', fontSize: '14px', color: '#2d3748' },
  emptyTd: { padding: '24px', textAlign: 'center', color: '#a0aec0', fontSize: '14px' },
  actionBtn: { backgroundColor: '#3182ce', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

  filterCard: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  filterGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  searchInput: { flex: 2, padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none' },
  selectInput: { flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: '#ffffff', outline: 'none' },

  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' },
  detailGroup: { marginBottom: '16px' },
  detailLabel: { fontSize: '12px', fontWeight: '700', color: '#718096', textTransform: 'uppercase', display: 'block', marginBottom: '4px' },
  detailText: { fontSize: '15px', color: '#2d3748', margin: 0 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' },
  primaryBtn: { backgroundColor: '#3182ce', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn: { backgroundColor: '#edf2f7', color: '#2d3748', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  actionButtonGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' },
  controlBtn: { padding: '12px', borderRadius: '6px', border: 'none', color: '#ffffff', fontWeight: '600', cursor: 'pointer' },

  timelineList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  timelineItem: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  timeBadge: { width: '80px', fontWeight: '700', color: '#4a5568', fontSize: '14px', paddingTop: '4px' },
  timelineConnector: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  timelineDot: (status) => ({ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: status === 'IN_PROGRESS' ? '#3182ce' : '#cbd5e0' }),
  timelineLine: { width: '2px', height: '60px', backgroundColor: '#e2e8f0', marginTop: '4px' },
  timelineContent: { flex: 1, backgroundColor: '#f7fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #edf2f7' },
  itemTitle: { margin: 0, fontSize: '16px', color: '#2d3748' },
  itemSubtext: { margin: '4px 0 0 0', fontSize: '13px', color: '#718096' },
  durationTag: { fontSize: '12px', color: '#718096', backgroundColor: '#edf2f7', padding: '2px 8px', borderRadius: '4px' },

  statusGroup: { display: 'flex', alignItems: 'center' },
  actionRow: { display: 'flex', gap: '12px', marginTop: '12px' },
  stateBtn: (color, disabled) => ({
    backgroundColor: disabled ? '#cbd5e0' : color,
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  inputGroup: { marginTop: '12px' },
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' },
  photoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' },
  photoBox: { border: '1px dashed #cbd5e0', padding: '12px', borderRadius: '6px', textAlign: 'center' },
  photoLabel: { fontSize: '12px', fontWeight: '600', color: '#718096', display: 'block', marginBottom: '8px' },
  photoPreview: { fontSize: '13px', color: '#4a5568', marginBottom: '8px' },
  materialForm: { display: 'flex', gap: '8px', marginBottom: '16px' },
  addBtn: { backgroundColor: '#38a169', color: '#ffffff', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  materialList: { listStyleType: 'none', padding: 0, margin: 0 },
  materialItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#f7fafc', borderRadius: '6px', marginBottom: '8px', border: '1px solid #edf2f7' },
  removeBtn: { background: 'none', border: 'none', color: '#e53e3e', fontWeight: '700', cursor: 'pointer' },
  completeBtn: { width: '100%', backgroundColor: '#38a169', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: '700', fontSize: '15px' },
};

export default Staff;