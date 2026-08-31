import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { 
  Building2, 
  Home, 
  MapPin, 
  Car, 
  Zap, 
  Droplet, 
  ShieldCheck, 
  Wrench, 
  Layers, 
  Maximize2, 
  Bed, 
  Bath, 
  Wind, 
  Activity, 
  Plus, 
  Calendar, 
  Cpu, 
  RefreshCw,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

const MyProperty = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Real State matching provided JSON structure with unique features
  const [propertyData, setPropertyData] = useState({
    property: {
      name: "Green Valley Residency",
      address: "Satna, Madhya Pradesh",
      building: "Tower A",
      unit: "A-203",
      pincode: "485001"
    },
    unit: {
      type: "2BHK",
      floor: 2,
      area: "1200 sqft",
      bedrooms: 2,
      bathrooms: 2,
      balcony: 1,
      furnishingStatus: "Semi-Furnished",
      facing: "North-East"
    },
    assets: [
      {
        id: "AST001",
        name: "Split AC (1.5 Ton)",
        brand: "Voltas",
        assetId: "AST001",
        condition: "Good",
        installedDate: "2025-06-10",
        lastServiced: "2026-03-15",
        status: "Optimal"
      },
      {
        id: "AST002",
        name: "Water Geyser (25L)",
        brand: "AO Smith",
        assetId: "AST002",
        condition: "Good",
        installedDate: "2025-04-12",
        lastServiced: "2026-01-20",
        status: "Optimal"
      },
      {
        id: "AST003",
        name: "Modular Kitchen Chimney",
        brand: "Faber",
        assetId: "AST003",
        condition: "Needs Service",
        installedDate: "2025-01-15",
        lastServiced: "2025-11-10",
        status: "Attention Required"
      }
    ],
    parking: {
      slot: "P-23",
      type: "Car Parking (Covered)",
      level: "Basement 1"
    },
    meterReading: {
      electricity: 12450,
      water: 3200,
      lastUpdatedElec: "2026-08-20",
      lastUpdatedWater: "2026-08-20"
    }
  });

  // Unique Feature State: Meter Reading Update Modal
  const [showMeterModal, setShowMeterModal] = useState(false);
  const [newReading, setNewReading] = useState({
    type: 'electricity',
    value: ''
  });

  const handleUpdateMeter = (e) => {
    e.preventDefault();
    if (!newReading.value) return;

    if (newReading.type === 'electricity') {
      setPropertyData(prev => ({
        ...prev,
        meterReading: {
          ...prev.meterReading,
          electricity: parseFloat(newReading.value),
          lastUpdatedElec: new Date().toISOString().split('T')[0]
        }
      }));
    } else {
      setPropertyData(prev => ({
        ...prev,
        meterReading: {
          ...prev.meterReading,
          water: parseFloat(newReading.value),
          lastUpdatedWater: new Date().toISOString().split('T')[0]
        }
      }));
    }

    setNewReading({ type: 'electricity', value: '' });
    setShowMeterModal(false);
  };

  return (
    <>
      <TenantNavigation />
      <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full text-xs font-semibold backdrop-blur-md">
                Digital Property Pass
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Occupied
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{propertyData.property.name}</h1>
            <p className="text-indigo-200 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {propertyData.property.address} - {propertyData.property.pincode}
            </p>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-center px-4 border-r border-white/10">
              <span className="text-xs text-indigo-200 block">Building</span>
              <span className="text-lg font-bold">{propertyData.property.building}</span>
            </div>
            <div className="text-center px-4">
              <span className="text-xs text-indigo-200 block">Unit No.</span>
              <span className="text-lg font-bold text-amber-400">{propertyData.property.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4 h-4" /> Overview & Specs
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" /> Unit Assets ({propertyData.assets.length})
        </button>
        <button
          onClick={() => setActiveTab('meters')}
          className={`py-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'meters'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" /> Utility Meters
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SPECS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Unit Specs Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Apartment Specifications
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Layout Type</span>
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-500" /> {propertyData.unit.type}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Carpet Area</span>
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-indigo-500" /> {propertyData.unit.area}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Floor Level</span>
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" /> Floor {propertyData.unit.floor}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Bedrooms</span>
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-indigo-500" /> {propertyData.unit.bedrooms} Rooms
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Bathrooms</span>
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Bath className="w-4 h-4 text-indigo-500" /> {propertyData.unit.bathrooms} Baths
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Balcony</span>
                <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-indigo-500" /> {propertyData.unit.balcony} Balconies
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-3 bg-indigo-50/50 rounded-xl">
                <span className="text-slate-600 font-medium">Furnishing Status</span>
                <span className="font-semibold text-indigo-900">{propertyData.unit.furnishingStatus}</span>
              </div>
              <div className="flex justify-between p-3 bg-indigo-50/50 rounded-xl">
                <span className="text-slate-600 font-medium">Entrance Facing</span>
                <span className="font-semibold text-indigo-900">{propertyData.unit.facing}</span>
              </div>
            </div>
          </div>

          {/* Parking & Security Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Car className="w-5 h-5 text-indigo-600" /> Dedicated Parking
            </h2>

            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slot Number</span>
                <span className="px-2.5 py-1 bg-indigo-500/30 text-indigo-300 rounded-md text-xs font-bold">{propertyData.parking.level}</span>
              </div>
              <div className="text-4xl font-extrabold text-amber-400">{propertyData.parking.slot}</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Reserved for {propertyData.parking.type}
              </p>
            </div>

            {/* Property Rules / Pass Notes */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resident Pass</span>
              <div className="flex items-center gap-3">
                <FileCheck className="w-8 h-8 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">Digital Gate Access Active</p>
                  <p className="text-[11px] text-slate-400">Scan QR at main gate for seamless entry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNIT ASSET HEALTH (UNIQUE FEATURE) */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Unit Furnishings & Appliances</h2>
              <p className="text-xs text-slate-400">Track appliance status and report issues directly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {propertyData.assets.map((asset) => (
              <div key={asset.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{asset.assetId}</span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">{asset.name}</h3>
                    <p className="text-xs text-slate-400">Brand: {asset.brand}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    asset.condition === 'Good' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {asset.condition}
                  </span>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between text-slate-600">
                    <span>Installed:</span>
                    <span className="font-semibold text-slate-800">{asset.installedDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Last Serviced:</span>
                    <span className="font-semibold text-slate-800">{asset.lastServiced}</span>
                  </div>
                </div>

                <button 
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1"
                  onClick={() => alert(`Report issue for ${asset.name}`)}
                >
                  <Wrench className="w-3.5 h-3.5 text-orange-500" /> Report Asset Issue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UTILITY METERS & SCANNER (UNIQUE FEATURE) */}
      {activeTab === 'meters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Electricity Meter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Electricity Meter</h3>
                  <p className="text-xs text-slate-400">Sub-meter ID: ELEC-{propertyData.property.unit}</p>
                </div>
              </div>
              <button 
                onClick={() => { setNewReading({ type: 'electricity', value: '' }); setShowMeterModal(true); }}
                className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Update
              </button>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Current Reading</span>
                <span className="text-3xl font-black text-amber-400">{propertyData.meterReading.electricity}</span>
                <span className="text-xs text-slate-400 ml-1">kWh</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Last Logged</span>
                <span className="text-xs font-semibold text-slate-200">{propertyData.meterReading.lastUpdatedElec}</span>
              </div>
            </div>
          </div>

          {/* Water Meter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 rounded-2xl text-sky-600">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Water Sub-Meter</h3>
                  <p className="text-xs text-slate-400">Sub-meter ID: WTR-{propertyData.property.unit}</p>
                </div>
              </div>
              <button 
                onClick={() => { setNewReading({ type: 'water', value: '' }); setShowMeterModal(true); }}
                className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Update
              </button>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Current Reading</span>
                <span className="text-3xl font-black text-sky-400">{propertyData.meterReading.water}</span>
                <span className="text-xs text-slate-400 ml-1">Liters</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Last Logged</span>
                <span className="text-xs font-semibold text-slate-200">{propertyData.meterReading.lastUpdatedWater}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meter Modal */}
      {showMeterModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              Update {newReading.type === 'electricity' ? 'Electricity' : 'Water'} Reading
            </h3>
            <form onSubmit={handleUpdateMeter} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">New Units Counter</label>
                <input
                  type="number"
                  required
                  placeholder="Enter numeric value..."
                  value={newReading.value}
                  onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowMeterModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    
    </>
  );
};

export default MyProperty;