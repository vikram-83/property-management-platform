import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  Sparkles,
  X,
  AlertCircle
} from "lucide-react";

const INITIAL_BOOKINGS = [
  {
    bookingId: "BOOK001",
    amenity: "Swimming Pool",
    tenant: {
      id: "TEN001",
      name: "Rahul Sharma"
    },
    property: "Green Valley Residency",
    date: "2026-08-20",
    startTime: "17:00",
    endTime: "18:00",
    status: "pending"
  },
  {
    bookingId: "BOOK002",
    amenity: "Club House",
    tenant: {
      id: "TEN002",
      name: "Priya Patel"
    },
    property: "Green Valley Residency",
    date: "2026-08-21",
    startTime: "18:00",
    endTime: "20:00",
    status: "approved"
  },
  {
    bookingId: "BOOK003",
    amenity: "Gym",
    tenant: {
      id: "TEN003",
      name: "Ankit Verma"
    },
    property: "Green Valley Residency",
    date: "2026-08-19",
    startTime: "07:00",
    endTime: "08:00",
    status: "completed"
  }
];

export default function Bookings() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters State
  const [filters, setFilters] = useState({
    amenity: "",
    property: "",
    date: "",
    status: ""
  });

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.amenity.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAmenity = !filters.amenity || b.amenity === filters.amenity;
      const matchesProperty = !filters.property || b.property === filters.property;
      const matchesDate = !filters.date || b.date === filters.date;
      const matchesStatus = !filters.status || b.status === filters.status;

      return matchesSearch && matchesAmenity && matchesProperty && matchesDate && matchesStatus;
    });
  }, [bookings, searchQuery, filters]);

  // Handlers
  const handleUpdateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.bookingId === id) {
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" /> Amenity Bookings
          </h1>
          <p className="text-sm text-slate-500">Review, approve, or reject amenity booking requests</p>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
        {["pending", "approved", "rejected", "cancelled", "completed"].map((st) => (
          <div key={st} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm capitalize">
            <span className="text-slate-400 block mb-1">{st}</span>
            <span className="text-lg font-bold text-slate-800">
              {bookings.filter((b) => b.status === st).length}
            </span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Tenant name, or Amenity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setFilters({ amenity: "", property: "", date: "", status: "" })}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-sm">
          <select
            value={filters.amenity}
            onChange={(e) => setFilters({ ...filters, amenity: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Amenities</option>
            <option value="Swimming Pool">Swimming Pool</option>
            <option value="Gym">Gym</option>
            <option value="Club House">Club House</option>
          </select>

          <select
            value={filters.property}
            onChange={(e) => setFilters({ ...filters, property: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            <option value="">All Properties</option>
            <option value="Green Valley Residency">Green Valley Residency</option>
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 bg-white focus:outline-none"
          >
            
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Amenity & Property</th>
                <th className="p-4">Tenant</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-blue-600">{b.bookingId}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{b.amenity}</div>
                    <div className="text-xs text-slate-400">{b.property}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{b.tenant.name}</td>
                  <td className="p-4">
                    <div className="text-slate-800 font-medium">{b.date}</div>
                    <div className="text-xs text-slate-400">
                      {b.startTime} - {b.endTime}
                    </div>
                  </td>
                  <td className="p-4">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(b.bookingId, "approved")}
                          className="px-2.5 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.bookingId, "rejected")}
                          className="px-2.5 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="text-xs text-blue-600 font-medium hover:underline ml-2"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No amenity bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600">{selectedBooking.bookingId}</span>
                <h2 className="text-xl font-bold text-slate-800">{selectedBooking.amenity}</h2>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                <span className="text-xs font-semibold text-slate-500 uppercase">Current Status</span>
                <BookingStatusBadge status={selectedBooking.status} />
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Property</span>
                <span className="font-medium text-slate-700">{selectedBooking.property}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Tenant Name</span>
                <span className="font-medium text-slate-700">{selectedBooking.tenant.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-400 block">Date</span>
                  <span className="font-medium text-slate-700">{selectedBooking.date}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Time Slot</span>
                  <span className="font-medium text-slate-700">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </span>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="pt-4 border-t space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Manager Actions</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, "approved")}
                  className="flex-1 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, "rejected")}
                  className="flex-1 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, "cancelled")}
                  className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingStatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-slate-100 text-slate-600",
    completed: "bg-blue-100 text-blue-800"
  };
  return (
    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}