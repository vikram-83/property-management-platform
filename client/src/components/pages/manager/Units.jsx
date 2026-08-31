import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import {
  getUnits,
  createUnit,
  updateUnit,
  markVacant,
  assignTenant,
} from '../../../services/unitService';
import Loader from '../../common/Loader';
import PageDropdownNav from '../../common/PageDropdownNav';
import { formatCurrency } from '../../../utils/formatCurrency';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [activeUnit, setActiveUnit] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    unitId: '',
    unitNumber: '',
    building: '',
    floor: 1,
    type: '2BHK',
    rent: 15000,
    status: 'available',
    property: '',
  });

  const [assignData, setAssignData] = useState({
    tenantId: '',
    leaseId: '',
  });

  const unitStatuses = ['available', 'occupied', 'reserved', 'maintenance', 'inactive'];
  const unitTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Penthouse', 'Commercial'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFilteredUnits();
  }, [search, selectedBuilding, selectedFloor, selectedType, selectedStatus, minRent, maxRent]);

  const fetchInitialData = async () => {
    try {
      const bldRes = await api.get('/buildings');
      setBuildings(bldRes.data?.data || []);
      const propertyRes = await api.get('/properties');
      setProperties(propertyRes.data?.data || []);
    } catch (err) {
      console.warn('Buildings list fallback');
      setBuildings([
        { _id: 'b1', name: 'Tower A' },
        { _id: 'b2', name: 'Tower B' },
      ]);
    }
  };

  const fetchFilteredUnits = async () => {
    try {
      const res = await getUnits({
        search,
        building: selectedBuilding,
        floor: selectedFloor,
        unitType: selectedType,
        occupancyStatus: selectedStatus,
        minRent,
        maxRent,
      });
      setUnits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch units:', err);
      // Fallback data structure adhering to user payload format
      setUnits([
        {
          _id: '1',
          unitId: 'UNIT101',
          unitNumber: 'A-101',
          building: { _id: 'b1', name: 'Tower A' },
          floor: 1,
          type: '2BHK',
          rent: 15000,
          status: 'occupied',
          tenant: { _id: 'TEN001', name: 'Rahul Sharma', email: 'rahul@example.com' },
        },
        {
          _id: '2',
          unitId: 'UNIT102',
          unitNumber: 'A-102',
          building: { _id: 'b1', name: 'Tower A' },
          floor: 1,
          type: '1BHK',
          rent: 11000,
          status: 'available',
          tenant: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFormModal = (unit = null) => {
    if (unit) {
      setActiveUnit(unit);
      setFormData({
        unitId: unit.unitId,
        unitNumber: unit.unitNumber,
        building: unit.building?._id || unit.building || '',
        floor: unit.floor,
        type: unit.type,
        rent: unit.rent,
        status: unit.status,
        property: unit.property?._id || unit.property || unit.building?.property || '',
      });
    } else {
      setActiveUnit(null);
      setFormData({
        unitId: `UNIT${Math.floor(100 + Math.random() * 900)}`,
        unitNumber: '',
        building: buildings[0]?._id || '',
        floor: 1,
        type: '2BHK',
        rent: 15000,
        status: 'available',
        property: properties[0]?._id || '',
      });
    }
    setFormModalOpen(true);
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.property || !formData.building) {
        setError('Please select a property and building first.');
        return;
      }
      if (activeUnit) {
        await updateUnit(activeUnit._id, formData);
      } else {
        await createUnit(formData);
      }
      setFormModalOpen(false);
      fetchFilteredUnits();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save unit.');
      console.error('Error saving unit:', err);
    }
  };

  const handleMarkVacant = async (id) => {
    if (!window.confirm('Are you sure you want to mark this unit as vacant?')) return;
    try {
      await markVacant(id);
      fetchFilteredUnits();
    } catch (err) {
      console.error('Error marking vacant:', err);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!activeUnit) return;
    try {
      await assignTenant(activeUnit._id, assignData);
      setAssignModalOpen(false);
      fetchFilteredUnits();
    } catch (err) {
      console.error('Error assigning tenant:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-emerald-100 text-emerald-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'reserved':
        return 'bg-purple-100 text-purple-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="Units.jsx" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Directory</h1>
          <p className="text-sm text-gray-500">Manage property units, occupancy status, leases, and tenant assignments</p>
        </div>
        <button
          onClick={() => handleOpenFormModal()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Add Unit
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Search Unit # or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Buildings</option>
            {buildings.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Floor #"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {unitTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {unitStatuses.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>

          <div className="flex items-center space-x-1">
            <input
              type="number"
              placeholder="Min ₹"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Unit</th>
                <th className="p-4">Building / Floor</th>
                <th className="p-4">Type</th>
                <th className="p-4">Monthly Rent</th>
                <th className="p-4">Status</th>
                <th className="p-4">Current Tenant</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {units.map((unit) => {
                const buildingName = unit.building?.name || unit.building || 'Unassigned';
                const tenantName = unit.tenant?.name || '—';

                return (
                  <tr key={unit._id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{unit.unitNumber}</div>
                      <div className="text-xs font-mono text-gray-400">{unit.unitId}</div>
                    </td>
                    <td className="p-4 text-gray-700">
                      <div>{buildingName}</div>
                      <div className="text-xs text-gray-400">Floor {unit.floor}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                        {unit.type}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      {formatCurrency ? formatCurrency(unit.rent) : `₹${unit.rent}`}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeClass(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{tenantName}</p>
                      {unit.tenant?.email && (
                        <p className="text-xs text-gray-400">{unit.tenant.email}</p>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveUnit(unit);
                          setDetailsModalOpen(true);
                        }}
                        className="text-xs font-medium text-gray-600 hover:text-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenFormModal(unit)}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      {unit.status === 'occupied' ? (
                        <button
                          onClick={() => handleMarkVacant(unit._id)}
                          className="text-xs font-medium text-amber-600 hover:underline"
                        >
                          Mark Vacant
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveUnit(unit);
                            setAssignModalOpen(true);
                          }}
                          className="text-xs font-medium text-emerald-600 hover:underline"
                        >
                          Assign Tenant
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Unit Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {activeUnit ? 'Edit Unit Specification' : 'Add New Unit'}
            </h2>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSaveUnit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Unit Code / ID</label>
                  <input
                    type="text"
                    required
                    value={formData.unitId}
                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-101"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property</label>
                <select
                  required
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>{property.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Building</label>
                <select
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Building</option>
                  {buildings.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Floor</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {unitTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rent (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {unitStatuses.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Tenant Modal */}
      {assignModalOpen && activeUnit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Assign Tenant to {activeUnit.unitNumber}
            </h2>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tenant User ID / Reference</label>
                <input
                  type="text"
                  required
                  placeholder="Enter User ID (e.g. TEN001)"
                  value={assignData.tenantId}
                  onChange={(e) => setAssignData({ ...assignData, tenantId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Lease Document ID (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter Lease ID"
                  value={assignData.leaseId}
                  onChange={(e) => setAssignData({ ...assignData, leaseId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Unit Details Modal */}
      {detailsModalOpen && activeUnit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Unit {activeUnit.unitNumber}</h2>
                <p className="text-xs font-mono text-gray-500">ID: {activeUnit.unitId}</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeClass(activeUnit.status)}`}>
                {activeUnit.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Building</p>
                <p className="font-semibold text-gray-800">{activeUnit.building?.name || activeUnit.building || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Floor</p>
                <p className="font-semibold text-gray-800">Floor {activeUnit.floor}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Unit Type</p>
                <p className="font-semibold text-gray-800">{activeUnit.type}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Monthly Rent</p>
                <p className="font-semibold text-emerald-600">₹{activeUnit.rent}</p>
              </div>
            </div>

            <div className="p-3 border rounded-lg space-y-1">
              <p className="text-xs font-semibold text-gray-500">Assigned Tenant</p>
              {activeUnit.tenant ? (
                <div>
                  <p className="text-sm font-bold text-gray-800">{activeUnit.tenant.name}</p>
                  <p className="text-xs text-gray-500">{activeUnit.tenant.email || 'No email registered'}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No tenant currently assigned to this unit.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Units;