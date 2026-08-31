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

// --- VENDOR JOBS JSON SPECIFICATION + MOCK DATA ---
const VENDOR_JOBS_SPEC = {
  page: "Jobs",
  route: "/vendor/jobs",
  filters: [
    "ALL",
    "NEW",
    "ASSIGNED",
    "ACCEPTED",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED"
  ],
  jobs: [
    {
      jobId: "JOB-10245",
      title: "AC Compressor Repair & Gas Refill",
      category: "HVAC",
      priority: "HIGH",
      status: "ASSIGNED",
      property: {
        name: "Green Valley Residency",
        building: "Block A",
        unit: "A-203"
      },
      assignedBy: {
        managerId: "MGR-001",
        name: "Rahul Verma (Manager)"
      },
      scheduledDate: "2026-08-31",
      scheduledTime: "10:00 AM",
      estimatedCost: 2500
    },
    {
      jobId: "JOB-10248",
      title: "Main Distribution Board Wiring Check",
      category: "Electrical",
      priority: "URGENT",
      status: "IN_PROGRESS",
      property: {
        name: "Sunshine Heights",
        building: "Tower B",
        unit: "B-501"
      },
      assignedBy: {
        managerId: "MGR-002",
        name: "Priya Singh (Manager)"
      },
      scheduledDate: "2026-08-31",
      scheduledTime: "02:30 PM",
      estimatedCost: 1800
    },
    {
      jobId: "JOB-10250",
      title: "Bathroom Pipeline Leakage Inspection",
      category: "Plumbing",
      priority: "MEDIUM",
      status: "ACCEPTED",
      property: {
        name: "Silver Oak Apartments",
        building: "Block C",
        unit: "C-104"
      },
      assignedBy: {
        managerId: "MGR-001",
        name: "Rahul Verma (Manager)"
      },
      scheduledDate: "2026-09-01",
      scheduledTime: "11:00 AM",
      estimatedCost: 1200
    }
  ],
  actions: [
    "viewJob",
    "acceptJob",
    "rejectJob",
    "rescheduleJob",
    "startJob",
    "completeJob"
  ]
};

export default function VendorJobs() {
  const navigate = useNavigate();
  // Navigation & File Dropdown State
  const [currentFile, setCurrentFile] = useState("Jobs.jsx");
  
  // Jobs List State
  const [jobsList, setJobsList] = useState(VENDOR_JOBS_SPEC.jobs);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState(null);
  
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

  // Job Action Handlers
  const handleJobAction = (jobId, actionType) => {
    setJobsList((prevJobs) =>
      prevJobs.map((job) => {
        if (job.jobId === jobId) {
          let updatedStatus = job.status;
          if (actionType === 'acceptJob') updatedStatus = 'ACCEPTED';
          if (actionType === 'startJob') updatedStatus = 'IN_PROGRESS';
          if (actionType === 'completeJob') updatedStatus = 'COMPLETED';
          if (actionType === 'rejectJob') updatedStatus = 'CANCELLED';
          return { ...job, status: updatedStatus };
        }
        return job;
      })
    );

    setAlertType("success");
    setAlertMessage(`⚡ Action '${actionType}' successfully executed for ${jobId}!`);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  // Filter Logic
  const filteredJobs = selectedFilter === "ALL" 
    ? jobsList 
    : jobsList.filter((j) => j.status === selectedFilter);

  return (
    <div style={styles.container}>
      {/* Header with Project File Navigation Dropdown */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <h1 style={styles.title}>📋 Assigned Maintenance Jobs</h1>
            <p style={styles.subtitle}>{VENDOR_JOBS_SPEC.page} — Real-time work orders dispatcher for service contractors.</p>
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

        {/* Filters Bar */}
        <div style={styles.filterBar}>
          {VENDOR_JOBS_SPEC.filters.map((filter, idx) => (
            <button
              key={idx}
              style={{
                ...styles.filterBtn,
                backgroundColor: selectedFilter === filter ? '#2563eb' : '#f8fafc',
                color: selectedFilter === filter ? '#ffffff' : '#475569',
                borderColor: selectedFilter === filter ? '#2563eb' : '#cbd5e1'
              }}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
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

      {/* Jobs List Grid */}
      <div style={styles.jobsGrid}>
        {filteredJobs.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No jobs found matching filter: <strong>{selectedFilter}</strong></p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.jobId} style={styles.jobCard}>
              <div style={styles.jobCardHeader}>
                <div>
                  <span style={styles.jobIdBadge}>{job.jobId}</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: 
                      job.status === 'COMPLETED' ? '#dcfce7' :
                      job.status === 'IN_PROGRESS' ? '#dbeafe' :
                      job.status === 'ACCEPTED' ? '#fef3c7' : '#fee2e2',
                    color: 
                      job.status === 'COMPLETED' ? '#166534' :
                      job.status === 'IN_PROGRESS' ? '#1e40af' :
                      job.status === 'ACCEPTED' ? '#92400e' : '#991b1b'
                  }}>
                    {job.status}
                  </span>
                </div>
                <span style={styles.priorityBadge}>Priority: {job.priority}</span>
              </div>

              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.categoryText}>Category: <strong>{job.category}</strong></p>

              <div style={styles.propertyInfoBox}>
                <p style={styles.propertyText}>🏢 <strong>{job.property.name}</strong></p>
                <p style={styles.propertySubText}>Building: {job.property.building} | Unit: {job.property.unit}</p>
              </div>

              <div style={styles.metaInfoRow}>
                <span>📅 {job.scheduledDate} at {job.scheduledTime}</span>
                <span style={styles.costText}>Est: ₹{job.estimatedCost}</span>
              </div>

              <div style={styles.assignedByRow}>
                <span style={styles.assignedByText}>Assigned By: {job.assignedBy.name}</span>
              </div>

              {/* Action Buttons Toolbar */}
              <div style={styles.actionToolbar}>
                {job.status === 'ASSIGNED' && (
                  <>
                    <button 
                      style={{ ...styles.actionBtn, backgroundColor: '#10b981', color: '#fff' }}
                      onClick={() => handleJobAction(job.jobId, 'acceptJob')}
                    >
                      ✓ Accept Job
                    </button>
                    <button 
                      style={{ ...styles.actionBtn, backgroundColor: '#ef4444', color: '#fff' }}
                      onClick={() => handleJobAction(job.jobId, 'rejectJob')}
                    >
                      ✕ Reject
                    </button>
                  </>
                )}

                {job.status === 'ACCEPTED' && (
                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#2563eb', color: '#fff' }}
                    onClick={() => handleJobAction(job.jobId, 'startJob')}
                  >
                    ▶ Start Work
                  </button>
                )}

                {job.status === 'IN_PROGRESS' && (
                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#059669', color: '#fff' }}
                    onClick={() => handleJobAction(job.jobId, 'completeJob')}
                  >
                    ✔ Mark Completed
                  </button>
                )}

                <button 
                  style={{ ...styles.actionBtn, backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                  onClick={() => {
                    setSelectedJob(job);
                    setAlertType("success");
                    setAlertMessage(`🔍 Viewing full technical specification for ${job.jobId}`);
                  }}
                >
                  View Details
                </button>
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
    marginBottom: '24px',
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
    marginBottom: '20px'
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
  filterBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6'
  },
  filterBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  alertBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid',
    fontWeight: '600',
    fontSize: '13px'
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px'
  },
  emptyCard: {
    gridColumn: '1 / -1',
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
  jobCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  jobCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  jobIdBadge: {
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '3px 8px',
    borderRadius: '6px',
    marginRight: '8px'
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
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  jobTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  categoryText: {
    fontSize: '12px',
    color: '#4b5563',
    margin: 0
  },
  propertyInfoBox: {
    backgroundColor: '#f8fafc',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  propertyText: {
    fontSize: '13px',
    color: '#1e293b',
    margin: 0
  },
  propertySubText: {
    fontSize: '11px',
    color: '#64748b',
    margin: 0
  },
  metaInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#475569',
    fontWeight: '600'
  },
  costText: {
    color: '#059669',
    fontWeight: 'bold'
  },
  assignedByRow: {
    fontSize: '11px',
    color: '#64748b',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '8px'
  },
  assignedByText: {
    fontStyle: 'italic'
  },
  actionToolbar: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center'
  }
};