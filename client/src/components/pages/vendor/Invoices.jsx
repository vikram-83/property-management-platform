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

// --- VENDOR INVOICES JSON SPECIFICATION + MOCK DATA ---
const VENDOR_INVOICES_SPEC = {
  page: "Vendor Invoices",
  purpose: "Vendor ke submitted invoices, approval aur payment status ko manage karna",
  features: [
    "Create invoice",
    "Submit invoice",
    "View invoice",
    "Download invoice",
    "Invoice number",
    "Job reference",
    "Service charges",
    "Material charges",
    "Tax calculation",
    "Total amount",
    "Invoice approval status",
    "Payment status",
    "Payment date",
    "Rejected invoice reason",
    "Invoice history"
  ],
  actions: {
    createInvoice: "Completed job ke liye invoice create karna",
    submitInvoice: "Invoice manager ko submit karna",
    viewInvoice: "Invoice details dekhna",
    downloadInvoice: "Invoice download karna",
    editInvoice: "Pending invoice edit karna",
    cancelInvoice: "Invoice cancel karna"
  },
  invoiceForm: {
    requiredFields: [
      "jobId",
      "invoiceNumber",
      "serviceDescription",
      "serviceCharge",
      "materialCharge",
      "tax",
      "totalAmount",
      "notes"
    ]
  },
  invoices: [
    {
      id: "INV001",
      invoiceNumber: "VND-2026-001",
      jobId: "JOB101",
      property: "Green Valley Apartments",
      unit: "A-203",
      service: "AC Repair",
      serviceCharge: 800,
      materialCharge: 450,
      tax: 225,
      totalAmount: 1475,
      submittedDate: "2026-08-31",
      approvalStatus: "Approved",
      paymentStatus: "Paid",
      paymentDate: "2026-08-31"
    },
    {
      id: "INV002",
      invoiceNumber: "VND-2026-002",
      jobId: "JOB102",
      property: "Sunrise Residency",
      unit: "B-105",
      service: "Plumbing Repair",
      serviceCharge: 1000,
      materialCharge: 600,
      tax: 288,
      totalAmount: 1888,
      submittedDate: "2026-08-31",
      approvalStatus: "Pending",
      paymentStatus: "Pending",
      paymentDate: null
    }
  ],
  summary: {
    totalInvoices: 2,
    approvedInvoices: 1,
    pendingInvoices: 1,
    paidInvoices: 1,
    pendingPayments: 1,
    totalRevenue: 3363
  }
};

export default function Invoices() {
  const navigate = useNavigate();
  // Navigation & File Dropdown State
  const [currentFile, setCurrentFile] = useState("Invoices.jsx");
  
  // Invoices State
  const [invoicesList, setInvoicesList] = useState(VENDOR_INVOICES_SPEC.invoices);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  
  // Create Invoice Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formJobId, setFormJobId] = useState("JOB103");
  const [formService, setFormService] = useState("Electrical Wiring Check");
  const [formProperty, setFormProperty] = useState("Silver Oak Enclave");
  const [formUnit, setFormUnit] = useState("C-402");
  const [formServiceCharge, setFormServiceCharge] = useState(1200);
  const [formMaterialCharge, setFormMaterialCharge] = useState(400);

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

  const handleInvoiceAction = (invId, actionType) => {
    setInvoicesList((prev) =>
      prev.map((item) => {
        if (item.id === invId) {
          let updatedApproval = item.approvalStatus;
          let updatedPayment = item.paymentStatus;
          let payDate = item.paymentDate;

          if (actionType === 'submitInvoice') {
            updatedApproval = 'Pending';
          }
          if (actionType === 'cancelInvoice') {
            updatedApproval = 'Cancelled';
            updatedPayment = 'Cancelled';
          }
          return { ...item, approvalStatus: updatedApproval, paymentStatus: updatedPayment, paymentDate: payDate };
        }
        return item;
      })
    );

    setAlertType("success");
    setAlertMessage(`⚡ Invoice action '${actionType}' successfully processed for ${invId}!`);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const sCharge = Number(formServiceCharge);
    const mCharge = Number(formMaterialCharge);
    const calculatedTax = Math.round((sCharge + mCharge) * 0.18);
    const total = sCharge + mCharge + calculatedTax;

    const newInv = {
      id: `INV00${invoicesList.length + 1}`,
      invoiceNumber: `VND-2026-00${invoicesList.length + 1}`,
      jobId: formJobId,
      property: formProperty,
      unit: formUnit,
      service: formService,
      serviceCharge: sCharge,
      materialCharge: mCharge,
      tax: calculatedTax,
      totalAmount: total,
      submittedDate: "2026-08-31",
      approvalStatus: "Pending",
      paymentStatus: "Pending",
      paymentDate: null
    };

    setInvoicesList([newInv, ...invoicesList]);
    setShowCreateModal(false);
    setAlertType("success");
    setAlertMessage("🧾 New invoice successfully created and submitted for manager approval!");
    setTimeout(() => setAlertMessage(""), 4000);
  };

  // Filter Logic
  const filteredInvoices = selectedFilter === "ALL"
    ? invoicesList
    : invoicesList.filter((inv) => 
        inv.approvalStatus.toUpperCase() === selectedFilter.toUpperCase() ||
        inv.paymentStatus.toUpperCase() === selectedFilter.toUpperCase()
      );

  const computedSummary = {
    totalInvoices: invoicesList.length,
    approvedInvoices: invoicesList.filter(i => i.approvalStatus === 'Approved').length,
    pendingInvoices: invoicesList.filter(i => i.approvalStatus === 'Pending').length,
    paidInvoices: invoicesList.filter(i => i.paymentStatus === 'Paid').length,
    pendingPayments: invoicesList.filter(i => i.paymentStatus === 'Pending').length,
    totalRevenue: invoicesList.reduce((acc, curr) => curr.paymentStatus === 'Paid' ? acc + curr.totalAmount : acc, 0)
  };

  return (
    <div style={styles.container}>
      {/* Header with Project File Navigation Dropdown */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div>
            <h1 style={styles.title}>🧾 {VENDOR_INVOICES_SPEC.page}</h1>
            <p style={styles.subtitle}>{VENDOR_INVOICES_SPEC.purpose}</p>
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
            <span style={styles.summaryLabel}>Total Invoices</span>
            <span style={styles.summaryValue}>{computedSummary.totalInvoices}</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Approved</span>
            <span style={{ ...styles.summaryValue, color: '#059669' }}>{computedSummary.approvedInvoices}</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Pending Approval</span>
            <span style={{ ...styles.summaryValue, color: '#d97706' }}>{computedSummary.pendingInvoices}</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>Paid Revenue</span>
            <span style={{ ...styles.summaryValue, color: '#2563eb' }}>₹{computedSummary.totalRevenue}</span>
          </div>
        </div>

        {/* Filter & Action Toolbar */}
        <div style={styles.toolbarRow}>
          <div style={styles.filterBar}>
            {["ALL", "APPROVED", "PENDING", "PAID"].map((filter, idx) => (
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
            onClick={() => setShowCreateModal(!showCreateModal)}
          >
            + Create New Invoice
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

      {/* Create Invoice Modal Form */}
      {showCreateModal && (
        <form onSubmit={handleCreateInvoiceSubmit} style={styles.modalCard}>
          <h3 style={styles.modalTitle}>📄 Generate New Job Invoice Form</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Job Reference ID</label>
              <input type="text" value={formJobId} onChange={(e) => setFormJobId(e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Service Description</label>
              <input type="text" value={formService} onChange={(e) => setFormService(e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Property Name & Unit</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={formProperty} onChange={(e) => setFormProperty(e.target.value)} style={{ ...styles.input, flex: 2 }} required />
                <input type="text" value={formUnit} onChange={(e) => setFormUnit(e.target.value)} style={{ ...styles.input, flex: 1 }} required />
              </div>
            </div>
            <div>
              <label style={styles.label}>Service Charge (₹)</label>
              <input type="number" value={formServiceCharge} onChange={(e) => setFormServiceCharge(e.target.value)} style={styles.input} min="0" required />
            </div>
            <div>
              <label style={styles.label}>Material Charge (₹)</label>
              <input type="number" value={formMaterialCharge} onChange={(e) => setFormMaterialCharge(e.target.value)} style={styles.input} min="0" required />
            </div>
          </div>
          <div style={styles.modalActionRow}>
            <button type="submit" style={styles.submitBtn}>Submit Invoice to Manager</button>
            <button type="button" style={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Invoices List Grid */}
      <div style={styles.invoicesGrid}>
        {filteredInvoices.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No invoices found matching selected filter criteria.</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div key={inv.id} style={styles.invoiceCard}>
              <div style={styles.cardHeaderRow}>
                <div>
                  <span style={styles.invIdBadge}>{inv.id}</span>
                  <span style={styles.invNumberBadge}>{inv.invoiceNumber}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: inv.approvalStatus === 'Approved' ? '#dcfce7' : inv.approvalStatus === 'Pending' ? '#fef3c7' : '#fee2e2',
                    color: inv.approvalStatus === 'Approved' ? '#166534' : inv.approvalStatus === 'Pending' ? '#92400e' : '#991b1b'
                  }}>
                    Approval: {inv.approvalStatus}
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: inv.paymentStatus === 'Paid' ? '#dbeafe' : '#f1f5f9',
                    color: inv.paymentStatus === 'Paid' ? '#1e40af' : '#475569'
                  }}>
                    Payment: {inv.paymentStatus}
                  </span>
                </div>
              </div>

              <h3 style={styles.serviceTitle}>{inv.service}</h3>
              <p style={styles.propertyText}>🏢 <strong>{inv.property}</strong> — Unit: {inv.unit} | Job: {inv.jobId}</p>

              <div style={styles.financialsBox}>
                <div style={styles.finRow}>
                  <span>Service Charges:</span>
                  <strong>₹{inv.serviceCharge}</strong>
                </div>
                <div style={styles.finRow}>
                  <span>Material Charges:</span>
                  <strong>₹{inv.materialCharge}</strong>
                </div>
                <div style={styles.finRow}>
                  <span>Tax (18% GST):</span>
                  <strong>₹{inv.tax}</strong>
                </div>
                <div style={{ ...styles.finRow, borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px' }}>
                  <span>Total Amount:</span>
                  <span style={styles.totalAmountText}>₹{inv.totalAmount}</span>
                </div>
              </div>

              <div style={styles.dateMetaRow}>
                <span>Submitted: {inv.submittedDate}</span>
                <span>{inv.paymentDate ? `Paid On: ${inv.paymentDate}` : 'Payment Pending'}</span>
              </div>

              {/* Action Toolbar */}
              <div style={styles.actionToolbar}>
                <button 
                  style={{ ...styles.actionBtn, backgroundColor: '#2563eb', color: '#fff' }}
                  onClick={() => {
                    setAlertType("success");
                    setAlertMessage(`📄 Downloading official PDF receipt for invoice ${inv.invoiceNumber}`);
                  }}
                >
                  📥 Download PDF
                </button>

                {inv.approvalStatus === 'Pending' && (
                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: '#d97706', color: '#fff' }}
                    onClick={() => handleInvoiceAction(inv.id, 'submitInvoice')}
                  >
                    🔄 Resubmit
                  </button>
                )}

                <button 
                  style={{ ...styles.actionBtn, backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                  onClick={() => {
                    setAlertType("success");
                    setAlertMessage(`🔍 Detailed audit view opened for invoice reference ${inv.id}`);
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
  invoicesGrid: {
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
  invoiceCard: {
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
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px'
  },
  invIdBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '3px 8px',
    borderRadius: '6px',
    marginRight: '6px'
  },
  invNumberBadge: {
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  serviceTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  propertyText: {
    fontSize: '12px',
    color: '#4b5563',
    margin: 0
  },
  financialsBox: {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  finRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#334155'
  },
  totalAmountText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  dateMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '8px'
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