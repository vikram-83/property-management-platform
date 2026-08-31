import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, CheckCircle, Zap, ArrowLeft, Users, Home, Wrench, Package, CreditCard, Calendar } from 'lucide-react';
import api from '../../../services/api';
import Loader from '../../common/Loader';
import PageDropdownNav from '../../common/PageDropdownNav';
import { useProperty } from '../../../context/PropertyContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProperty, selectProperty, properties } = useProperty();
  const [activeTab, setActiveTab] = useState('Overview');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    'Overview',
    'Buildings',
    'Units',
    'Tenants',
    'Maintenance',
    'Amenities',
    'Bookings',
    'Payments',
  ];

  // Look up property locally or via API
  const localProp = properties.find((p) => p.id === id || p._id === id) || properties[0];

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/properties/${id}/details`);
        if (data?.data) {
          setPropertyData(data.data);
        }
      } catch (err) {
        // Fallback to local property details
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) return <Loader />;

  const isCurrentActive = selectedProperty?.id === (id || localProp.id);

  const overview = propertyData?.overview || {
    propertyName: localProp?.name || 'Green Valley Residency',
    address: `${localProp?.address?.street || '124 Civil Lines'}, ${localProp?.address?.city || 'Satna'}, ${localProp?.address?.state || 'Madhya Pradesh'}`,
    propertyType: localProp?.type || 'Apartment',
    status: localProp?.status || 'active',
  };

  const statistics = propertyData?.statistics || {
    buildings: localProp?.buildings || 4,
    units: localProp?.units || 120,
    occupied: localProp?.occupiedUnits || 95,
    vacant: localProp?.vacantUnits || 25,
    tenants: localProp?.occupiedUnits || 95,
    maintenanceTickets: 12,
    amenityBookings: 28,
  };

  const occupancyRate = (
    (statistics.occupied / (statistics.units || 1)) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="propertyDetails.jsx" />

      {/* Navigation and Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/manager/properties')}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties List</span>
        </button>

        {/* Choose Property Action Button */}
        <button
          onClick={() => selectProperty(localProp)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
            isCurrentActive
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isCurrentActive ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Active Selection ✓</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Choose as Active Property</span>
            </>
          )}
        </button>
      </div>

      {/* Property Overview Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {overview.propertyName}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                overview.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {overview.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{overview.address}</span>
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
          Type: {overview.propertyType}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Buildings</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{statistics.buildings}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Total Units</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{statistics.units}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Occupied</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{statistics.occupied}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Vacant</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{statistics.vacant}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Tenants</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{statistics.tenants}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Maintenance</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{statistics.maintenanceTickets}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase">Bookings</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">{statistics.amenityBookings}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[250px]">
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Property Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Occupancy Rate</p>
                <p className="text-3xl font-extrabold text-emerald-600">{occupancyRate}%</p>
                <p className="text-xs text-slate-400">Total units occupied across all buildings</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Active Maintenance Tickets</p>
                <p className="text-3xl font-extrabold text-amber-600">
                  {statistics.maintenanceTickets} Open
                </p>
                <p className="text-xs text-slate-400">Work orders currently in triage or execution</p>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Overview' && (
          <div className="text-center py-10 text-slate-500 space-y-3">
            <p className="text-lg font-bold text-slate-800">{activeTab} Directory</p>
            <p className="text-sm">Showing detailed records for {activeTab.toLowerCase()} in {overview.propertyName}.</p>
            <button
              onClick={() => {
                const routeMap = {
                  Buildings: '/manager/buildings',
                  Units: '/manager/units',
                  Tenants: '/manager/tenants',
                  Maintenance: '/manager/maintenance',
                  Amenities: '/manager/amenities',
                  Bookings: '/manager/bookings',
                  Payments: '/manager/payments',
                };
                if (routeMap[activeTab]) navigate(routeMap[activeTab]);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Open Dedicated {activeTab} View ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;