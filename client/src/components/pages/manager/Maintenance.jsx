import React, { useState, useMemo } from "react";
import PageDropdownNav from "../../common/PageDropdownNav";
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  MessageSquare,
  Upload,
  User,
  Building,
  Home,
  Tag,
  ArrowRight
} from "lucide-react";

// Mock Data matching maintenanceTicket JSON schema
const INITIAL_TICKETS = [
  {
    ticketId: "MT1001",
    title: "Water Leakage",
    description: "Water leakage reported under the main sink in bathroom",
    property: "Green Valley Residency",
    building: "Tower A",
    unit: "A-101",
    tenant: "Rahul Sharma",
    category: "Plumbing",
    priority: "high",
    status: "assigned",
    assignedTo: {
      type: "staff",
      id: "STAFF001",
      name: "Amit Kumar"
    },
    comments: [
      { id: 1, author: "Rahul Sharma", text: "Water is leaking quickly.", timestamp: "2026-08-17 09:30 AM" },
      { id: 2, author: "Manager", text: "Assigned to Amit.", timestamp: "2026-08-17 10:15 AM" }
    ],
    createdAt: "2026-08-17",
    expectedCompletion: "2026-08-18"
  },
  {
    ticketId: "MT1002",
    title: "AC Not Cooling",
    description: "Master bedroom AC unit is blowing warm air",
    property: "Green Valley Residency",
    building: "Tower B",
    unit: "B-304",
    tenant: "Priya Patel",
    category: "HVAC",
    priority: "urgent",
    status: "inProgress",
    assignedTo: {
      type: "vendor",
      id: "VEND004",
      name: "CoolAir Solutions"
    },
    comments: [],
    createdAt: "2026-08-18",
    expectedCompletion: "2026-08-19"
  }
];

const STAFF_OPTIONS = [
  { id: "STAFF001", name: "Amit Kumar", type: "staff" },
  { id: "STAFF002", name: "Suresh Raina", type: "staff" }
];

const VENDOR_OPTIONS = [
  { id: "VEND004", name: "CoolAir Solutions", type: "vendor" },
  { id: "VEND009", name: "QuickPlumb Services", type: "vendor" }
];

export default function Maintenance() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Filter States
  const [filters, setFilters] = useState({
    property: "",
    building: "",
    category: "",
    priority: "",
    status: ""
  });

  // Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tenant.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProperty = !filters.property || t.property === filters.property;
      const matchesBuilding = !filters.building || t.building === filters.building;
      const matchesCategory = !filters.category || t.category === filters.category;
      const matchesPriority = !filters.priority || t.priority === filters.priority;
      const matchesStatus = !filters.status || t.status === filters.status;

      return (
        matchesSearch &&
        matchesProperty &&
        matchesBuilding &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [tickets, searchQuery, filters]);

  // Handlers
  const handleUpdateTicket = (id, fields) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketId === id ? { ...t, ...fields } : t))
    );
    if (selectedTicket && selectedTicket.ticketId === id) {
      setSelectedTicket((prev) => ({ ...prev, ...fields }));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    const commentObj = {
      id: Date.now(),
      author: "Manager",
      text: newComment,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " ")
    };

    const updatedComments = [...(selectedTicket.comments || []), commentObj];
    handleUpdateTicket(selectedTicket.ticketId, { comments: updatedComments });
    setNewComment("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="Maintenance.jsx" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> Maintenance Management
          </h1>
          <p className="text-sm text-slate-500">Track and manage property maintenance tickets in real-time</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      {/* Workflow Tracker Overview */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Real-Time Workflow Pipeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          {["Open", "Assigned", "In Progress", "On Hold", "Resolved", "Closed"].map((st, i) => (
            <div key={st} className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold text-slate-700 block">{st}</span>
              <span className="text-slate-400">
                {tickets.filter((t) => t.status.toLowerCase() === st.toLowerCase().replace(" ", "")).length} Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, title, or tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setFilters({ property: "", building: "", category: "", priority: "", status: "" })}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-sm">
          <select
            value={filters.property}
            onChange={(e) => setFilters({ ...filters, property: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Properties</option>
            <option value="Green Valley Residency">Green Valley Residency</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="HVAC">HVAC</option>
            <option value="Electrical">Electrical</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="inProgress">In Progress</option>
            <option value="onHold">On Hold</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Title & Property</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((t) => (
                <tr key={t.ticketId} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-blue-600">{t.ticketId}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-400">
                      {t.property} • {t.unit}
                    </div>
                  </td>
                  <td className="p-4">{t.category}</td>
                  <td className="p-4">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="p-4">
                    {t.assignedTo ? (
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-700">
                        {t.assignedTo.name} ({t.assignedTo.type})
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No tickets found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Real-Time Management Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600">{selectedTicket.ticketId}</span>
                <h2 className="text-xl font-bold text-slate-800">{selectedTicket.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workflow Action Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workflow Controls</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => handleUpdateTicket(selectedTicket.ticketId, { priority: e.target.value })}
                    className="w-full p-2 text-sm border rounded bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateTicket(selectedTicket.ticketId, { status: e.target.value })}
                    className="w-full p-2 text-sm border rounded bg-white"
                  >
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="inProgress">In Progress</option>
                    <option value="onHold">On Hold</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Assign Staff/Vendor</label>
                <select
                  value={selectedTicket.assignedTo?.id || ""}
                  onChange={(e) => {
                    const selected = [...STAFF_OPTIONS, ...VENDOR_OPTIONS].find((opt) => opt.id === e.target.value);
                    handleUpdateTicket(selectedTicket.ticketId, {
                      assignedTo: selected ? { type: selected.type, id: selected.id, name: selected.name } : null,
                      status: selected && selectedTicket.status === "open" ? "assigned" : selectedTicket.status
                    });
                  }}
                  className="w-full p-2 text-sm border rounded bg-white"
                >
                  <option value="">Unassigned</option>
                  <optgroup label="Internal Staff">
                    {STAFF_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Staff)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="External Vendors">
                    {VENDOR_OPTIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Vendor)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Ticket Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="text-xs text-slate-400 block">Property & Unit</span>
                <span className="font-medium text-slate-700">
                  {selectedTicket.property}, {selectedTicket.building} - {selectedTicket.unit}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Tenant</span>
                <span className="font-medium text-slate-700">{selectedTicket.tenant}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Created On</span>
                <span className="font-medium text-slate-700">{selectedTicket.createdAt}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Expected Completion</span>
                <span className="font-medium text-slate-700">{selectedTicket.expectedCompletion}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-xs text-slate-400 block mb-1">Description</span>
              <p className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700">
                {selectedTicket.description}
              </p>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Activity & Comments
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedTicket.comments?.map((c) => (
                  <div key={c.id} className="p-2 bg-slate-50 rounded border text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{c.author}</span>
                      <span className="text-slate-400 font-normal">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 p-2 border rounded-lg text-sm focus:outline-none"
                />
                <button type="submit" className="px-3 py-2 bg-slate-800 text-white text-xs rounded-lg font-medium">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function PriorityBadge({ priority }) {
  const styles = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700"
  };
  return (
    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${styles[priority] || styles.low}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    open: "bg-amber-100 text-amber-800",
    assigned: "bg-purple-100 text-purple-800",
    inProgress: "bg-blue-100 text-blue-800",
    onHold: "bg-slate-100 text-slate-600",
    resolved: "bg-teal-100 text-teal-800",
    closed: "bg-emerald-100 text-emerald-800"
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status] || styles.open}`}>
      {status}
    </span>
  );
}