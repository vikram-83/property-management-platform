import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  FolderCode,
  Building2,
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  Users,
  Wrench,
  Home,
  CheckCircle,
} from 'lucide-react';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';

export const MODULE_FILES = {
  admin: [
    { name: 'Dashboard.jsx', title: 'Admin Dashboard', path: '/admin/dashboard' },
    { name: 'Properties.jsx', title: 'Properties & Choose Property', path: '/admin/properties' },
    { name: 'Users.jsx', title: 'Users & Roles', path: '/admin/users' },
    { name: 'Payment.jsx', title: 'Payments & Transactions', path: '/admin/payments' },
    { name: 'Reports.jsx', title: 'Analytics & Reports', path: '/admin/reports' },
    { name: 'Notification.jsx', title: 'System Notifications', path: '/admin/notifications' },
    { name: 'Setting.jsx', title: 'Platform Settings', path: '/admin/settings' },
  ],
  manager: [
    { name: 'Dashboard.jsx', title: 'Manager Dashboard', path: '/manager/dashboard' },
    { name: 'properties.jsx', title: 'Properties & Choose Property', path: '/manager/properties' },
    { name: 'propertyDetails.jsx', title: 'Property Details View', path: '/manager/properties/PROP001' },
    { name: 'Buildings.jsx', title: 'Buildings Management', path: '/manager/buildings' },
    { name: 'Units.jsx', title: 'Units & Floor Plans', path: '/manager/units' },
    { name: 'Tenants.jsx', title: 'Tenants Directory & Leases', path: '/manager/tenants' },
    { name: 'Maintenance.jsx', title: 'Maintenance Tickets', path: '/manager/maintenance' },
    { name: 'Amenities.jsx', title: 'Amenities Catalog', path: '/manager/amenities' },
    { name: 'Bookings.jsx', title: 'Amenity Bookings', path: '/manager/bookings' },
    { name: 'Payments.jsx', title: 'Rent & Payments', path: '/manager/payments' },
    { name: 'leaseManagement.jsx', title: 'Lease Agreements', path: '/manager/leases' },
    { name: 'Staff.jsx', title: 'Staff Management', path: '/manager/staff' },
    { name: 'Vendors.jsx', title: 'Vendor Management', path: '/manager/vendors' },
    { name: 'Reports.jsx', title: 'Performance Reports', path: '/manager/reports' },
  ],
  staff: [
    { name: 'Dashboard.jsx', title: 'Staff Dashboard', path: '/staff/dashboard' },
    { name: 'myTask.jsx', title: 'My Work Tasks', path: '/staff/tasks' },
    { name: 'taskDetail.jsx', title: 'Task Details & Action', path: '/staff/tasks/MT1001' },
    { name: 'Sudule.jsx', title: 'Daily Schedule', path: '/staff/schedule' },
    { name: 'Maintainence.jsx', title: 'Maintenance Work Order', path: '/staff/maintenance' },
    { name: 'Performance.jsx', title: 'Performance Metrics', path: '/staff/performance' },
    { name: 'Staff.jsx', title: 'Staff Workspace', path: '/staff/staff' },
  ],
  vendor: [
    { name: 'Dashboard.jsx', title: 'Vendor Dashboard', path: '/vendor/dashboard' },
    { name: 'jobs.jsx', title: 'Job Work Orders', path: '/vendor/jobs' },
    { name: 'jobDetails.jsx', title: 'Job Details & Estimate', path: '/vendor/job-details' },
    { name: 'Schedule.jsx', title: 'Work Schedule', path: '/vendor/schedule' },
    { name: 'Materials.jsx', title: 'Materials & Inventory', path: '/vendor/materials' },
    { name: 'Invoices.jsx', title: 'Invoices & Billing', path: '/vendor/invoices' },
    { name: 'vender.jsx', title: 'Vendor Profile', path: '/vendor/profile' },
  ],
  tenant: [
    { name: 'Dashboard.jsx', title: 'Tenant Dashboard', path: '/tenant/dashboard' },
    { name: 'MyProperty.jsx', title: 'My Property', path: '/tenant/property' },
    { name: 'Rent.jsx', title: 'Rent & Payments', path: '/tenant/rent' },
    { name: 'CreateMaintainance.jsx', title: 'Maintenance Request', path: '/tenant/maintenance' },
    { name: 'Amenities.jsx', title: 'Amenities', path: '/tenant/amenities' },
    { name: 'lease.jsx', title: 'Lease Agreement', path: '/tenant/lease' },
    { name: 'PaymentHistory.jsx', title: 'Payment History', path: '/tenant/payments' },
    { name: 'Documents.jsx', title: 'Documents', path: '/tenant/documents' },
    { name: 'Community.jsx', title: 'Community', path: '/tenant/community' },
    { name: 'Support.jsx', title: 'Support & Tickets', path: '/tenant/support' },
    { name: 'Profile.jsx', title: 'Profile', path: '/tenant/profile' },
  ],
};

export default function PageDropdownNav({ role, currentFileName, customTitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProperty, properties, selectProperty } = useProperty();
  const { user } = useAuth();

  // Determine current role from props or URL
  const detectedRole =
    role ||
    (location.pathname.startsWith('/admin')
      ? 'admin'
      : location.pathname.startsWith('/manager')
      ? 'manager'
      : location.pathname.startsWith('/staff')
      ? 'staff'
      : location.pathname.startsWith('/vendor')
      ? 'vendor'
      : location.pathname.startsWith('/tenant')
      ? 'tenant'
      : user?.role?.toLowerCase() || 'manager');

  const files = MODULE_FILES[detectedRole] || MODULE_FILES.manager;

  // Find active index
  let currentIndex = files.findIndex((f) => {
    if (currentFileName && f.name.toLowerCase() === currentFileName.toLowerCase()) return true;
    if (location.pathname === f.path) return true;
    if (location.pathname.startsWith(f.path) && f.path !== `/${detectedRole}`) return true;
    return false;
  });

  if (currentIndex === -1) currentIndex = 0;
  const activeFile = files[currentIndex] || files[0];

  const handleDropdownChange = (e) => {
    const targetPath = e.target.value;
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + files.length) % files.length;
    navigate(files[prevIndex].path);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % files.length;
    navigate(files[nextIndex].path);
  };

  const handleRoleSwitch = (e) => {
    const newRole = e.target.value;
    const targetHome = MODULE_FILES[newRole]?.[0]?.path || `/${newRole}/dashboard`;
    navigate(targetHome);
  };

  return (
    <aside aria-label="Page navigation and context bar" className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/40 text-white shadow-md mb-6 rounded-xl overflow-hidden">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Left: Component File View & Quick Dropdown */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-indigo-600/30 border border-indigo-500/40 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-200">
              <FolderCode className="w-4 h-4 text-indigo-400" />
              <span>src/pages/{detectedRole}/</span>
            </div>

            {/* Dropdown Menu Selector */}
            <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
              <label htmlFor={`file-switcher-select-${detectedRole}`} className="sr-only">Choose Component File</label>
              <select
                id={`file-switcher-select-${detectedRole}`}
                aria-label="Choose Component File"
                value={activeFile?.path || location.pathname}
                onChange={handleDropdownChange}
                className="w-full bg-slate-800/90 text-white font-medium text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-indigo-400/50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner transition-all appearance-none pr-8"
              >
                {files.map((file) => (
                  <option key={file.path} value={file.path} className="bg-slate-900 text-white py-1">
                    📄 {file.name} — {file.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-indigo-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Step Prev / Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                title={`Previous: ${files[(currentIndex - 1 + files.length) % files.length]?.name}`}
                className="px-2.5 py-2 bg-slate-800 hover:bg-indigo-600/50 border border-slate-700 hover:border-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={handleNext}
                title={`Next: ${files[(currentIndex + 1) % files.length]?.name}`}
                className="px-2.5 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-lg text-xs font-semibold flex items-center gap-1 text-white shadow transition-all hover:scale-105 active:scale-95"
              >
                <span className="hidden sm:inline">Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Active Property Indicator & Role Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Active Property Context Pill */}
            {selectedProperty && (
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-xs">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-medium">Active Property:</span>
                <span className="font-bold text-white max-w-[140px] truncate" title={selectedProperty.name}>
                  {selectedProperty.name}
                </span>
                <label htmlFor="quick-property-select" className="sr-only">Switch Property</label>
                <select
                  id="quick-property-select"
                  aria-label="Switch Property"
                  value={selectedProperty.id || selectedProperty._id || ''}
                  onChange={(e) => {
                    const p = properties.find((item) => item.id === e.target.value || item._id === e.target.value);
                    if (p) selectProperty(p);
                  }}
                  className="bg-emerald-900/90 text-emerald-100 text-[11px] font-semibold rounded px-1.5 py-0.5 border border-emerald-400/40 focus:outline-none cursor-pointer"
                >
                  {properties.map((prop) => (
                    <option key={prop.id || prop._id} value={prop.id || prop._id}>
                      {prop.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-lg text-xs">
              <span className="text-slate-400 font-medium">Role:</span>
              <label htmlFor="role-select" className="sr-only">Select Role</label>
              <select
                id="role-select"
                aria-label="Select Role"
                value={detectedRole}
                onChange={handleRoleSwitch}
                className="bg-transparent text-indigo-300 font-bold capitalize focus:outline-none cursor-pointer"
              >
                <option value="admin" className="bg-slate-900 text-white">👑 Admin</option>
                <option value="manager" className="bg-slate-900 text-white">🏢 Manager</option>
                <option value="staff" className="bg-slate-900 text-white">🔧 Staff</option>
                <option value="vendor" className="bg-slate-900 text-white">🛠️ Vendor</option>
                <option value="tenant" className="bg-slate-900 text-white">🏠 Tenant</option>
              </select>
            </div>
          </div>

        </div>

        {/* Bottom Quick Chips / Breadcrumb Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300 scrollbar-thin">
          <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">Quick Pages:</span>
          {files.map((file, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={file.path}
                onClick={() => navigate(file.path)}
                className={`px-2.5 py-1 rounded-md shrink-0 transition-all font-medium flex items-center gap-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-bold ring-1 ring-indigo-400'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{file.name}</span>
                {isActive && <CheckCircle className="w-3 h-3 text-emerald-300 inline" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
