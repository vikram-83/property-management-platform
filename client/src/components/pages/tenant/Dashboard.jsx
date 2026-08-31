import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { 
  CreditCard, 
  Wrench, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  Phone,
  Download,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TenantDashboard = () => {
  const navigate = useNavigate();

  // Initial State matching requirements & Property Health Monitor
  const [dashboardData, setDashboardData] = useState({
    welcome: "Good Morning, Rahul 👋",
    quickStats: {
      rentDue: { amount: 16500, dueDate: "2026-09-05", status: "due" },
      maintenance: { open: 2, inProgress: 1, completed: 12 },
      bookings: { upcoming: 2 },
      lease: { daysRemaining: 127 }
    },
    smartAlerts: [
      { id: 1, type: "rent", message: "Rent payment is due in 3 days", priority: "medium" },
      { id: 2, type: "maintenance", message: "Electricity repair technician will arrive at 4 PM", priority: "high" }
    ],
    propertyHealth: {
      water: { status: "normal", lastUpdated: "10 minutes ago" },
      electricity: { status: "normal", lastUpdated: "5 minutes ago" },
      internet: { status: "maintenance", estimatedResolution: "6 PM" },
      security: { status: "normal", lastUpdated: "Just now" }
    },
    recentActivity: [
      { id: 1, text: "Rent payment completed for July", date: "2026-07-31" },
      { id: 2, text: "Maintenance request #TK-402 assigned to Electrician", date: "2026-08-25" },
      { id: 3, text: "Gym booking confirmed for tomorrow, 7:00 AM", date: "2026-08-27" }
    ]
  });

  const tenantPages = [
    { label: 'My Property', path: '/tenant/property' },
    { label: 'Rent & Payments', path: '/tenant/rent' },
    { label: 'Maintenance', path: '/tenant/maintenance' },
    { label: 'Amenities & Bookings', path: '/tenant/amenities' },
    { label: 'Lease', path: '/tenant/lease' },
    { label: 'Documents', path: '/tenant/documents' },
    { label: 'Community', path: '/tenant/community' },
    { label: 'Utilities', path: '/tenant/utilities' },
    { label: 'Support', path: '/tenant/support' },
    { label: 'Profile', path: '/tenant/profile' },
  ];

  const handleQuickAction = (action) => {
    switch(action) {
      case 'Pay Rent': navigate('/tenant/rent'); break;
      case 'Report Problem': navigate('/tenant/maintenance/create'); break;
      case 'Book Amenity': navigate('/tenant/amenities'); break;
      case 'View Lease': navigate('/tenant/lease'); break;
      case 'Download Receipt': navigate('/tenant/payments'); break;
      default: break;
    }
  };

  return (
    <>
      <TenantNavigation />
      <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{dashboardData.welcome}</h1>
          <p className="text-slate-500 text-sm mt-1">Here is what is happening with your unit today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <label className="relative flex items-center">
            <span className="sr-only">Open tenant page</span>
            <select
              defaultValue=""
              onChange={(event) => event.target.value && navigate(event.target.value)}
              className="appearance-none cursor-pointer rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="" disabled>Open tenant page</option>
              {tenantPages.map((page) => (
                <option key={page.path} value={page.path}>{page.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" />
          </label>
          <button 
            onClick={() => handleQuickAction('Pay Rent')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition shadow-sm flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Pay Rent ₹{dashboardData.quickStats.rentDue.amount}
          </button>
        </div>
      </div>

      {/* Smart Alerts Section */}
      {dashboardData.smartAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Smart Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.smartAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  alert.priority === 'high' 
                    ? 'bg-amber-50 border-amber-200 text-amber-900' 
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                {alert.priority === 'high' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-sm font-medium">{alert.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Rent Status</span>
            <CreditCard className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">₹{dashboardData.quickStats.rentDue.amount.toLocaleString()}</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Due Date: {dashboardData.quickStats.rentDue.dueDate}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Maintenance</span>
            <Wrench className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {dashboardData.quickStats.maintenance.open + dashboardData.quickStats.maintenance.inProgress} Active
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {dashboardData.quickStats.maintenance.completed} Resolved Total
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Amenity Bookings</span>
            <Calendar className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{dashboardData.quickStats.bookings.upcoming}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Upcoming events</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Lease Status</span>
            <Clock className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{dashboardData.quickStats.lease.daysRemaining} Days</div>
          <p className="text-xs text-slate-400 mt-1">Remaining on contract</p>
        </div>
      </div>

      {/* Main Content Grid: Property Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ⭐ Unique: Property Health Monitor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">Property Health Monitor</h2>
            </div>
            <span className="text-xs text-slate-400">Live Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Water */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Water Supply</p>
                <p className="text-xs text-slate-400 mt-0.5">Updated: {dashboardData.propertyHealth.water.lastUpdated}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Normal
              </span>
            </div>

            {/* Electricity */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Electricity Grid</p>
                <p className="text-xs text-slate-400 mt-0.5">Updated: {dashboardData.propertyHealth.electricity.lastUpdated}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Normal
              </span>
            </div>

            {/* Internet */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Internet & Wi-Fi</p>
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  Est. Resolution: {dashboardData.propertyHealth.internet.estimatedResolution}
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Maintenance
              </span>
            </div>

            {/* Security */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Building Security</p>
                <p className="text-xs text-slate-400 mt-0.5">Updated: {dashboardData.propertyHealth.security.lastUpdated}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Normal
              </span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleQuickAction('Pay Rent')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 transition">
              <CreditCard className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-xs font-semibold text-slate-700 block">Pay Rent</span>
            </button>
            <button onClick={() => handleQuickAction('Report Problem')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 transition">
              <PlusCircle className="w-5 h-5 text-orange-600 mb-1" />
              <span className="text-xs font-semibold text-slate-700 block">Report Problem</span>
            </button>
            <button onClick={() => handleQuickAction('Book Amenity')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 transition">
              <Calendar className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-xs font-semibold text-slate-700 block">Book Amenity</span>
            </button>
            <button onClick={() => handleQuickAction('View Lease')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 transition">
              <FileText className="w-5 h-5 text-sky-600 mb-1" />
              <span className="text-xs font-semibold text-slate-700 block">View Lease</span>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {dashboardData.recentActivity.map(act => (
            <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <span className="text-slate-700 font-medium">{act.text}</span>
              </div>
              <span className="text-xs text-slate-400">{act.date}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default TenantDashboard;