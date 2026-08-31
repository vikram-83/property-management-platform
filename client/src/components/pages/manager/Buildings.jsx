import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import Loader from '../../common/Loader';
import PageDropdownNav from '../../common/PageDropdownNav';

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    buildingId: '',
    name: '',
    floors: 1,
    totalUnits: 0,
    occupiedUnits: 0,
    status: 'active',
    property: '',
  });

  useEffect(() => {
    fetchBuildings();
    fetchProperties();
  }, [search]);

  const fetchProperties = async () => {
    try {
      const { data } = await api.get('/properties');
      setProperties(data.data || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  };

  const fetchBuildings = async () => {
    try {
      const { data } = await api.get('/buildings', { params: { search } });
      setBuildings(data.data || []);
    } catch (err) {
      console.error('Failed to fetch buildings:', err);
      // Fallback mock data matching user schema
      setBuildings([
        {
          _id: '1',
          buildingId: 'BLD001',
          propertyId: 'PROP001',
          name: 'Tower A',
          floors: 10,
          totalUnits: 60,
          occupiedUnits: 48,
          vacantUnits: 12,
          status: 'active',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (building = null) => {
    if (building) {
      setSelectedBuilding(building);
      setFormData({
        buildingId: building.buildingId,
        name: building.name,
        floors: building.floors,
        totalUnits: building.totalUnits,
        occupiedUnits: building.occupiedUnits || 0,
        status: building.status || 'active',
        property: building.property?._id || building.property || '',
      });
    } else {
      setSelectedBuilding(null);
      setFormData({
        buildingId: `BLD00${buildings.length + 1}`,
        name: '',
        floors: 1,
        totalUnits: 0,
        occupiedUnits: 0,
        status: 'active',
        property: properties[0]?._id || '',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.property) {
        setError('Please select a property first.');
        return;
      }
      if (selectedBuilding) {
        await api.put(`/buildings/${selectedBuilding._id}`, formData);
      } else {
        await api.post('/buildings', formData);
      }
      setModalOpen(false);
      fetchBuildings();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save building.');
      console.error('Error saving building:', err);
    }
  };

  const handleDelete = async (id, mode = 'archive') => {
    if (!window.confirm(`Are you sure you want to ${mode} this building?`)) return;
    try {
      await api.delete(`/buildings/${id}?mode=${mode}`);
      fetchBuildings();
    } catch (err) {
      console.error('Error deleting building:', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="Buildings.jsx" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Building Management</h1>
          <p className="text-sm text-gray-500">Property → Building → Floor → Unit structure</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Add Building
        </button>
      </div>

      {/* Controls / Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by building name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-500 font-medium">Total Buildings: {buildings.length}</span>
      </div>

      {/* Buildings Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((item) => {
          const occupancy = item.totalUnits
            ? Math.round((item.occupiedUnits / item.totalUnits) * 100)
            : 0;

          return (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {item.buildingId}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-1">{item.name}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                    item.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Occupancy Progress */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property</label>
                <select
                  required
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>{property.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Occupancy ({occupancy}%)</span>
                  <span>{item.occupiedUnits} / {item.totalUnits} Units</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${occupancy}%` }}></div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 p-2.5 rounded-lg text-xs">
                <div>
                  <p className="text-gray-400">Floors</p>
                  <p className="font-semibold text-gray-700">{item.floors}</p>
                </div>
                <div>
                  <p className="text-gray-400">Occupied</p>
                  <p className="font-semibold text-emerald-600">{item.occupiedUnits}</p>
                </div>
                <div>
                  <p className="text-gray-400">Vacant</p>
                  <p className="font-semibold text-rose-600">{item.vacantUnits}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Edit Details
                </button>
                <div className="space-x-3">
                  <button
                    onClick={() => handleDelete(item._id, 'archive')}
                    className="text-amber-600 hover:underline"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, 'permanent')}
                    className="text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Building Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedBuilding ? 'Edit Building' : 'Add New Building'}
            </h2>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Building Code / ID</label>
                <input
                  type="text"
                  required
                  value={formData.buildingId}
                  onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Building Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Total Floors</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Total Units</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
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
                  <option value="active">Active</option>
                  <option value="under_maintenance">Under Maintenance</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Save Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buildings;