import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Calendar,
  X,
  Power
} from "lucide-react";

const INITIAL_AMENITIES = [
  {
    amenityId: "AM001",
    name: "Swimming Pool",
    property: "Green Valley Residency",
    capacity: 30,
    status: "active",
    openingTime: "06:00",
    closingTime: "21:00",
    bookingRequired: true,
    bookingDuration: 60
  },
  {
    amenityId: "AM002",
    name: "Gym",
    property: "Green Valley Residency",
    capacity: 20,
    status: "active",
    openingTime: "05:00",
    closingTime: "22:00",
    bookingRequired: false,
    bookingDuration: 45
  },
  {
    amenityId: "AM003",
    name: "Club House",
    property: "Green Valley Residency",
    capacity: 100,
    status: "maintenance",
    openingTime: "09:00",
    closingTime: "23:00",
    bookingRequired: true,
    bookingDuration: 120
  }
];

export default function Amenities() {
  const [amenities, setAmenities] = useState(INITIAL_AMENITIES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    property: "Green Valley Residency",
    capacity: 10,
    status: "active",
    openingTime: "06:00",
    closingTime: "21:00",
    bookingRequired: true,
    bookingDuration: 60
  });

  // Filtered List
  const filteredAmenities = useMemo(() => {
    return amenities.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [amenities, search, statusFilter]);

  // Handlers
  const handleOpenModal = (amenity = null) => {
    if (amenity) {
      setEditingAmenity(amenity);
      setFormData(amenity);
    } else {
      setEditingAmenity(null);
      setFormData({
        name: "",
        property: "Green Valley Residency",
        capacity: 10,
        status: "active",
        openingTime: "06:00",
        closingTime: "21:00",
        bookingRequired: true,
        bookingDuration: 60
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingAmenity) {
      setAmenities((prev) =>
        prev.map((a) => (a.amenityId === editingAmenity.amenityId ? { ...formData } : a))
      );
    } else {
      const newAmenity = {
        ...formData,
        amenityId: `AM00${amenities.length + 1}`
      };
      setAmenities((prev) => [...prev, newAmenity]);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setAmenities((prev) =>
      prev.map((a) =>
        a.amenityId === id
          ? { ...a, status: a.status === "active" ? "disabled" : "active" }
          : a
      )
    );
  };

  const handleDelete = (id) => {
    setAmenities((prev) => prev.filter((a) => a.amenityId !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" /> Property Amenities
          </h1>
          <p className="text-sm text-slate-500">Create, control availability, capacity, and booking rules</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Amenity
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search amenity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-600"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmenities.map((amenity) => (
          <div
            key={amenity.amenityId}
            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-blue-600">{amenity.amenityId}</span>
                  <h2 className="text-lg font-bold text-slate-800">{amenity.name}</h2>
                  <p className="text-xs text-slate-400">{amenity.property}</p>
                </div>
                <StatusBadge status={amenity.status} />
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{amenity.openingTime} - {amenity.closingTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Max {amenity.capacity} people</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Booking: {amenity.bookingRequired ? `Required (${amenity.bookingDuration} mins)` : "Not Required"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
              <button
                onClick={() => handleToggleStatus(amenity.amenityId)}
                className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded ${
                  amenity.status === "active"
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                <Power className="w-3 h-3" />
                {amenity.status === "active" ? "Disable" : "Enable"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(amenity)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(amenity.amenityId)}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingAmenity ? "Edit Amenity" : "Create New Amenity"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amenity Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Swimming Pool, Gym, Club House"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Opening Time</label>
                  <input
                    type="time"
                    required
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Closing Time</label>
                  <input
                    type="time"
                    required
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bookingRequired}
                    onChange={(e) => setFormData({ ...formData, bookingRequired: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Booking Required</span>
                </label>

                {formData.bookingRequired && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      step="15"
                      value={formData.bookingDuration}
                      onChange={(e) => setFormData({ ...formData, bookingDuration: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Amenity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-800",
    disabled: "bg-slate-100 text-slate-600",
    maintenance: "bg-amber-100 text-amber-800"
  };
  return (
    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${styles[status] || styles.disabled}`}>
      {status}
    </span>
  );
}