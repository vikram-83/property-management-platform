import React, { useState, useMemo } from "react";
import {
  FileText,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  Building2,
  Calendar,
  Layers,
  PieChart,
  BarChart2,
  CheckCircle2,
  Search,
  Sparkles
} from "lucide-react";

// Catalog of available reports
const REPORT_TYPES = [
  { id: "occupancy", name: "Property Occupancy Report", category: "Property", icon: Building2 },
  { id: "rent_collection", name: "Rent Collection Report", category: "Financial", icon: PieChart },
  { id: "pending_payment", name: "Pending Payment Report", category: "Financial", icon: BarChart2 },
  { id: "tenant_report", name: "Tenant Report", category: "Tenants", icon: FileText },
  { id: "maintenance", name: "Maintenance Report", category: "Operations", icon: Layers },
  { id: "maintenance_cost", name: "Maintenance Cost Report", category: "Operations", icon: BarChart2 },
  { id: "amenity_usage", name: "Amenity Usage Report", category: "Amenities", icon: Sparkles },
  { id: "booking_report", name: "Booking Report", category: "Amenities", icon: Calendar },
  { id: "unit_vacancy", name: "Unit Vacancy Report", category: "Property", icon: Building2 },
  { id: "lease_expiry", name: "Lease Expiry Report", category: "Tenants", icon: Calendar }
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters State
  const [filters, setFilters] = useState({
    property: "",
    building: "",
    startDate: "",
    endDate: "",
    status: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Filter report list by search
  const filteredReportList = useMemo(() => {
    return REPORT_TYPES.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleExport = (format) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Exporting ${selectedReport.name} as ${format}`);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Manager Operational Reports
          </h1>
          <p className="text-sm text-slate-500">
            Analytics and data exports strictly scoped to your assigned properties
          </p>
        </div>
      </div>

      {/* Main Layout: Left Report Selector, Right Preview/Filter Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report Catalogue */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 h-fit">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search available reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredReportList.map((rpt) => {
              const Icon = rpt.icon;
              const isSelected = selectedReport.id === rpt.id;
              return (
                <button
                  key={rpt.id}
                  onClick={() => setSelectedReport(rpt)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 text-blue-800 font-bold"
                      : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{rpt.name}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {rpt.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Configuration, Filtering & Preview */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Export Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Selected Report</span>
              <h2 className="text-lg font-bold text-slate-800">{selectedReport.name}</h2>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleExport("PDF")}
                disabled={isGenerating}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => handleExport("CSV")}
                disabled={isGenerating}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>

          {/* Filters Workbench */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Report Scope & Filters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Assigned Property</label>
                <select
                  value={filters.property}
                  onChange={(e) => setFilters({ ...filters, property: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none"
                >
                  <option value="">All Assigned Properties</option>
                  <option value="Green Valley Residency">Green Valley Residency</option>
                  <option value="Sunrise Heights">Sunrise Heights</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Building</label>
                <select
                  value={filters.building}
                  onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none"
                >
                  <option value="">All Buildings</option>
                  <option value="Tower A">Tower A</option>
                  <option value="Tower B">Tower B</option>
                  <option value="Block C">Block C</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ property: "", building: "", startDate: "", endDate: "", status: "" })}
                  className="w-full p-2 text-slate-500 hover:text-slate-800 underline text-center"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Data Preview Block */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Data Preview ({selectedReport.name})
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Assigned Scope Active
              </span>
            </div>

            <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <selectedReport.icon className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700">
                Ready to generate: {selectedReport.name}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Filters applied will limit report rows exclusively to assigned units, tenants, bookings, or transactions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}