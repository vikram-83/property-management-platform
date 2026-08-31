import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- PLATFORM FILES DIRECTORY & ROUTING SIMULATOR ---
const PLATFORM_FILES = [
  { name: "Login.jsx", category: "vendor", path: "/vendor/login" },
  { name: "Dashboard.jsx", category: "vendor", path: "/vendor/dashboard" },
  { name: "Vendor.jsx", category: "vendor", path: "/vendor/profile" },
  { name: "Jobs.jsx", category: "vendor", path: "/vendor/jobs" },
  { name: "JobDetails.jsx", category: "vendor", path: "/vendor/job-details" },
  { name: "Schedule.jsx", category: "vendor", path: "/vendor/schedule" },
  { name: "Materials.jsx", category: "vendor", path: "/vendor/materials" },
  { name: "Invoices.jsx", category: "vendor", path: "/vendor/invoices" },
  { name: "Vendor.jsx", category: "vendor", path: "/vendor/profile" }
];


// --- VENDOR SCHEDULE JSON SPECIFICATION + MOCK DATA ---
const VENDOR_SCHEDULE_SPEC = {
  page: "Vendor Schedule",
  purpose: "Vendor ke assigned jobs, visits aur appointments ko manage karna",
  features: [
    "Today's schedule",
    "Upcoming jobs",
    "Calendar view",
    "Job-wise time slot",
    "Property and unit details",
    "Priority indicator",
    "Job status",
    "Reschedule request",
    "Start job",
    "Mark job completed",
    "View customer/manager instructions"
  ],
  actions: {
    viewJob: "Job ki complete details dekhna",
    startJob: "Assigned time par job start karna",
    completeJob: "Job complete mark karna",
    requestReschedule: "Manager ko reschedule request bhejna",
    viewLocation: "Property/location details dekhna"
  },
  schedule: [
    {
      id: "SCH001",
      jobId: "JOB101",
      date: "2026-08-31",
      startTime: "09:00",
      endTime: "11:00",
      property: "Green Valley Apartments",
      unit: "A-203",
      service: "AC Repair",
      priority: "High",
      status: "Scheduled",
      instructions: "AC cooling issue check karna"
    },
    {
      id: "SCH002",
      jobId: "JOB102",
      date: "2026-08-31",
      startTime: "14:00",
      endTime: "15:30",
      property: "Sunrise Residency",
      unit: "B-105",
      service: "Plumbing",
      priority: "Medium",
      status: "Scheduled",
      instructions: "Bathroom leakage inspect karna"
    },
    {
      id: "SCH003",
      jobId: "JOB103",
      date: "2026-09-01",
      startTime: "10:30",
      endTime: "12:00",
      property: "Silver Oak Enclave",
      unit: "C-402",
      service: "Electrical Wiring Check",
      priority: "High",
      status: "Pending",
      instructions: "Main circuit board fuse replacement check karna"
    }
  ]
};

export default function Schedule() {
  const navigate = useNavigate();
  // Navigation & File Dropdown State
  const [currentFile, setCurrentFile] = useState("Schedule.jsx");
  
  // Schedule State
  const [scheduleList, setScheduleList] = useState(VENDOR_SCHEDULE_SPEC.schedule);
  const [selectedTab, setSelectedTab] = useState("TODAY"); // TODAY | ALL
  
  // UI Alerts
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleFileChange = (e) => {
    const selected = e.target.value;
    const selectedFile = PLATFORM_FILES.find((file) => file.name === selected);
    setCurrentFile(selected);
    if (selectedFile) navigate(selectedFile.path);
    setAlertMessage(`📁 Switched active view context to: src/pages/vendor/${selected}`);
    setAlertType("success");
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const handleScheduleAction = (schedId, actionType) => {
    setScheduleList((prev) =>
      prev.map((item) => {
        if (item.id === schedId) {
          let updatedStatus = item.status;
          if (actionType === 'startJob') updatedStatus = 'In Progress';
          if (actionType === 'completeJob') updatedStatus = 'Completed';
          if (actionType === 'requestReschedule') updatedStatus = 'Reschedule Requested';
          return { ...item, status: updatedStatus };
        }
        return item;
      })
    );

    setAlertType("success");
    setAlertMessage(`⚡ Schedule action '${actionType}' successfully processed for ${schedId}!`);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  // Filter schedules based on tab view (Simulating today's date: 2026-08-31)
  const filteredSchedule = selectedTab === "TODAY"
    ? scheduleList.filter(item => item.date === "2026-08-31")
    : scheduleList;

  return (
    <div style={styles.container}>
      {/* Header with Project File Navigation Dropdown */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <h1 style={styles.title}>📅 {VENDOR_SCHEDULE_SPEC.page}</h1>
            <p style={styles.subtitle}>{VENDOR_SCHEDULE_SPEC.purpose}</p>
          </div>
          
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

        {/* Tab Selector Bar */}
        <div style={styles.tabBar}>
          <button 
            style={{
              ...styles.tabBtn,
              backgroundColor: selectedTab === 'TODAY' ? '#2563eb' : '#f8fafc',
              color: selectedTab === 'TODAY' ? '#ffffff' : '#475569',
              borderColor: selectedTab === 'TODAY' ? '#2563eb' : '#cbd5e1'
            }}
            onClick={() => setSelectedTab('TODAY')}
          >
            Today's Schedule (2026-08-31)
          </button>
          <button 
            style={{
              ...styles.tabBtn,
              backgroundColor: selectedTab === 'ALL' ? '#2563eb' : '#f8fafc',
              color: selectedTab === 'ALL' ? '#ffffff' : '#475569',
              borderColor: selectedTab === 'ALL' ? '#2563eb' : '#cbd5e1'
            }}
            onClick={() => setSelectedTab('ALL')}
          >
            All Upcoming Appointments ({scheduleList.length})
          </button>
        </div>
      </header>

      {/* Alert Banner */}
      {alertMessage && (
        <div style={{
          ...styles.alertBox,
          backgroundColor: alertType === 'success' ? '#dcfce7' : '#fee2e2',
          color: alertType === 'success' ? '#15803d' : '#991b1b',
          borderColor: alertType === 'success' ? '#86efac' : '#fca5a5'
        }}>
          {alertMessage}
        </div>
      )}

      {/* Features Overview Ribbon */}
      <div style={styles.featureRibbon}>
        <span style={styles.ribbonTitle}>🛠️ Active Features:</span>
        <div style={styles.featureChipList}>
          {VENDOR_SCHEDULE_SPEC.features.slice(0, 6).map((feat, idx) => (
            <span key={idx} style={styles.featureChip}>{feat}</span>
          ))}
        </div>
      </div>

      {/* Schedule Cards Timeline Grid */}
      <div style={styles.timelineGrid}>
        {filteredSchedule.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No scheduled jobs found for the selected view range.</p>
          </div>
        ) : (
          filteredSchedule.map((item) => (
            <div key={item.id} style={styles.scheduleCard}>
              
              {/* Left Time Slot Block */}
              <div style={styles.timeSlotBlock}>
                <span style={styles.timeText}>{item.startTime}</span>
                <span style={styles.timeDivider}>to</span>
                <span style={styles.timeText}>{item.endTime}</span>
                <span style={styles.dateBadge}>{item.date}</span>
              </div>

              {/* Main Content Body */}
              <div style={styles.cardContentBody}>
                <div style={styles.cardTopRow}>
                  <div>
                    <span style={styles.schedIdBadge}>{item.id}</span>
                    <span style={styles.jobIdBadge}>{item.jobId}</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: 
                        item.status === 'Completed' ? '#dcfce7' :
                        item.status === 'In Progress' ? '#dbeafe' :
                        item.status === 'Reschedule Requested' ? '#fef3c7' : '#f1f5f9',
                      color: 
                        item.status === 'Completed' ? '#166534' :
                        item.status === 'In Progress' ? '#1e40af' :
                        item.status === 'Reschedule Requested' ? '#92400e' : '#334155'
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <span style={{
                    ...styles.priorityBadge,
                    backgroundColor: item.priority === 'High' ? '#fee2e2' : '#fef3c7',
                    color: item.priority === 'High' ? '#991b1b' : '#92400e'
                  }}>
                    Priority: {item.priority}
                  </span>
                </div>

                <h3 style={styles.serviceTitle}>{item.service}</h3>

                <div style={styles.propertyBox}>
                  <p style={styles.propLine}>🏢 <strong>{item.property}</strong> — Unit: {item.unit}</p>
                  <p style={styles.instructionLine}>💬 <strong>Instructions:</strong> "{item.instructions}"</p>
                </div>

                {/* Actions Toolbar */}
                <div style={styles.actionToolbar}>
                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#2563eb', color: '#fff' }}
                    onClick={() => handleScheduleAction(item.id, 'startJob')}
                  >
                    ▶ Start Job
                  </button>

                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#059669', color: '#fff' }}
                    onClick={() => handleScheduleAction(item.id, 'completeJob')}
                  >
                    ✔ Mark Completed
                  </button>

                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#d97706', color: '#fff' }}
                    onClick={() => handleScheduleAction(item.id, 'requestReschedule')}
                  >
                    🕒 Request Reschedule
                  </button>

                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                    onClick={() => {
                      setAlertType("success");
                      setAlertMessage(`🗺️ Location mapping & navigation directions loaded for ${item.property}`);
                    }}
                  >
                    📍 View Location
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

// --- STYLING SYSTEM ---
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#1f2937'
  },
  header: {
    marginBottom: '20px',
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '13px',
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
  tabBar: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6'
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  alertBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid',
    fontWeight: '600',
    fontSize: '13px'
  },
  featureRibbon: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  ribbonTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#334155'
  },
  featureChipList: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  featureChip: {
    fontSize: '11px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600'
  },
  timelineGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: '40px',
    textAlign: 'center',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'wrap'
  },
  timeSlotBlock: {
    backgroundColor: '#f8fafc',
    minWidth: '140px',
    padding: '20px',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px'
  },
  timeText: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  timeDivider: {
    fontSize: '11px',
    color: '#64748b'
  },
  dateBadge: {
    fontSize: '11px',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    padding: '2px 8px',
    borderRadius: '4px',
    marginTop: '6px',
    fontWeight: '600'
  },
  cardContentBody: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px'
  },
  schedIdBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '3px 8px',
    borderRadius: '6px',
    marginRight: '6px'
  },
  jobIdBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '3px 8px',
    borderRadius: '6px',
    marginRight: '6px'
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  serviceTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  propertyBox: {
    backgroundColor: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  propLine: {
    fontSize: '13px',
    color: '#1e293b',
    margin: 0
  },
  instructionLine: {
    fontSize: '12px',
    color: '#475569',
    margin: 0
  },
  actionToolbar: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    padding: '7px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};