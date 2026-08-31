import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Plus,
  RefreshCw,
  XCircle,
  Download,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import leaseService from "../../../services/leaseService";

export default function LeaseManagement() {
  const [leases, setLeases] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expiringSoon: 0, terminated: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal Control States
  const [selectedLease, setSelectedLease] = useState(null);
  const [actionType, setActionType] = useState(null); // 'renew' | 'terminate'
  const [formData, setFormData] = useState({ newEndDate: "", newRentAmount: "", reason: "" });

  useEffect(() => {
    fetchLeases();
    fetchStats();
  }, [statusFilter]);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const response = await leaseService.getLeases({ status: statusFilter, search });
      setLeases(response.data || []);
    } catch (error) {
      console.error("Failed to load leases", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await leaseService.getLeaseStatistics();
      setStats(response.stats || {});
    } catch (error) {
      console.error("Failed to load lease stats", error);
    }
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (actionType === "renew") {
        await leaseService.renewLease(selectedLease._id, {
          newEndDate: formData.newEndDate,
          newRentAmount: formData.newRentAmount
        });
      } else if (actionType === "terminate") {
        await leaseService.terminateLease(selectedLease._id, {
          reason: formData.reason,
          terminationDate: new Date()
        });
      }
      setSelectedLease(null);
      setActionType(null);
      fetchLeases();
      fetchStats();
    } catch (error) {
      alert("Action failed: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>;
      case "Expiring Soon":
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Expiring Soon</span>;
      case "Terminated":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3 h-3"/> Terminated</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Lease Agreement Management
          </h1>
          <p className="text-sm text-slate-500">Monitor active agreements, renewals, and lease terminations</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Total Leases</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{stats.total || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Active Leases</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.active || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Expiring Soon</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats.expiringSoon || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Terminated</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats.terminated || 0}</div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search lease # or unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLeases()}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Leases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading lease agreements...</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <th className="p-3">Lease #</th>
                <th className="p-3">Property & Unit</th>
                <th className="p-3">Tenant</th>
                <th className="p-3">Period</th>
                <th className="p-3">Rent</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leases.map((lease) => (
                <tr key={lease._id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">{lease.leaseNumber}</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-700">{lease.property?.name || 'N/A'}</div>
                    <div className="text-slate-400">{lease.building} - Unit {lease.unitNumber}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-700">{lease.tenant?.name || 'N/A'}</div>
                    <div className="text-slate-400">{lease.tenant?.phone}</div>
                  </td>
                  <td className="p-3 text-slate-600">
                    {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold text-slate-800">₹{lease.rentAmount?.toLocaleString()}</td>
                  <td className="p-3">{getStatusBadge(lease.status)}</td>
                  <td className="p-3 text-right space-x-2">
                    {lease.status !== "Terminated" && (
                      <>
                        <button
                          onClick={() => { setSelectedLease(lease); setActionType("renew"); }}
                          className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => { setSelectedLease(lease); setActionType("terminate"); }}
                          className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Terminate
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Modal */}
      {selectedLease && actionType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-800">
              {actionType === "renew" ? "Renew Lease Agreement" : "Terminate Lease Early"}
            </h3>
            <p className="text-xs text-slate-500">
              Lease: <span className="font-semibold">{selectedLease.leaseNumber}</span> ({selectedLease.property?.name})
            </p>

            <form onSubmit={handleActionSubmit} className="space-y-3 text-xs">
              {actionType === "renew" ? (
                <>
                  <div>
                    <label className="block text-slate-500 mb-1">New End Date</label>
                    <input
                      type="date"
                      required
                      value={formData.newEndDate}
                      onChange={(e) => setFormData({ ...formData, newEndDate: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Updated Monthly Rent (₹)</label>
                    <input
                      type="number"
                      placeholder={selectedLease.rentAmount}
                      value={formData.newRentAmount}
                      onChange={(e) => setFormData({ ...formData, newRentAmount: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-slate-500 mb-1">Reason for Termination</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter reason..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setSelectedLease(null); setActionType(null); }}
                  className="px-3 py-1.5 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1.5 text-white font-semibold rounded-lg ${
                    actionType === "renew" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Confirm {actionType === "renew" ? "Renewal" : "Termination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}