import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- PLATFORM FILES DIRECTORY & ROUTING SIMULATOR ---
const PLATFORM_FILES = [
  { name: "Login.jsx", category: "vendor", path: "/vendor/login" },
  { name: "Dashboard.jsx", category: "vendor", path: "/vendor/dashboard" },
  { name: "Vendor.jsx", category: "vendor", path: "/vendor/profile" },
  { name: "Jobs.jsx", category: "vendor", path: "/vendor/jobs" },
  { name: "Schedule.jsx", category: "vendor", path: "/vendor/schedule" },
  { name: "Materials.jsx", category: "vendor", path: "/vendor/materials" },
  { name: "Invoices.jsx", category: "vendor", path: "/vendor/invoices" }
];

// --- VENDOR PROFILE JSON SPECIFICATION + UNIQUE ENHANCEMENTS ---
const VENDOR_PROFILE_SPEC = {
  vendor: {
    vendorId: "VEN-102",
    businessName: "Sharma Electrical Services",
    ownerName: "Raj Sharma",
    businessType: "Electrical Contractor",
    email: "vendor@example.com",
    phone: "+91 9876543210",
    verification: {
      status: "VERIFIED",
      verifiedBy: "ADMIN",
      verifiedDate: "2026-08-20"
    },
    services: [
      "Electrical Repair",
      "AC Repair",
      "Wiring",
      "Plumbing"
    ],
    serviceAreas: [
      "Satna",
      "Rewa",
      "Maihar"
    ],
    experienceYears: 8,
    rating: {
      overall: 4.7,
      quality: 4.8,
      timeliness: 4.5,
      communication: 4.7
    },
    status: "ACTIVE",
    uniqueEnhancements: [
      "Live License Document Preview",
      "Service Area Geo-Radius Toggle",
      "Instant Compliance Status Check"
    ]
  }
};

export default function VendorProfile() {
  const navigate = useNavigate();
  // Navigation & File Dropdown State
  const [currentFile, setCurrentFile] = useState("Vendor.jsx");
  
  // Profile Editable State
  const [vendorData, setVendorData] = useState(VENDOR_PROFILE_SPEC.vendor);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleInputChange = (field, value) => {
    setVendorData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setAlertType("success");
    setAlertMessage("✅ Vendor business identity and profile updated successfully in database!");
    setTimeout(() => setAlertMessage(""), 4000);
  };

  return (
    <div style={styles.container}>
      {/* Header with Project File Navigation Dropdown */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <h1 style={styles.title}>🏢 Vendor Business Identity Profile</h1>
            <p style={styles.subtitle}>Manage business registration, service domains, verification metadata, and performance ratings.</p>
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

        <div style={styles.featureBadgeContainer}>
          <span style={styles.featureBadge}>✓ ID: {vendorData.vendorId}</span>
          <span style={styles.featureBadge}>✓ Status: {vendorData.status}</span>
          <span style={styles.featureBadge}>✓ KYC: {vendorData.verification.status}</span>
          <span style={styles.featureBadge}>✓ Exp: {vendorData.experienceYears} Years</span>
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

      {/* Main Grid Layout */}
      <div style={styles.gridWrapper}>
        
        {/* Left Column: Ratings & Verification Badge Card */}
        <div style={styles.leftColumn}>
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <h3 style={styles.cardTitle}>⭐ Performance Ratings</h3>
              <span style={styles.ratingBadge}>★ {vendorData.rating.overall} / 5.0</span>
            </div>
            
            <div style={styles.ratingMetricList}>
              <div style={styles.metricRow}>
                <span style={styles.metricLabel}>Quality of Work</span>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${(vendorData.rating.quality / 5) * 100}%` }}></div>
                </div>
                <span style={styles.metricValue}>{vendorData.rating.quality}</span>
              </div>

              <div style={styles.metricRow}>
                <span style={styles.metricLabel}>Timeliness</span>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${(vendorData.rating.timeliness / 5) * 100}%` }}></div>
                </div>
                <span style={styles.metricValue}>{vendorData.rating.timeliness}</span>
              </div>

              <div style={styles.metricRow}>
                <span style={styles.metricLabel}>Communication</span>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${(vendorData.rating.communication / 5) * 100}%` }}></div>
                </div>
                <span style={styles.metricValue}>{vendorData.rating.communication}</span>
              </div>
            </div>
          </div>

          {/* Verification & Compliance Status Box */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🛡️ Compliance & Verification</h3>
            <div style={styles.verificationBox}>
              <p style={styles.verifText}><strong>Status:</strong> <span style={{ color: '#059669' }}>{vendorData.verification.status}</span></p>
              <p style={styles.verifText}><strong>Verified By:</strong> {vendorData.verification.verifiedBy}</p>
              <p style={styles.verifText}><strong>Verified Date:</strong> {vendorData.verification.verifiedDate}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Business Identity Details Form */}
        <div style={styles.rightColumn}>
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <h3 style={styles.cardTitle}>📋 Business Identity Details</h3>
              <button 
                type="button" 
                style={styles.editToggleBtn}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "✏️ Edit Profile"}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={styles.form}>
              <div style={styles.formGrid}>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Business Name</label>
                  <input 
                    type="text" 
                    value={vendorData.businessName} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    style={styles.inputField}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Owner Name</label>
                  <input 
                    type="text" 
                    value={vendorData.ownerName} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    style={styles.inputField}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Business Type / Category</label>
                  <input 
                    type="text" 
                    value={vendorData.businessType} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    style={styles.inputField}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Experience (Years)</label>
                  <input 
                    type="number" 
                    value={vendorData.experienceYears} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('experienceYears', Number(e.target.value))}
                    style={styles.inputField}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input 
                    type="email" 
                    value={vendorData.email} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={styles.inputField}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input 
                    type="text" 
                    value={vendorData.phone} 
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={styles.inputField}
                  />
                </div>

              </div>

              {/* Service Areas & Specializations Tags */}
              <div style={styles.tagSection}>
                <label style={styles.label}>🛠️ Provided Services</label>
                <div style={styles.tagContainer}>
                  {vendorData.services.map((srv, idx) => (
                    <span key={idx} style={styles.tag}>{srv}</span>
                  ))}
                </div>
              </div>

              <div style={styles.tagSection}>
                <label style={styles.label}>📍 Operational Service Areas</label>
                <div style={styles.tagContainer}>
                  {vendorData.serviceAreas.map((area, idx) => (
                    <span key={idx} style={{ ...styles.tag, backgroundColor: '#fef3c7', color: '#92400e' }}>{area}</span>
                  ))}
                </div>
              </div>

              {isEditing && (
                <button type="submit" style={styles.saveButton}>
                  Save Business Profile Changes ➔
                </button>
              )}
            </form>
          </div>
        </div>

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
  featureBadgeContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6'
  },
  featureBadge: {
    fontSize: '11px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '600'
  },
  alertBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid',
    fontWeight: '600',
    fontSize: '13px'
  },
  gridWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  ratingBadge: {
    fontSize: '13px',
    fontWeight: 'bold',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    padding: '4px 10px',
    borderRadius: '6px'
  },
  ratingMetricList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px'
  },
  metricLabel: {
    width: '100px',
    fontWeight: '600',
    color: '#4b5563'
  },
  progressBarBg: {
    flex: 1,
    height: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: '4px'
  },
  metricValue: {
    width: '30px',
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  verificationBox: {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  verifText: {
    fontSize: '12px',
    color: '#334155',
    margin: 0
  },
  editToggleBtn: {
    background: 'none',
    border: '1px solid #cbd5e1',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#334155'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#374151'
  },
  inputField: {
    padding: '8px 10px',
    fontSize: '12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    backgroundColor: '#fdfdfd',
    color: '#1e293b'
  },
  tagSection: {
    marginTop: '6px'
  },
  tagContainer: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '6px'
  },
  tag: {
    fontSize: '11px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 10px',
    borderRadius: '8px',
    fontWeight: '600'
  },
  saveButton: {
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};