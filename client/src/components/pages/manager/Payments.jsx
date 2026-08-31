import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Search,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Building2,
  User,
  X,
  FileText,
  TrendingUp
} from "lucide-react";

// Mock Data
const INITIAL_STATS = {
  totalRent: 1800000,
  collected: 1650000,
  pending: 100000,
  overdue: 50000,
  collectionRate: 91.67
};

const INITIAL_PAYMENTS = [
  {
    paymentId: "PAY1001",
    property: "Green Valley Residency",
    building: "Tower A",
    unit: "102",
    tenant: { id: "TEN001", name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 98765 43210" },
    amount: 25000,
    dueDate: "2026-08-05",
    paymentDate: "2026-08-03",
    status: "paid",
    paymentMethod: "UPI",
    transactionId: "TXN889201923"
  },
  {
    paymentId: "PAY1002",
    property: "Green Valley Residency",
    building: "Tower B",
    unit: "204",
    tenant: { id: "TEN002", name: "Priya Patel", email: "priya.p@example.com", phone: "+91 98765 12345" },
    amount: 30000,
    dueDate: "2026-08-10",
    paymentDate: null,
    status: "pending",
    paymentMethod: "-",
    transactionId: "-"
  },
  {
    paymentId: "PAY1003",
    property: "Sunrise Heights",
    building: "Block C",
    unit: "501",
    tenant: { id: "TEN003", name: "Ankit Verma", email: "ankit.v@example.com", phone: "+91 98123 45678" },
    amount: 22000,
    dueDate: "2026-08-01",
    paymentDate: null,
    status: "overdue",
    paymentMethod: "-",
    transactionId: "-"
  },
  {
    paymentId: "PAY1004",
    property: "Green Valley Residency",
    building: "Tower A",
    unit: "305",
    tenant: { id: "TEN004", name: "Sneha Kapur", email: "sneha.k@example.com", phone: "+91 97654 32109" },
    amount: 28000,
    dueDate: "2026-08-05",
    paymentDate: "2026-08-05",
    status: "failed",
    paymentMethod: "Net Banking",
    transactionId: "TXN551029384"
  },
  {
    paymentId: "PAY1005",
    property: "Sunrise Heights",
    building: "Block A",
    unit: "101",
    tenant: { id: "TEN005", name: "Vikram Malhotra", email: "vikram.m@example.com", phone: "+91 98234 56789" },
    amount: 35000,
    dueDate: "2026-07-05",
    paymentDate: "2026-07-04",
    status: "refunded",
    paymentMethod: "Credit Card",
    transactionId: "TXN102938475"
  }
];

export default function Payments() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [stats] = useState(INITIAL_STATS);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters State
  const [filters, setFilters] = useState({
    property: "",
    building: "",
    unit: "",
    paymentStatus: "",
    startDate: "",
    endDate: ""
  });

  // Unique Filter Dropdown Options
  const properties = useMemo(() => [...new Set(payments.map((p) => p.property))], [payments]);
  const buildings = useMemo(() => [...new Set(payments.map((p) => p.building))], [payments]);

  // Filtered Payments Calculation
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.paymentId.toLowerCase().includes(query) ||
        p.tenant.name.toLowerCase().includes(query) ||
        p.unit.toLowerCase().includes(query) ||
        p.transactionId.toLowerCase().includes(query);

      const matchesProperty = !filters.property || p.property === filters.property;
      const matchesBuilding = !filters.building || p.building === filters.building;
      const matchesUnit = !filters.unit || p.unit.toLowerCase().includes(filters.unit.toLowerCase());
      const matchesStatus = !filters.paymentStatus || p.status === filters.paymentStatus;

      let matchesDate = true;
      if (filters.startDate) {
        matchesDate = matchesDate && p.dueDate >= filters.startDate;
      }
      if (filters.endDate) {
        matchesDate = matchesDate && p.dueDate <= filters.endDate;
      }

      return matchesSearch && matchesProperty && matchesBuilding && matchesUnit && matchesStatus && matchesDate;
    });
  }, [payments, searchQuery, filters]);

  const handleDownloadReceipt = (payment) => {
    alert(`Downloading receipt for Transaction ID: ${payment.transactionId || payment.paymentId}`);
  };

  const clearFilters = () => {
    setFilters({
      property: "",
      building: "",
      unit: "",
      paymentStatus: "",
      startDate: "",
      endDate: ""
    });
    setSearchQuery("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-emerald-600" /> Rent & Financial Overview
          </h1>
          <p className="text-sm text-slate-500">Operational view of assigned property rent collection</p>
        </div>
      </div>

      {/* Payment Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Rent Expected</span>
          <div className="text-2xl font-bold text-slate-800">₹{stats.totalRent.toLocaleString("en-IN")}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/30">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Total Collected
          </span>
          <div className="text-2xl font-bold text-emerald-700">₹{stats.collected.toLocaleString("en-IN")}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-1 bg-amber-50/30">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Rent
          </span>
          <div className="text-2xl font-bold text-amber-700">₹{stats.pending.toLocaleString("en-IN")}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm space-y-1 bg-red-50/30">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Overdue Rent
          </span>
          <div className="text-2xl font-bold text-red-700">₹{stats.overdue.toLocaleString("en-IN")}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm space-y-1 bg-blue-50/30">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Collection Rate
          </span>
          <div className="text-2xl font-bold text-blue-700">{stats.collectionRate}%</div>
        </div>
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Tenant, Unit, Transaction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 underline self-end sm:self-center"
          >
            Clear Filters
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 border-t border-slate-100 text-sm">
          <select
            value={filters.property}
            onChange={(e) => setFilters({ ...filters, property: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Properties</option>
            {properties.map((prop) => (
              <option key={prop} value={prop}>{prop}</option>
            ))}
          </select>

          <select
            value={filters.building}
            onChange={(e) => setFilters({ ...filters, building: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Buildings</option>
            {buildings.map((bldg) => (
              <option key={bldg} value={bldg}>{bldg}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Unit (e.g. 102)"
            value={filters.unit}
            onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
          />

          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="date"
            placeholder="From Date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
          />

          <input
            type="date"
            placeholder="To Date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Rent Payment Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="p-4">Payment ID</th>
                <th className="p-4">Property & Unit</th>
                <th className="p-4">Tenant Details</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.paymentId} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-emerald-600">{p.paymentId}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{p.property}</div>
                    <div className="text-xs text-slate-400">
                      {p.building} • Unit {p.unit}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-700">{p.tenant.name}</div>
                    <div className="text-xs text-slate-400">{p.tenant.phone}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="p-4">{p.dueDate}</td>
                  <td className="p-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {p.status === "paid" && (
                      <button
                        onClick={() => handleDownloadReceipt(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-medium"
                      >
                        <Download className="w-3 h-3" /> Receipt
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="text-xs text-emerald-600 font-medium hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No payment records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Drawer */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600">{selectedPayment.paymentId}</span>
                <h2 className="text-xl font-bold text-slate-800">Rent Payment Details</h2>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                <span className="text-xs font-semibold text-slate-500 uppercase">Payment Status</span>
                <StatusBadge status={selectedPayment.status} />
              </div>

              <div className="border-b pb-3 space-y-1">
                <span className="text-xs text-slate-400 block">Amount Due</span>
                <span className="text-2xl font-bold text-slate-800">
                  ₹{selectedPayment.amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Information</h3>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1 border border-slate-100">
                  <div className="font-medium text-slate-800">{selectedPayment.property}</div>
                  <div className="text-xs text-slate-500">
                    {selectedPayment.building} — Unit {selectedPayment.unit}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenant Information</h3>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1 border border-slate-100">
                  <div className="font-medium text-slate-800">{selectedPayment.tenant.name}</div>
                  <div className="text-xs text-slate-500">{selectedPayment.tenant.email}</div>
                  <div className="text-xs text-slate-500">{selectedPayment.tenant.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Due Date</span>
                  <span className="font-medium text-slate-700">{selectedPayment.dueDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Payment Date</span>
                  <span className="font-medium text-slate-700">{selectedPayment.paymentDate || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Payment Method</span>
                  <span className="font-medium text-slate-700">{selectedPayment.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Transaction ID</span>
                  <span className="font-medium text-slate-700 text-xs">{selectedPayment.transactionId}</span>
                </div>
              </div>
            </div>

            {selectedPayment.status === "paid" && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Official Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    overdue: "bg-red-100 text-red-800 border-red-200",
    failed: "bg-rose-100 text-rose-800 border-rose-200",
    refunded: "bg-slate-100 text-slate-700 border-slate-200"
  };

  const icons = {
    paid: <CheckCircle2 className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    overdue: <AlertTriangle className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />,
    refunded: <RotateCcw className="w-3 h-3" />
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${
        styles[status] || styles.pending
      }`}
    >
      {icons[status]}
      {status}
    </span>
  );
}