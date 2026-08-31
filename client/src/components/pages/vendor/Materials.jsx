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
  { name: "Invoices.jsx", category: "vendor", path: "/vendor/invoices" }
];

// --- VENDOR MATERIALS JSON SPECIFICATION + MOCK DATA ---
const VENDOR_MATERIALS_SPEC = {
  page: "Vendor Materials",
  purpose: "Vendor ke required, used aur purchased materials ko manage karna",
  features: [
    "Required materials list",
    "Used materials tracking",
    "Material quantity",
    "Material cost",
    "Stock availability",
    "Add material",
    "Update quantity",
    "Remove material",
    "Material purchase request",
    "Manager approval status",
    "Material usage history"
  ],
  actions: {
    addMaterial: "Job ke liye material add karna",
    updateQuantity: "Material quantity update karna",
    requestPurchase: "New material purchase request bhejna",
    markUsed: "Used quantity record karna",
    viewHistory: "Material usage history dekhna"
  },
  materials: [
    {
      id: "MAT001",
      jobId: "JOB101",
      name: "AC Capacitor",
      category: "Electrical",
      requiredQuantity: 1,
      usedQuantity: 1,
      availableQuantity: 2,
      unit: "Piece",
      unitCost: 450,
      totalCost: 450,
      status: "Used"
    },
    {
      id: "MAT002",
      jobId: "JOB102",
      name: "PVC Pipe",
      category: "Plumbing",
      requiredQuantity: 5,
      usedQuantity: 0,
      availableQuantity: 2,
      unit: "Meter",
      unitCost: 120,
      totalCost: 600,
      status: "Purchase Required"
    },
    {
      id: "MAT003",
      jobId: "JOB101",
      name: "Copper Wire",
      category: "Electrical",
      requiredQuantity: 10,
      usedQuantity: 8,
      availableQuantity: 15,
      unit: "Meter",
      unitCost: 80,
      totalCost: 800,
      status: "Available"
    }
  ],
  summary: {
    totalMaterials: 3,
    usedMaterials: 1,
    purchaseRequired: 1,
    estimatedCost: 1850
  }
};

export default function Materials() {
  const navigate = useNavigate();
  // Navigation & File Dropdown State
  const [currentFile, setCurrentFile] = useState("Materials.jsx");
  
  // Materials State
  const [materialsList, setMaterialsList] = useState(VENDOR_MATERIALS_SPEC.materials);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  
  // New Material Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMatName, setNewMatName] = useState("");
  const [newMatCategory, setNewMatCategory] = useState("Electrical");
  const [newMatQty, setNewMatQty] = useState(1);
  const [newMatUnit, setNewMatUnit] = useState("Piece");
  const [newMatCost, setNewMatCost] = useState(100);

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

  const handleMaterialAction = (matId, actionType) => {
    setMaterialsList((prev) =>
      prev.map((item) => {
        if (item.id === matId) {
          let updatedStatus = item.status;
          let usedQty = item.usedQuantity;
          if (actionType === 'markUsed') {
            usedQty = item.requiredQuantity;
            updatedStatus = 'Used';
          }
          if (actionType === 'requestPurchase') {
            updatedStatus = 'Approval Pending';
          }
          return { ...item, status: updatedStatus, usedQuantity: usedQty };
        }
        return item;
      })
    );

    setAlertType("success");
    setAlertMessage(`⚡ Material action '${actionType}' successfully processed for ${matId}!`);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const handleAddNewMaterial = (e) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    const newEntry = {
      id: `MAT00${materialsList.length + 1}`,
      jobId: "JOB101",
      name: newMatName,
      category: newMatCategory,
      requiredQuantity: Number(newMatQty),
      usedQuantity: 0,
      availableQuantity: 5,
      unit: newMatUnit,
      unitCost: Number(newMatCost),
      totalCost: Number(newMatQty) * Number(newMatCost),
      status: "Available"
    };

    setMaterialsList([newEntry, ...materialsList]);
    setShowAddModal(false);
    setNewMatName("");
    setAlertType("success");
    setAlertMessage("📦 New material successfully added to inventory & job specification!");
    setTimeout(() => setAlertMessage(""), 4000);
  };

  // Filter Logic
  const filteredMaterials = selectedFilter === "ALL"
    ? materialsList
    : materialsList.filter((m) => m.status.toUpperCase().includes(selectedFilter.toUpperCase()));

  const computedSummary = {
    totalMaterials: materialsList.length,
    usedMaterials: materialsList.filter(m => m.status === 'Used').length,
    purchaseRequired: materialsList.filter(m => m.status.includes('Purchase') || m.status.includes('Pending')).length,
    estimatedCost: materialsList.reduce((acc, curr) => acc + curr.totalCost, 0)
  };

  return (
    <div style={styles.container}>
      {/* Header with Project File Navigation Dropdown */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <h1 style={styles.title}>📦 {VENDOR_MATERIALS_SPEC.page}</h1>
            <p style={styles.subtitle}>{VENDOR_MATERIALS_SPEC.purpose}</p>
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

        {/* Summary Metric Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Total Items</span>
            <span style={styles.summaryValue}>{computedSummary.totalMaterials}</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Used Materials</span>
            <span style={{ ...styles.summaryValue, color: '#059669' }}>{computedSummary.usedMaterials}</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Purchase Required</span>
            <span style={{ ...styles.summaryValue, color: '#dc2626' }}>{computedSummary.purchaseRequired}</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Total Cost</span>
            <span style={{ ...styles.summaryValue, color: '#2563eb' }}>₹{computedSummary.estimatedCost}</span>
          </div>
        </div>

        {/* Filter & Action Toolbar */}
        <div style={styles.toolbarRow}>
          <div style={styles.filterBar}>
            {["ALL", "USED", "PURCHASE", "AVAILABLE"].map((filter, idx) => (
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

          <button 
            style={styles.addPrimaryBtn}
            onClick={() => setShowAddModal(!showAddModal)}
          >
            + Add New Material
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

      {/* Add Material Expandable Form Modal */}
      {showAddModal && (
        <form onSubmit={handleAddNewMaterial} style={styles.modalCard}>
          <h3 style={styles.modalTitle}>➕ Add Material Request for Job</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Material Name</label>
              <input 
                type="text" 
                value={newMatName} 
                onChange={(e) => setNewMatName(e.target.value)} 
                placeholder="e.g. PVC Valve, MCB Switch" 
                style={styles.input} 
                required 
              />
            </div>
            <div>
              <label style={styles.label}>Category</label>
              <select value={newMatCategory} onChange={(e) => setNewMatCategory(e.target.value)} style={styles.input}>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="HVAC">HVAC</option>
                <option value="Carpentry">Carpentry</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Required Quantity & Unit</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  value={newMatQty} 
                  onChange={(e) => setNewMatQty(e.target.value)} 
                  style={{ ...styles.input, width: '80px' }} 
                  min="1" 
                />
                <select value={newMatUnit} onChange={(e) => setNewMatUnit(e.target.value)} style={styles.input}>
                  <option value="Piece">Piece</option>
                  <option value="Meter">Meter</option>
                  <option value="Packet">Packet</option>
                  <option value="Set">Set</option>
                </select>
              </div>
            </div>
            <div>
              <label style={styles.label}>Unit Cost (₹)</label>
              <input 
                type="number" 
                value={newMatCost} 
                onChange={(e) => setNewMatCost(e.target.value)} 
                style={styles.input} 
                min="1" 
              />
            </div>
          </div>
          <div style={styles.modalActionRow}>
            <button type="submit" style={styles.submitBtn}>Save Material</button>
            <button type="button" style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Materials Grid List */}
      <div style={styles.materialsGrid}>
        {filteredMaterials.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No materials found matching current filter criterion.</p>
          </div>
        ) : (
          filteredMaterials.map((mat) => (
            <div key={mat.id} style={styles.materialCard}>
              <div style={styles.cardHeaderRow}>
                <div>
                  <span style={styles.matIdBadge}>{mat.id}</span>
                  <span style={styles.jobIdBadge}>{mat.jobId}</span>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: 
                    mat.status === 'Used' ? '#dcfce7' :
                    mat.status.includes('Purchase') ? '#fee2e2' : '#dbeafe',
                  color: 
                    mat.status === 'Used' ? '#166534' :
                    mat.status.includes('Purchase') ? '#991b1b' : '#1e40af'
                }}>
                  {mat.status}
                </span>
              </div>

              <h3 style={styles.matName}>{mat.name}</h3>
              <p style={styles.categoryText}>Category: <strong>{mat.category}</strong></p>

              <div style={styles.specsBox}>
                <div style={styles.specRow}>
                  <span>Required Qty:</span>
                  <strong>{mat.requiredQuantity} {mat.unit}</strong>
                </div>
                <div style={styles.specRow}>
                  <span>Used Qty:</span>
                  <strong>{mat.usedQuantity} {mat.unit}</strong>
                </div>
                <div style={styles.specRow}>
                  <span>Stock Available:</span>
                  <span style={{ color: mat.availableQuantity >= mat.requiredQuantity ? '#059669' : '#dc2626' }}>
                    {mat.availableQuantity} {mat.unit}
                  </span>
                </div>
                <div style={{ ...styles.specRow, borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px' }}>
                  <span>Total Calculated Cost:</span>
                  <span style={styles.costText}>₹{mat.totalCost}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div style={styles.actionToolbar}>
                {mat.status !== 'Used' && (
                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#059669', color: '#fff' }}
                    onClick={() => handleMaterialAction(mat.id, 'markUsed')}
                  >
                    ✔ Mark Used
                  </button>
                )}

                {mat.status !== 'Used' && !mat.status.includes('Pending') && (
                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#d97706', color: '#fff' }}
                    onClick={() => handleMaterialAction(mat.id, 'requestPurchase')}
                  >
                    🛒 Request Purchase
                  </button>
                )}

                <button 
                  style={{ ...styles.actionBtn, backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                  onClick={() => {
                    setAlertType("success");
                    setAlertMessage(`📜 Viewing full audit usage history for material item: ${mat.name}`);
                  }}
                >
                  View History
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
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  summaryCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  summaryLabel: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  toolbarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6'
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  addPrimaryBtn: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  alertBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid',
    fontWeight: '600',
    fontSize: '13px'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '14px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px',
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: '4px',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalActionRow: {
    display: 'flex',
    gap: '10px'
  },
  submitBtn: {
    padding: '8px 16px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer'
  },
  materialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
  materialCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  matIdBadge: {
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
    borderRadius: '6px'
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  matName: {
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
  specsBox: {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#334155'
  },
  costText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: '13px'
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
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center'
  }
};