import React, { useState, useMemo } from 'react';
import PageDropdownNav from '../../common/PageDropdownNav';
import { 
  Search, Filter, Download, Eye, RefreshCw, 
  CheckCircle, Clock, XCircle, ArrowLeftRight, CreditCard, Smartphone, Landmark, Banknote 
} from 'lucide-react';


// Configuration Schema
const PAYMENTS_CONFIG = {
  features: [
    "View all payments", "Search payment", "Filter payment",
    "View payment details", "Payment status", "Download receipt",
    "Refund tracking", "View transaction history"
  ],
  filters: ["paymentStatus", "paymentMethod", "dateRange", "property", "tenant"],
  status: ["paid", "pending", "failed", "refunded"],
  paymentMethods: ["UPI", "Card", "NetBanking", "Cash"]
};

// Initial Mock Data including provided sample
const INITIAL_PAYMENTS = [
  {
    id: "PAY001",
    transactionId: "TXN984512",
    tenant: { id: "USR500", name: "Vikram Singh" },
    property: "Green Valley Residency",
    unit: "A-203",
    amount: 15000,
    paymentType: "Rent",
    paymentMethod: "UPI",
    status: "paid",
    paymentDate: "2026-08-05",
    receipt: "https://example.com/receipt-PAY001.pdf"
  },
  {
    id: "PAY002",
    transactionId: "TXN984513",
    tenant: { id: "USR501", name: "Ananya Sharma" },
    property: "Sunrise Apartments",
    unit: "B-101",
    amount: 18500,
    paymentType: "Rent",
    paymentMethod: "Card",
    status: "pending",
    paymentDate: "2026-08-10",
    receipt: null
  },
  {
    id: "PAY003",
    transactionId: "TXN984514",
    tenant: { id: "USR502", name: "Rohan Gupta" },
    property: "Green Valley Residency",
    unit: "C-405",
    amount: 2500,
    paymentType: "Maintenance",
    paymentMethod: "NetBanking",
    status: "failed",
    paymentDate: "2026-08-12",
    receipt: null
  },
  {
    id: "PAY004",
    transactionId: "TXN984515",
    tenant: { id: "USR503", name: "Priya Patel" },
    property: "Palm Heights",
    unit: "12-A",
    amount: 15000,
    paymentType: "Deposit Refund",
    paymentMethod: "UPI",
    status: "refunded",
    paymentDate: "2026-08-01",
    receipt: "https://example.com/receipt-PAY004.pdf"
  }
];

export default function Payments() {
  const [payments] = useState(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    property: '',
    startDate: '',
    endDate: ''
  });

  // Dynamic Property List derived from payments dataset
  const properties = useMemo(() => {
    return Array.from(new Set(payments.map((p) => p.property)));
  }, [payments]);

  // Filter and Search Logic
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      // Search matching: ID, Transaction ID, Tenant Name, Property, Unit
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        item.id.toLowerCase().includes(search) ||
        item.transactionId.toLowerCase().includes(search) ||
        item.tenant.name.toLowerCase().includes(search) ||
        item.property.toLowerCase().includes(search) ||
        item.unit.toLowerCase().includes(search);

      // Filters matching
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesMethod = !filters.method || item.paymentMethod === filters.method;
      const matchesProperty = !filters.property || item.property === filters.property;

      // Date Range matching
      let matchesDate = true;
      if (filters.startDate) {
        matchesDate = matchesDate && new Date(item.paymentDate) >= new Date(filters.startDate);
      }
      if (filters.endDate) {
        matchesDate = matchesDate && new Date(item.paymentDate) <= new Date(filters.endDate);
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesProperty && matchesDate;
    });
  }, [payments, searchTerm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: '', method: '', property: '', startDate: '', endDate: '' });
    setSearchTerm('');
  };

  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDownloadReceipt = (payment) => {
    if (payment.receipt) {
      alert(`Downloading receipt for ${payment.id}`);
      // Window redirect/trigger logic for real URLs:
      // window.open(payment.receipt, '_blank');
    } else {
      alert("Receipt unavailable for this transaction.");
    }
  };

  // Status Badge UI helper
  const renderStatusBadge = (status) => {
    const config = {
      paid: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Paid' },
      pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
      failed: { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle, label: 'Failed' },
      refunded: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: ArrowLeftRight, label: 'Refunded' }
    };
    const current = config[status] || { color: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock, label: status };
    const Icon = current.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {current.label}
      </span>
    );
  };

  // Payment Method Icon helper
  const renderMethodIcon = (method) => {
    switch (method) {
      case 'UPI': return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'Card': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'NetBanking': return <Landmark className="w-4 h-4 text-teal-600" />;
      case 'Cash': return <Banknote className="w-4 h-4 text-emerald-600" />;
      default: return <CreditCard className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Universal Page Dropdown Navigator */}
        <PageDropdownNav role="admin" currentFileName="Payment.jsx" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payments & Transactions</h1>
            <p className="text-sm text-slate-500">Track, filter, and manage property payment records</p>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm transition"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Payment ID, Transaction ID, Tenant, or Property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Dynamic Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="">All Statuses</option>
                {PAYMENTS_CONFIG.status.map((st) => (
                  <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Method</label>
              <select
                value={filters.method}
                onChange={(e) => handleFilterChange('method', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="">All Methods</option>
                {PAYMENTS_CONFIG.paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>

            {/* Property Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Property</label>
              <select
                value={filters.property}
                onChange={(e) => handleFilterChange('property', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
            </div>

            {/* Date Range - Start */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            {/* Date Range - End */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Payment Ref</th>
                  <th className="px-6 py-3.5">Tenant & Property</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Method</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.id}</div>
                        <div className="text-xs text-slate-400 font-mono">{item.transactionId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.tenant.name}</div>
                        <div className="text-xs text-slate-500">{item.property} ({item.unit})</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                        <span className="block text-xs font-normal text-slate-400">{item.paymentType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          {renderMethodIcon(item.paymentMethod)}
                          {item.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.paymentDate}</td>
                      <td className="px-6 py-4">{renderStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openPaymentDetails(item)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(item)}
                            disabled={!item.receipt}
                            className={`p-1.5 rounded-lg transition ${
                              item.receipt
                                ? 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100'
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                            title={item.receipt ? "Download Receipt" : "No receipt available"}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                      No payments found matching your current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Payment Details */}
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Payment Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-900">₹{selectedPayment.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>{renderStatusBadge(selectedPayment.status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Payment ID</p>
                    <p className="font-semibold text-slate-800">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Transaction ID</p>
                    <p className="font-mono text-slate-800">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Tenant Name</p>
                    <p className="font-medium text-slate-800">{selectedPayment.tenant.name}</p>
                    <p className="text-xs text-slate-400">ID: {selectedPayment.tenant.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Property & Unit</p>
                    <p className="font-medium text-slate-800">{selectedPayment.property}</p>
                    <p className="text-xs text-slate-500">Unit: {selectedPayment.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Payment Type</p>
                    <p className="font-medium text-slate-800">{selectedPayment.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Payment Method</p>
                    <p className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                      {renderMethodIcon(selectedPayment.paymentMethod)}
                      {selectedPayment.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="font-medium text-slate-800">{selectedPayment.paymentDate}</p>
                  </div>
                  {selectedPayment.status === 'refunded' && (
                    <div>
                      <p className="text-xs text-slate-400">Refund Status</p>
                      <p className="font-medium text-indigo-600">Processed to source</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                {selectedPayment.receipt && (
                  <button
                    onClick={() => handleDownloadReceipt(selectedPayment)}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}