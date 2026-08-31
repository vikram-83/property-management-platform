import React, { useState, useMemo } from 'react';
import PageDropdownNav from '../../common/PageDropdownNav';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  Building2, UserCheck, RefreshCw, TrendingUp, CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';


// Configuration Schema
const REPORTS_CONFIG = {
  types: [
    "Revenue Report",
    "Payment Report",
    "Property Report",
    "Occupancy Report",
    "Tenant Report",
    "Maintenance Report",
    "User Report",
    "Booking Report"
  ],
  filters: ["dateRange", "property", "manager", "status"],
  actions: ["View Report", "Download PDF", "Export CSV", "Print Report"]
};

// Initial Data matching provided JSON + additional placeholder mock data for full visualization
const SAMPLE_REVENUE_REPORT = {
  totalRevenue: 2450000,
  paidAmount: 2100000,
  pendingAmount: 350000,
  failedAmount: 50000,
  monthlyRevenue: [
    { month: "January", amount: 320000 },
    { month: "February", amount: 380000 },
    { month: "March", amount: 410000 },
    { month: "April", amount: 390000 },
    { month: "May", amount: 450000 },
    { month: "June", amount: 500000 }
  ]
};

const PROPERTIES_LIST = ["All Properties", "Green Valley Residency", "Sunrise Apartments", "Palm Heights"];
const MANAGERS_LIST = ["All Managers", "Amit Sharma", "Priya Verma", "Rajesh Kumar"];
const STATUS_LIST = ["All Statuses", "Completed", "Pending", "Overdue"];

export default function Report() {
  const [selectedReportType, setSelectedReportType] = useState("Revenue Report");
  const [revenueData] = useState(SAMPLE_REVENUE_REPORT);

  // Filter States
  const [filters, setFilters] = useState({
    startDate: '2026-01-01',
    endDate: '2026-08-31',
    property: 'All Properties',
    manager: 'All Managers',
    status: 'All Statuses'
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      property: 'All Properties',
      manager: 'All Managers',
      status: 'All Statuses'
    });
  };

  // Action Handler Functions
  const handleDownloadPDF = () => {
    alert(`Downloading PDF for ${selectedReportType}...`);
  };

  const handleExportCSV = () => {
    const headers = ["Month", "Amount (INR)"];
    const rows = revenueData.monthlyRevenue.map((item) => [item.month, item.amount]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReportType.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Find maximum monthly value for progress bar dynamic scaling
  const maxMonthlyAmount = useMemo(() => {
    return Math.max(...revenueData.monthlyRevenue.map((item) => item.amount), 1);
  }, [revenueData]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Universal Page Dropdown Navigator */}
        <PageDropdownNav role="admin" currentFileName="Reports.jsx" />
        
        {/* Header & Main Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports Analytics</h1>
            <p className="text-sm text-slate-500">Generate, review, and export financial and operational property reports</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg shadow-sm transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg shadow-sm transition"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>

        {/* Report Type Selector Tabs */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
            {REPORTS_CONFIG.types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedReportType(type)}
                className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition ${
                  selectedReportType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="w-4 h-4 text-slate-500" />
              Report Filters
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            {/* Date Range Start & End */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date Range</label>
              <div className="flex gap-1.5">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg text-xs px-2 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg text-xs px-2 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* Property Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Property</label>
              <select
                value={filters.property}
                onChange={(e) => handleFilterChange('property', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {PROPERTIES_LIST.map((prop) => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
            </div>

            {/* Manager Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Manager</label>
              <select
                value={filters.manager}
                onChange={(e) => handleFilterChange('manager', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {MANAGERS_LIST.map((mgr) => (
                  <option key={mgr} value={mgr}>{mgr}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {STATUS_LIST.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Content Body */}
        {selectedReportType === "Revenue Report" ? (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">₹{revenueData.totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Paid Amount</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">₹{revenueData.paidAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Pending Amount</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">₹{revenueData.pendingAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Failed Amount</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">₹{revenueData.failedAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Monthly Breakdown Table & Visual Bar Progress */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Monthly Revenue Breakdown</h3>
                  <p className="text-xs text-slate-500">Historical performance data by month</p>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {filters.property}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Month</th>
                      <th className="px-6 py-3.5">Volume Contribution</th>
                      <th className="px-6 py-3.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {revenueData.monthlyRevenue.map((item, idx) => {
                      const percentage = ((item.amount / maxMonthlyAmount) * 100).toFixed(0);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-4 font-semibold text-slate-900">{item.month}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 max-w-xs">
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-400 w-8">{percentage}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-slate-900">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder View for non-revenue report selections */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">{selectedReportType}</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
              Data visualization for {selectedReportType} is generated based on selected filters ({filters.property}, {filters.manager}).
            </p>
          </div>
        )}

      </div>
    </div>
  );
}