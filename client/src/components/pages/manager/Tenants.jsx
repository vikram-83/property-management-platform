import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

import {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  assignUnitToTenant,
  deactivateTenant,
} from '../../../services/tenantService';

import Loader from '../../common/Loader';
import PageDropdownNav from '../../common/PageDropdownNav';
import { formatCurrency } from '../../../utils/formatCurrency';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [leaseStatus, setLeaseStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [activeTenant, setActiveTenant] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Form State
  const [formData, setFormData] = useState({
    tenantId: '',
    name: '',
    email: '',
    phone: '',
    property: '',
    building: '',
    unit: '',
    rent: 0,
  });

  const [assignData, setAssignData] = useState({
    propertyId: '',
    buildingId: '',
    unitId: '',
    rentAmount: 0,
  });

  const leaseStatuses = ['active', 'expired', 'pending', 'terminated'];
  const paymentStatuses = ['paid', 'pending', 'overdue', 'partial'];

  // Fetch initial filter options
  useEffect(() => {
    fetchInitialOptions();
  }, []);

  // Fetch tenants whenever filters change
  useEffect(() => {
    fetchFilteredTenants();
  }, [
    search,
    selectedProperty,
    selectedBuilding,
    selectedUnit,
    leaseStatus,
    paymentStatus,
  ]);

  const fetchInitialOptions = async () => {
    try {
      const [propRes, bldRes, unitRes] = await Promise.all([
        api
          .get('/properties')
          .catch(() => ({ data: { data: [] } })),

        api
          .get('/buildings')
          .catch(() => ({ data: { data: [] } })),

        api
          .get('/units')
          .catch(() => ({ data: { data: [] } })),
      ]);

      setProperties(propRes.data?.data || []);
      setBuildings(bldRes.data?.data || []);
      setUnits(unitRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching filter metadata:', err);
    }
  };

  const fetchFilteredTenants = async () => {
    try {
      const res = await getTenants({
        search,
        property: selectedProperty,
        building: selectedBuilding,
        unit: selectedUnit,
        leaseStatus,
        paymentStatus,
      });

      setTenants(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);

      // Fallback demo data
      setTenants([
        {
          _id: '1',
          tenantId: 'TEN001',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '+919876543210',

          property: {
            _id: 'p1',
            name: 'Green Valley Residency',
          },

          building: {
            _id: 'b1',
            name: 'Tower A',
          },

          unit: {
            _id: 'u1',
            unitNumber: 'A-101',
            unitId: 'UNIT101',
          },

          rent: 15000,
          leaseStatus: 'active',
          paymentStatus: 'paid',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = async (tenant) => {
    setActiveTenant(tenant);
    setProfileModalOpen(true);
    setActiveTab('overview');

    try {
      const res = await getTenantById(tenant._id);

      setProfileData(res.data || null);
    } catch (err) {
      console.error('Error fetching tenant detailed profile:', err);

      setProfileData({
        tenant,

        activeLease: {
          leaseId: 'L-1002',
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          deposit: 30000,
        },

        payments: [
          {
            _id: 'pay1',
            month: 'August 2026',
            amount: 15000,
            status: 'paid',
            date: '2026-08-02',
          },
          {
            _id: 'pay2',
            month: 'July 2026',
            amount: 15000,
            status: 'paid',
            date: '2026-07-01',
          },
        ],

        maintenanceHistory: [
          {
            _id: 'm1',
            title: 'Sink Pipe Leakage',
            status: 'resolved',
            createdAt: '2026-07-15',
          },
        ],
      });
    }
  };

  const handleOpenFormModal = (tenant = null) => {
    if (tenant) {
      setActiveTenant(tenant);

      setFormData({
        tenantId: tenant.tenantId || '',
        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        property: tenant.property?._id || tenant.property || '',
        building: tenant.building?._id || tenant.building || '',
        unit: tenant.unit?._id || tenant.unit || '',
        rent: tenant.rent || 0,
      });
    } else {
      setActiveTenant(null);

      setFormData({
        tenantId: `TEN${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        email: '',
        phone: '',
        property: '',
        building: '',
        unit: '',
        rent: 15000,
      });
    }

    setFormModalOpen(true);
  };

  const handleSaveTenant = async (e) => {
    e.preventDefault();

    try {
      if (activeTenant) {
        await updateTenant(activeTenant._id, formData);
      } else {
        await createTenant(formData);
      }

      setFormModalOpen(false);

      await fetchFilteredTenants();
    } catch (err) {
      console.error('Error saving tenant profile:', err);
    }
  };

  const handleDeactivate = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to deactivate this tenant and clear assigned unit?'
      )
    ) {
      return;
    }

    try {
      await deactivateTenant(id);

      await fetchFilteredTenants();
    } catch (err) {
      console.error('Error deactivating tenant:', err);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    if (!activeTenant) return;

    try {
      await assignUnitToTenant(activeTenant._id, assignData);

      setAssignModalOpen(false);

      setAssignData({
        propertyId: '',
        buildingId: '',
        unitId: '',
        rentAmount: 0,
      });

      await fetchFilteredTenants();
    } catch (err) {
      console.error('Error assigning unit:', err);
    }
  };

  const getLeaseBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';

      case 'pending':
        return 'bg-amber-100 text-amber-800';

      case 'expired':
      case 'terminated':
        return 'bg-rose-100 text-rose-800';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-blue-100 text-blue-800';

      case 'pending':
        return 'bg-amber-100 text-amber-800';

      case 'overdue':
        return 'bg-red-100 text-red-800';

      case 'partial':
        return 'bg-purple-100 text-purple-800';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="Tenants.jsx" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tenant Directory
          </h1>

          <p className="text-sm text-gray-500">
            Manage tenant profiles, leases, rent status, and maintenance
            requests
          </p>
        </div>

        <button
          onClick={() => handleOpenFormModal()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Add Tenant
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

          {/* Search */}
          <input
            type="text"
            placeholder="Search Name, Email, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Property */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Properties</option>

            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Building */}
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Buildings</option>

            {buildings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Unit */}
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Units</option>

            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.unitNumber}
              </option>
            ))}
          </select>

          {/* Lease Status */}
          <select
            value={leaseStatus}
            onChange={(e) => setLeaseStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="">All Lease Statuses</option>

            {leaseStatuses.map((ls) => (
              <option key={ls} value={ls}>
                {ls}
              </option>
            ))}
          </select>

          {/* Payment Status */}
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="">All Payment Statuses</option>

            {paymentStatuses.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Tenant</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Property / Unit</th>
                <th className="p-4">Rent</th>
                <th className="p-4">Lease</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {tenants.length > 0 ? (
                tenants.map((t) => {
                  const propName =
                    t.property?.name ||
                    t.property ||
                    'Unassigned';

                  const unitNum =
                    t.unit?.unitNumber ||
                    t.unit ||
                    'No Unit';

                  return (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50/80 transition"
                    >

                      {/* Tenant */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900">
                          {t.name}
                        </div>

                        <div className="text-xs font-mono text-gray-400">
                          {t.tenantId}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4 text-gray-700 text-xs">
                        <div>{t.email}</div>
                        <div className="text-gray-400">
                          {t.phone}
                        </div>
                      </td>

                      {/* Property / Unit */}
                      <td className="p-4 text-gray-700">
                        <div className="font-semibold text-gray-800">
                          {unitNum}
                        </div>

                        <div className="text-xs text-gray-400">
                          {propName}
                        </div>
                      </td>

                      {/* Rent */}
                      <td className="p-4 font-medium text-gray-900">
                        {formatCurrency
                          ? formatCurrency(t.rent)
                          : `₹${t.rent}`}
                      </td>

                      {/* Lease */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getLeaseBadge(
                            t.leaseStatus
                          )}`}
                        >
                          {t.leaseStatus || 'unknown'}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getPaymentBadge(
                            t.paymentStatus
                          )}`}
                        >
                          {t.paymentStatus || 'unknown'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">

                        <button
                          onClick={() => handleOpenProfile(t)}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Profile
                        </button>

                        <button
                          onClick={() => handleOpenFormModal(t)}
                          className="text-xs font-medium text-gray-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setActiveTenant(t);

                            setAssignData({
                              propertyId:
                                t.property?._id ||
                                t.property ||
                                '',

                              buildingId:
                                t.building?._id ||
                                t.building ||
                                '',

                              unitId:
                                t.unit?._id ||
                                t.unit ||
                                '',

                              rentAmount:
                                t.rent || 0,
                            });

                            setAssignModalOpen(true);
                          }}
                          className="text-xs font-medium text-emerald-600 hover:underline"
                        >
                          Assign Unit
                        </button>

                        <button
                          onClick={() => handleDeactivate(t._id)}
                          className="text-xs font-medium text-rose-600 hover:underline"
                        >
                          Deactivate
                        </button>

                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-gray-500"
                  >
                    No tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Tenant Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">

            <h2 className="text-lg font-bold text-gray-900">
              {activeTenant
                ? 'Edit Tenant Profile'
                : 'Add New Tenant'}
            </h2>

            <form
              onSubmit={handleSaveTenant}
              className="space-y-3"
            >

              {/* Tenant ID + Name */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Tenant ID
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.tenantId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tenantId: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Phone
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="+919876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* Property + Unit */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Property
                  </label>

                  <select
                    value={formData.property}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        property: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select Property
                    </option>

                    {properties.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Unit
                  </label>

                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unit: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select Unit
                    </option>

                    {units.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.unitNumber}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Rent */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Monthly Rent (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.rent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rent: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
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
                  Save Tenant
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* Assign Unit Modal */}
      {assignModalOpen && activeTenant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">

            <h2 className="text-lg font-bold text-gray-900">
              Assign Unit to {activeTenant.name}
            </h2>

            <form
              onSubmit={handleAssignSubmit}
              className="space-y-3"
            >

              {/* Property */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Property
                </label>

                <select
                  required
                  value={assignData.propertyId}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      propertyId: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Property
                  </option>

                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Building */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Building
                </label>

                <select
                  value={assignData.buildingId}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      buildingId: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Building
                  </option>

                  {buildings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Unit
                </label>

                <select
                  required
                  value={assignData.unitId}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      unitId: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Unit
                  </option>

                  {units.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.unitNumber}
                      {u.type ? ` (${u.type})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rent */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Rent Amount (₹)
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  value={assignData.rentAmount}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      rentAmount: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
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

      {/* Comprehensive Tenant Profile Modal */}
      {profileModalOpen && activeTenant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            {/* Profile Header */}
            <div className="flex justify-between items-start border-b pb-4">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTenant.name}
                </h2>

                <p className="text-xs text-gray-500 font-mono">
                  ID: {activeTenant.tenantId} •{' '}
                  {activeTenant.email} •{' '}
                  {activeTenant.phone}
                </p>
              </div>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>

            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex border-b text-xs font-semibold space-x-4 overflow-x-auto">

              {[
                'overview',
                'lease',
                'rent',
                'paymentHistory',
                'maintenance',
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 capitalize transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.replace(/([A-Z])/g, ' $1')}
                </button>
              ))}

            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-4 text-xs">

                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-gray-400">
                    Assigned Property
                  </span>

                  <p className="font-semibold text-gray-800">
                    {activeTenant.property?.name ||
                      'Unassigned'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-gray-400">
                    Assigned Unit
                  </span>

                  <p className="font-semibold text-gray-800">
                    {activeTenant.unit?.unitNumber ||
                      'Unassigned'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-gray-400">
                    Monthly Rent
                  </span>

                  <p className="font-semibold text-emerald-600 font-mono">
                    ₹{activeTenant.rent}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <span className="text-gray-400">
                    Current Payment Status
                  </span>

                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${getPaymentBadge(
                      activeTenant.paymentStatus
                    )}`}
                  >
                    {activeTenant.paymentStatus ||
                      'unknown'}
                  </span>
                </div>

              </div>
            )}

            {/* Lease */}
            {activeTab === 'lease' && (
              <div className="space-y-3 text-xs">

                <div className="p-4 border rounded-xl space-y-2">

                  <div className="flex justify-between">

                    <span className="font-bold text-gray-800">
                      Active Lease Agreement
                    </span>

                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold capitalize">
                      {activeTenant.leaseStatus ||
                        'unknown'}
                    </span>

                  </div>

                  <p className="text-gray-500">
                    Agreement Reference:{' '}
                    {profileData?.activeLease?.leaseId ||
                      'L-9982'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-gray-600">

                    <div>
                      Start Date:{' '}
                      <span className="font-medium text-gray-900">
                        {profileData?.activeLease?.startDate ||
                          '2026-01-01'}
                      </span>
                    </div>

                    <div>
                      End Date:{' '}
                      <span className="font-medium text-gray-900">
                        {profileData?.activeLease?.endDate ||
                          '2026-12-31'}
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Rent */}
            {activeTab === 'rent' && (
              <div className="p-4 bg-blue-50 rounded-xl space-y-2 text-xs">

                <p className="font-bold text-blue-900">
                  Rent Overview
                </p>

                <div className="flex justify-between items-center text-blue-800">
                  <span>
                    Current Agreed Monthly Rent:
                  </span>

                  <span className="text-base font-bold">
                    ₹{activeTenant.rent}
                  </span>
                </div>

                <div className="flex justify-between items-center text-blue-800">
                  <span>Due Date:</span>

                  <span className="font-medium">
                    1st of every month
                  </span>
                </div>

              </div>
            )}

            {/* Payment History */}
            {activeTab === 'paymentHistory' && (
              <div className="space-y-2 text-xs">

                <p className="font-semibold text-gray-700">
                  Recent Rent Payments
                </p>

                <div className="border rounded-lg divide-y">

                  {(profileData?.payments || []).length > 0 ? (
                    profileData.payments.map((p, idx) => (
                      <div
                        key={p._id || idx}
                        className="p-3 flex justify-between items-center"
                      >

                        <div>
                          <p className="font-bold text-gray-800">
                            {p.month}
                          </p>

                          <p className="text-gray-400 text-[10px]">
                            Paid on {p.date}
                          </p>
                        </div>

                        <div className="text-right">

                          <p className="font-bold text-gray-900">
                            ₹{p.amount}
                          </p>

                          <span className="text-[10px] text-emerald-600 font-semibold capitalize">
                            {p.status}
                          </span>

                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No payment history found.
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Maintenance */}
            {activeTab === 'maintenance' && (
              <div className="space-y-2 text-xs">

                <p className="font-semibold text-gray-700">
                  Maintenance Request History
                </p>

                <div className="border rounded-lg divide-y">

                  {(profileData?.maintenanceHistory || []).length > 0 ? (
                    profileData.maintenanceHistory.map(
                      (m, idx) => (
                        <div
                          key={m._id || idx}
                          className="p-3 flex justify-between items-center"
                        >

                          <div>
                            <p className="font-bold text-gray-800">
                              {m.title}
                            </p>

                            <p className="text-gray-400 text-[10px]">
                              Reported on {m.createdAt}
                            </p>
                          </div>

                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded capitalize text-[10px] font-semibold">
                            {m.status}
                          </span>

                        </div>
                      )
                    )
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No maintenance history found.
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Tenants;