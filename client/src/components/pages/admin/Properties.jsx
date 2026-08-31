import React, { useState, useEffect } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import PageDropdownNav from '../../common/PageDropdownNav';
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Users,
  Home,
  MapPin,
  UserCheck,
  Percent,
  Check,
  AlertCircle
} from 'lucide-react';


const INITIAL_PROPERTIES = [
  {
    id: "PROP001",
    name: "Green Valley Residency",
    type: "Apartment",
    address: {
      city: "Satna",
      state: "Madhya Pradesh",
      country: "India",
      pincode: "485001"
    },
    manager: {
      id: "USR102",
      name: "Amit Sharma"
    },
    buildings: 4,
    units: 120,
    occupiedUnits: 95,
    vacantUnits: 25,
    status: "active", // options: active, pending, rejected, inactive
    createdAt: "2026-07-15"
  },
  {
    id: "PROP002",
    name: "Sunrise Heights",
    type: "Commercial",
    address: {
      city: "Indore",
      state: "Madhya Pradesh",
      country: "India",
      pincode: "452001"
    },
    manager: {
      id: "USR105",
      name: "Priya Patel"
    },
    buildings: 2,
    units: 40,
    occupiedUnits: 40,
    vacantUnits: 0,
    status: "active",
    createdAt: "2026-05-10"
  },
  {
    id: "PROP003",
    name: "Royal Palms Estate",
    type: "Villa Complex",
    address: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
      pincode: "462001"
    },
    manager: {
      id: "USR108",
      name: "Vikram Singh"
    },
    buildings: 10,
    units: 20,
    occupiedUnits: 5,
    vacantUnits: 15,
    status: "pending",
    createdAt: "2026-08-01"
  },
  {
    id: "PROP004",
    name: "Apex Business Hub",
    type: "Commercial",
    address: {
      city: "Satna",
      state: "Madhya Pradesh",
      country: "India",
      pincode: "485001"
    },
    manager: {
      id: "USR102",
      name: "Amit Sharma"
    },
    buildings: 1,
    units: 60,
    occupiedUnits: 0,
    vacantUnits: 60,
    status: "rejected",
    createdAt: "2026-08-10"
  }
];

const MANAGERS = [
  { id: "USR102", name: "Amit Sharma" },
  { id: "USR105", name: "Priya Patel" },
  { id: "USR108", name: "Vikram Singh" }
];

const Properties = () => {
  const { selectedProperty: activeChosenProperty, selectProperty } = useProperty();
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState(INITIAL_PROPERTIES);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterManager, setFilterManager] = useState('all');
  const [filterOccupancy, setFilterOccupancy] = useState('all'); // all, fully_occupied, partially_occupied, vacant

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Apartment',
    city: '',
    state: 'Madhya Pradesh',
    country: 'India',
    pincode: '',
    managerId: 'USR102',
    buildings: 1,
    units: 1,
    occupiedUnits: 0,
    status: 'active'
  });

  // Extract unique locations for the filter
  const locations = Array.from(
    new Set(properties.map((p) => p.address.city))
  );

  // Apply Search & Filters
  useEffect(() => {
    let result = [...properties];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.address.city.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') {
      result = result.filter((p) => p.type === filterType);
    }

    if (filterLocation !== 'all') {
      result = result.filter((p) => p.address.city === filterLocation);
    }

    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus);
    }

    if (filterManager !== 'all') {
      result = result.filter((p) => p.manager.id === filterManager);
    }

    if (filterOccupancy !== 'all') {
      if (filterOccupancy === 'fully_occupied') {
        result = result.filter((p) => p.vacantUnits === 0 && p.units > 0);
      } else if (filterOccupancy === 'partially_occupied') {
        result = result.filter((p) => p.occupiedUnits > 0 && p.vacantUnits > 0);
      } else if (filterOccupancy === 'vacant') {
        result = result.filter((p) => p.occupiedUnits === 0);
      }
    }

    setFilteredProperties(result);
  }, [
    searchQuery,
    filterType,
    filterLocation,
    filterStatus,
    filterManager,
    filterOccupancy,
    properties
  ]);

  // Actions
  const handleApprove = (id) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'active' } : p))
    );
  };

  const handleReject = (id) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setSelectedProperty(null);
    setFormData({
      name: '',
      type: 'Apartment',
      city: '',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '',
      managerId: 'USR102',
      buildings: 1,
      units: 1,
      occupiedUnits: 0,
      status: 'active'
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (property) => {
    setSelectedProperty(property);
    setFormData({
      name: property.name,
      type: property.type,
      city: property.address.city,
      state: property.address.state,
      country: property.address.country,
      pincode: property.address.pincode,
      managerId: property.manager.id,
      buildings: property.buildings,
      units: property.units,
      occupiedUnits: property.occupiedUnits,
      status: property.status
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveProperty = (e) => {
    e.preventDefault();
    const assignedManager = MANAGERS.find((m) => m.id === formData.managerId) || {
      id: formData.managerId,
      name: 'Unassigned'
    };

    const totalUnits = Number(formData.units);
    const occupied = Number(formData.occupiedUnits);
    const vacant = Math.max(0, totalUnits - occupied);

    if (selectedProperty) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === selectedProperty.id
            ? {
                ...p,
                name: formData.name,
                type: formData.type,
                address: {
                  city: formData.city,
                  state: formData.state,
                  country: formData.country,
                  pincode: formData.pincode
                },
                manager: assignedManager,
                buildings: Number(formData.buildings),
                units: totalUnits,
                occupiedUnits: occupied,
                vacantUnits: vacant,
                status: formData.status
              }
            : p
        )
      );
    } else {
      const newProp = {
        id: `PROP00${properties.length + 1}`,
        name: formData.name,
        type: formData.type,
        address: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode
        },
        manager: assignedManager,
        buildings: Number(formData.buildings),
        units: totalUnits,
        occupiedUnits: occupied,
        vacantUnits: vacant,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProperties((prev) => [newProp, ...prev]);
    }
    setIsAddEditModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      rejected: 'bg-rose-100 text-rose-800 border-rose-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          styles[status] || styles.inactive
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="admin" currentFileName="Properties.jsx" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" /> Property Directory
          </h1>
          <p className="text-sm text-gray-500">
            Manage real estate assets, oversee buildings, units, and select active property for management.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search property, ID, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Property Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Villa Complex">Villa Complex</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Cities</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Occupancy Filter */}
          <div>
            <select
              value={filterOccupancy}
              onChange={(e) => setFilterOccupancy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Occupancies</option>
              <option value="fully_occupied">Fully Occupied</option>
              <option value="partially_occupied">Partially Occupied</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Type & Location</th>
                <th className="px-6 py-3">Manager</th>
                <th className="px-6 py-3">Units & Occupancy</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => {
                  const occupancyRate = property.units
                    ? Math.round((property.occupiedUnits / property.units) * 100)
                    : 0;

                  return (
                    <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{property.name}</div>
                        <div className="text-xs text-gray-500">ID: {property.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-800 font-medium">{property.type}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {property.address.city}, {property.address.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-indigo-500" />
                          {property.manager.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-700 font-medium">
                          {property.occupiedUnits} / {property.units} Units Occupied
                        </div>
                        <div className="w-32 bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              occupancyRate >= 80
                                ? 'bg-emerald-500'
                                : occupancyRate >= 40
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(property.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Choose Property Button */}
                          <button
                            onClick={() => selectProperty(property)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              activeChosenProperty?.id === property.id
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200'
                            }`}
                            title={activeChosenProperty?.id === property.id ? 'Currently Active Property' : 'Set as Active Chosen Property'}
                          >
                            {activeChosenProperty?.id === property.id ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Active ✓</span>
                              </>
                            ) : (
                              <>
                                <span>⚡ Choose</span>
                              </>
                            )}
                          </button>

                          {property.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(property.id)}
                                title="Approve Property"
                                className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(property.id)}
                                title="Reject Property"
                                className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setIsDetailsModalOpen(true);
                            }}
                            title="View Property Details"
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(property)}
                            title="Edit Property"
                            className="p-1.5 text-indigo-600 hover:bg-gray-100 rounded-md"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(property.id)}
                            title="Delete Property"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                    No properties found matching your selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Property Details Modal */}
      {isDetailsModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{selectedProperty.name}</h3>
                <p className="text-xs text-gray-500">Property ID: {selectedProperty.id}</p>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Property Type</p>
                <p className="font-semibold text-gray-800">{selectedProperty.type}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Property Status</p>
                <div className="mt-1">{getStatusBadge(selectedProperty.status)}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <p className="text-xs text-gray-500">Full Address</p>
                <p className="font-semibold text-gray-800">
                  {selectedProperty.address.city}, {selectedProperty.address.state},{' '}
                  {selectedProperty.address.country} - {selectedProperty.address.pincode}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Assigned Manager</p>
                <p className="font-semibold text-gray-800">{selectedProperty.manager.name}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Total Buildings</p>
                <p className="font-semibold text-gray-800">{selectedProperty.buildings} Buildings</p>
              </div>
            </div>

            {/* Occupancy Stats Section */}
            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Occupancy Breakdown
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <span className="text-xs text-indigo-600 font-medium">Total Units</span>
                  <p className="text-xl font-bold text-indigo-900">{selectedProperty.units}</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <span className="text-xs text-emerald-600 font-medium">Occupied Units</span>
                  <p className="text-xl font-bold text-emerald-900">{selectedProperty.occupiedUnits}</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                  <span className="text-xs text-rose-600 font-medium">Vacant Units</span>
                  <p className="text-xl font-bold text-rose-900">{selectedProperty.vacantUnits}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Property Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-semibold text-lg text-gray-900">
                {selectedProperty ? 'Edit Property' : 'Add New Property'}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Villa Complex">Villa Complex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assigned Manager</label>
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {MANAGERS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Buildings</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.buildings}
                    onChange={(e) => setFormData({ ...formData, buildings: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Occupied Units</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.occupiedUnits}
                    onChange={(e) => setFormData({ ...formData, occupiedUnits: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;