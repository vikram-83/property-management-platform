import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- PLATFORM FILES DIRECTORY & ROUTING SIMULATOR ---
const PLATFORM_FILES = [
  { name: "Dashboard.jsx", category: "vendor", path: "/vendor/dashboard" },
  { name: "Jobs.jsx", category: "vendor", path: "/vendor/jobs" },
  { name: "JobDetails.jsx", category: "vendor", path: "/vendor/job-details" },
  { name: "Schedule.jsx", category: "vendor", path: "/vendor/schedule" },
  { name: "Materials.jsx", category: "vendor", path: "/vendor/materials" },
  { name: "Invoices.jsx", category: "vendor", path: "/vendor/invoices" },
  { name: "Vendor.jsx", category: "vendor", path: "/vendor/profile" }
];

const VENDOR_DASHBOARD_DATA = {
  dashboard: {
    summaryCards: [
      { title: "New Jobs", value: 5, action: "viewJobs", icon: "📋", color: "#3b82f6" },
      { title: "Active Jobs", value: 3, action: "viewActiveJobs", icon: "⚡", color: "#f59e0b" },
      { title: "Completed Jobs", value: 42, action: "viewCompletedJobs", icon: "✅", color: "#10b981" },
      { title: "Pending Invoices", value: 4, action: "viewInvoices", icon: "📄", color: "#6366f1" },
      { title: "Pending Payments", value: 28500, currency: "INR", action: "viewPayments", icon: "💰", color: "#ec4899" }
    ],
    todaySchedule: [
      { id: "SCH-101", title: "HVAC Duct Inspection", property: "Skyline Heights, Tower B - 402", time: "10:00 AM - 11:30 AM", status: "Scheduled" },
      { id: "SCH-102", title: "Electrical Panel Maintenance", property: "Emerald Gardens, Villa 12", time: "02:00 PM - 04:00 PM", status: "In Progress" }
    ],
    urgentJobs: [
      { id: "JOB-901", title: "Water Pipe Leakage Emergency", property: "Sunrise Apartments, Unit 304", priority: "High", reportedAt: "Today, 08:15 AM" },
      { id: "JOB-902", title: "Main Gate Automated Sensor Repair", property: "Grand Commercial Plaza", priority: "Critical", reportedAt: "Yesterday, 06:50 PM" }
    ],
    recentNotifications: [
      { id: "NOTIF-01", message: "Property Manager verified Invoice #INV-2026-89.", timestamp: "2 hours ago" },
      { id: "NOTIF-02", message: "New work order assigned: Plumbing overhaul at Block C.", timestamp: "5 hours ago" }
    ],
    recentOrders: [
      { id: "ORD-501", material: "PVC Pipes (4 inch)", qty: "15 pcs", status: "Dispatched", total: 4500 },
      { id: "ORD-502", material: "Copper Wiring Rolls", qty: "4 rolls", status: "Delivered", total: 12000 }
    ],
    monthlyEarnings: 125000
  },
  features: [
    "Project File Selector Dropdown",
    "Job Summary Cards",
    "Today Schedule",
    "Urgent Jobs Alert",
    "Quick Actions",
    "Recent Orders"
  ]
};

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { summaryCards, todaySchedule, urgentJobs, recentNotifications, recentOrders, monthlyEarnings } = VENDOR_DASHBOARD_DATA.dashboard;
  const { features } = VENDOR_DASHBOARD_DATA;

  const [currentFile, setCurrentFile] = useState("Dashboard.jsx");
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.value;
    const selectedFile = PLATFORM_FILES.find((file) => file.name === selected);
    setCurrentFile(selected);
    if (selectedFile) navigate(selectedFile.path);
    setFeedbackMsg(`📁 Switched active view context to: src/pages/vendor/${selected}`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleQuickActionClick = (actionName) => {
    setFeedbackMsg(`Successfully triggered action: ${actionName}`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const formatCurrencyINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div style={styles.container}>
      {/* Header with Project File Navigation Dropdown */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <h1 style={styles.title}>🛠️ Vendor Command Center</h1>
            <p style={styles.subtitle}>Manage work orders, track scheduled operations, and monitor earnings seamlessly.</p>
          </div>
          
          {/* File Switcher Dropdown Menu */}
          <div style={styles.fileSwitcherContainer}>
            <label style={styles.fileSwitcherLabel}>📂 Component File View:</label>
            <select value={currentFile} onChange={handleFileChange} style={styles.dropdownSelect}>
              {PLATFORM_FILES.map((file, idx) => (
                <option key={idx} value={file.name}>
                  src/pages/vendor/{file.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.headerBottomRow}>
          <div style={styles.featureBadgeContainer}>
            {features.map((feat, idx) => (
              <span key={idx} style={styles.featureBadge}>✓ {feat}</span>
            ))}
          </div>
          <div style={styles.earningsPill}>
            <span style={styles.earningsLabel}>Monthly Earnings</span>
            <span style={styles.earningsValue}>{formatCurrencyINR(monthlyEarnings)}</span>
          </div>
        </div>
      </header>

      {/* Feedback Notification Alert */}
      {feedbackMsg && (
        <div style={styles.alertSuccess}>
          {feedbackMsg}
        </div>
      )}

      {/* Summary Cards Grid */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Performance & Job Metrics [{currentFile}]</h2>
        <div style={styles.summaryGrid}>
          {summaryCards.map((card, idx) => (
            <div key={idx} style={styles.summaryCard} onClick={() => handleQuickActionClick(card.action)}>
              <div style={styles.cardHeaderTop}>
                <span style={styles.cardIconBox}>{card.icon}</span>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Actionable</span>
              </div>
              <div style={styles.cardBodyContent}>
                <h3 style={styles.cardValue}>
                  {card.currency === 'INR' ? formatCurrencyINR(card.value) : card.value}
                </h3>
                <p style={styles.cardTitleText}>{card.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions Panel */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>⚡ Quick Actions</h2>
        <div style={styles.quickActionsContainer}>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('Accept New Job')}>+ Accept New Job</button>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('Update Job')}>✏️ Update Job</button>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('Create Invoice')}>📄 Create Invoice</button>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('Add Material')}>🧱 Add Material</button>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('View Schedule')}>📅 View Schedule</button>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('Contact Manager')}>📞 Contact Manager</button>
          <button style={styles.quickActionButton} onClick={() => handleQuickActionClick('Upload Document')}>📁 Upload Document</button>
        </div>
      </section>

      {/* Two-Column Grid: Today Schedule & Urgent Jobs */}
      <div style={styles.dualColumnGrid}>
        
        {/* Today's Schedule */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>📅 Today's Schedule</h3>
            <span style={styles.badgeCount}>{todaySchedule.length} Tasks</span>
          </div>
          <div style={styles.listContainer}>
            {todaySchedule.map((item) => (
              <div key={item.id} style={styles.listItem}>
                <div>
                  <strong style={styles.itemTitle}>{item.title}</strong>
                  <p style={styles.itemSubText}>🏢 {item.property}</p>
                  <p style={styles.itemMetaText}>⏰ {item.time}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: item.status === 'In Progress' ? '#fef3c7' : '#e0e7ff',
                  color: item.status === 'In Progress' ? '#92400e' : '#3730a3'
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Jobs */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>🚨 Urgent Jobs</h3>
            <span style={{ ...styles.badgeCount, backgroundColor: '#fee2e2', color: '#991b1b' }}>{urgentJobs.length} Priority</span>
          </div>
          <div style={styles.listContainer}>
            {urgentJobs.map((job) => (
              <div key={job.id} style={{ ...styles.listItem, borderLeftColor: '#ef4444' }}>
                <div>
                  <strong style={styles.itemTitle}>{job.title}</strong>
                  <p style={styles.itemSubText}>📍 {job.property}</p>
                  <p style={styles.itemMetaText}>⚠️ Reported: {job.reportedAt}</p>
                </div>
                <span style={styles.priorityBadge}>{job.priority}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Orders & Notifications */}
      <div style={styles.dualColumnGrid}>
        
        {/* Recent Orders */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>📦 Recent Material Orders</h3>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Material</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} style={styles.tableRow}>
                    <td style={styles.td}><strong>{ord.material}</strong></td>
                    <td style={styles.td}>{ord.qty}</td>
                    <td style={styles.td}>
                      <span style={{ color: ord.status === 'Delivered' ? '#16a34a' : '#2563eb', fontWeight: '600' }}>
                        {ord.status}
                      </span>
                    </td>
                    <td style={styles.td}>{formatCurrencyINR(ord.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notifications */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>🔔 Recent Notifications</h3>
          </div>
          <div style={styles.listContainer}>
            {recentNotifications.map((note) => (
              <div key={note.id} style={styles.notificationItem}>
                <p style={styles.notifText}>{note.message}</p>
                <span style={styles.notifTimestamp}>{note.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- INLINE STYLES ---
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#1f2937'
  },
  header: {
    marginBottom: '28px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  headerTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px'
  },
  headerBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6'
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0
  },
  fileSwitcherContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    backgroundColor: '#f8fafc',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  },
  fileSwitcherLabel: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase'
  },
  dropdownSelect: {
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    borderRadius: '6px',
    border: '1px solid #94a3b8',
    outline: 'none',
    cursor: 'pointer'
  },
  earningsPill: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    padding: '8px 14px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  earningsLabel: {
    fontSize: '11px',
    color: '#15803d',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  earningsValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#166534'
  },
  featureBadgeContainer: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  featureBadge: {
    fontSize: '11px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '3px 8px',
    borderRadius: '10px',
    fontWeight: '600'
  },
  alertSuccess: {
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid #86efac',
    fontWeight: '600'
  },
  section: {
    marginBottom: '28px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '14px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px'
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  cardHeaderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  cardIconBox: {
    fontSize: '20px'
  },
  cardBodyContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 2px 0'
  },
  cardTitleText: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '600'
  },
  quickActionsContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  quickActionButton: {
    padding: '9px 14px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
  },
  dualColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
    marginBottom: '28px'
  },
  panelCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '18px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '8px'
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  badgeCount: {
    fontSize: '11px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    padding: '2px 8px',
    borderRadius: '8px',
    fontWeight: '600'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    borderLeftWidth: '4px',
    borderLeftColor: '#2563eb'
  },
  itemTitle: {
    fontSize: '13px',
    color: '#1f2937',
    display: 'block',
    marginBottom: '3px'
  },
  itemSubText: {
    fontSize: '11px',
    color: '#4b5563',
    margin: '0 0 2px 0'
  },
  itemMetaText: {
    fontSize: '10px',
    color: '#9ca3af',
    margin: 0
  },
  statusBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  priorityBadge: {
    fontSize: '10px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '12px'
  },
  tableHeaderRow: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  th: {
    padding: '8px',
    fontWeight: '600',
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '8px',
    borderBottom: '1px solid #f3f4f6',
    color: '#4b5563'
  },
  tableRow: {},
  notificationItem: {
    padding: '8px 10px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  },
  notifText: {
    fontSize: '12px',
    color: '#1e293b',
    margin: '0 0 3px 0'
  },
  notifTimestamp: {
    fontSize: '10px',
    color: '#64748b'
  }
};