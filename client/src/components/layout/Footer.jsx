import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Heart,
  Globe,
  HelpCircle,
  FileCode,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { selectedProperty } = useProperty();
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || 'manager';

  const roleLinks = {
    admin: [
      { label: 'Admin Dashboard', to: '/admin/dashboard' },
      { label: 'Properties Portfolio', to: '/admin/properties' },
      { label: 'Users & Roles', to: '/admin/users' },
      { label: 'Payment Logs', to: '/admin/payments' },
      { label: 'System Reports', to: '/admin/reports' },
      { label: 'Notifications', to: '/admin/notifications' },
      { label: 'Platform Settings', to: '/admin/settings' },
    ],
    manager: [
      { label: 'Manager Dashboard', to: '/manager/dashboard' },
      { label: 'Properties & Selection', to: '/manager/properties' },
      { label: 'Buildings Directory', to: '/manager/buildings' },
      { label: 'Units & Floor Plans', to: '/manager/units' },
      { label: 'Tenants & Leases', to: '/manager/tenants' },
      { label: 'Maintenance Tickets', to: '/manager/maintenance' },
      { label: 'Amenity Bookings', to: '/manager/bookings' },
      { label: 'Payments & Invoices', to: '/manager/payments' },
    ],
    staff: [
      { label: 'Staff Dashboard', to: '/staff/dashboard' },
      { label: 'My Assigned Tasks', to: '/staff/tasks' },
      { label: 'Daily Work Schedule', to: '/staff/schedule' },
      { label: 'Maintenance Orders', to: '/staff/maintenance' },
      { label: 'Performance Metrics', to: '/staff/performance' },
    ],
    vendor: [
      { label: 'Vendor Dashboard', to: '/vendor/dashboard' },
      { label: 'Work Orders & Jobs', to: '/vendor/jobs' },
      { label: 'Service Schedule', to: '/vendor/schedule' },
      { label: 'Parts & Materials', to: '/vendor/materials' },
      { label: 'Invoices & Payouts', to: '/vendor/invoices' },
      { label: 'Vendor Profile', to: '/vendor/profile' },
    ],
    tenant: [
      { label: 'Tenant Dashboard', to: '/tenant/dashboard' },
      { label: 'My Property & Unit', to: '/tenant/property' },
      { label: 'Rent & Payments', to: '/tenant/rent' },
      { label: 'Request Maintenance', to: '/tenant/maintenance' },
      { label: 'Amenities Booking', to: '/tenant/amenities' },
      { label: 'Lease Agreement', to: '/tenant/lease' },
    ],
  };

  const links = roleLinks[role] || roleLinks.manager;

  return (
    <footer className="mt-12 bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top Banner / System Status Ribbon */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend API Server: Online (Port 5000)</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time WebSocket: Connected</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span>MongoDB Cloud: Active</span>
            </div>
          </div>

          {selectedProperty && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full text-xs">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300">Selected Property:</span>
              <span className="font-bold text-white">{selectedProperty.name}</span>
            </div>
          )}

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold bg-blue-600 text-white px-2.5 py-1 rounded-xl text-base shadow-md">
                PM
              </span>
              <span className="font-bold text-white text-lg tracking-tight">
                PropertyOS Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified enterprise cloud for modern residential & commercial real estate management. Built for Managers, Owners, Vendors, Staff, and Tenants.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-semibold uppercase tracking-wider">
                Role: {role}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                v2.6 Enterprise
              </span>
            </div>
          </div>

          {/* Col 2: Role-specific Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{role.toUpperCase()} Workspace</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {links.slice(0, 5).map((lnk) => (
                <li key={lnk.to}>
                  <Link
                    to={lnk.to}
                    className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
                  >
                    <span>{lnk.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More Role Pages & Workflows */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Workflows</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {links.slice(5).length > 0 ? (
                links.slice(5).map((lnk) => (
                  <li key={lnk.to}>
                    <Link
                      to={lnk.to}
                      className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
                    >
                      <span>{lnk.label}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/select-role" className="hover:text-white transition">Switch Role Persona</Link></li>
                  <li><Link to="/manager/properties" className="hover:text-white transition">Choose Active Property</Link></li>
                  <li><Link to="/tenant/dashboard" className="hover:text-white transition">Tenant Resident Portal</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 4: Platform Switcher & Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Portal</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium transition"
              >
                👑 Admin Portal
              </button>
              <button
                onClick={() => navigate('/manager/dashboard')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium transition"
              >
                🏢 Manager
              </button>
              <button
                onClick={() => navigate('/staff/dashboard')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium transition"
              >
                🔧 Staff
              </button>
              <button
                onClick={() => navigate('/vendor/dashboard')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium transition"
              >
                🛠️ Vendor
              </button>
              <button
                onClick={() => navigate('/tenant/dashboard')}
                className="col-span-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left font-medium transition"
              >
                🏠 Tenant Resident Portal
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Property Management Platform. All rights reserved. End-to-End MERN Real Estate Architecture.</p>
          <div className="flex items-center gap-4">
            <Link to="/select-role" className="hover:text-slate-300 transition">Select Role</Link>
            <span>•</span>
            <span className="text-slate-400">Node/Express + React 18 + MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
