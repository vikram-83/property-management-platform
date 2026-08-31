import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Home,
  Users,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useProperty } from '../../../context/PropertyContext';
import PageDropdownNav from '../../common/PageDropdownNav';

export default function ManagerProperties() {
  const { properties, selectedProperty, selectProperty } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const filtered = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || prop.type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Universal Page Dropdown Navigator */}
      <PageDropdownNav role="manager" currentFileName="properties.jsx" />

      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Portfolio Properties</h1>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {properties.length} Properties Managed
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Choose a property to set your active operational context across Buildings, Units, Tenants, and Maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/manager/buildings"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Buildings</span>
          </Link>
          <Link
            to="/manager/units"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Units</span>
          </Link>
          <Link
            to="/manager/tenants"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Tenants Directory</span>
          </Link>
        </div>
      </div>

      {/* Currently Selected Active Property Banner */}
      {selectedProperty && (
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-indigo-700/50 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> CURRENTLY ACTIVE PROPERTY
                </span>
                <span className="text-xs text-indigo-300">ID: {selectedProperty.id || selectedProperty._id}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{selectedProperty.name}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{selectedProperty.address?.street || 'Central Ave'}, {selectedProperty.address?.city}, {selectedProperty.address?.state}</span>
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-slate-800/80 border border-indigo-500/30 px-3.5 py-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[10px] uppercase">Buildings</span>
                <span className="text-base font-bold text-white">{selectedProperty.buildings || 4}</span>
              </div>
              <div className="bg-slate-800/80 border border-indigo-500/30 px-3.5 py-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[10px] uppercase">Total Units</span>
                <span className="text-base font-bold text-white">{selectedProperty.units || 120}</span>
              </div>
              <div className="bg-slate-800/80 border border-indigo-500/30 px-3.5 py-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[10px] uppercase">Occupancy</span>
                <span className="text-base font-bold text-emerald-400">
                  {selectedProperty.units ? Math.round(((selectedProperty.occupiedUnits || 95) / selectedProperty.units) * 100) : 85}%
                </span>
              </div>

              <button
                onClick={() => navigate(`/manager/properties/${selectedProperty.id || selectedProperty._id || 'PROP001'}`)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <span>Full Property View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties, cities, IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Villa Complex">Villa Complex</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filtered.map((property) => {
          const isChosen = (selectedProperty?.id === property.id || selectedProperty?._id === property._id);
          const occupancy = property.units
            ? Math.round(((property.occupiedUnits || 0) / property.units) * 100)
            : 0;

          return (
            <article
              key={property.id || property._id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${
                isChosen ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={property.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-slate-900 text-xs font-extrabold rounded-lg shadow">
                      {property.type || 'Apartment'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900/80 text-white text-[11px] font-mono rounded">
                      {property.id || property._id}
                    </span>
                  </div>

                  {isChosen && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-lg shadow flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> ACTIVE SELECTION
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-bold">{property.name}</h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{property.address?.city}, {property.address?.state}</span>
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  {/* Occupancy bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">
                        {property.occupiedUnits || 0} / {property.units || 0} Units Occupied
                      </span>
                      <span className={occupancy >= 80 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {occupancy}% Occupancy
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancy >= 80 ? 'bg-emerald-500' : occupancy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Buildings</span>
                      <span className="font-bold text-slate-800 text-sm">{property.buildings || 1}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Vacant Units</span>
                      <span className="font-bold text-slate-800 text-sm">{property.vacantUnits || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Manager</span>
                      <span className="font-bold text-slate-800 text-xs truncate block" title={property.manager?.name || 'Amit Sharma'}>
                        {property.manager?.name || 'Amit Sharma'}
                      </span>
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-2">
                {/* Choose Property Button */}
                <button
                  onClick={() => selectProperty(property)}
                  className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isChosen
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isChosen ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Chosen Active Property ✓</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Choose Property</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(`/manager/properties/${property.id || property._id || 'PROP001'}`)}
                  className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => navigate('/manager/units')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                  title="Manage Units in this Property"
                >
                  Units
                </button>

                <button
                  onClick={() => navigate('/manager/tenants')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                  title="Manage Tenants in this Property"
                >
                  Tenants
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
