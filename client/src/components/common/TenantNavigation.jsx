import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  DollarSign,
  Wrench,
  Calendar,
  FileText,
  Users,
  ScrollText,
  Package,
  Zap,
  HelpCircle,
  User,
  Bell,
  ChevronRight,
} from 'lucide-react';

const TenantNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tenantPages = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/tenant/dashboard' },
    { label: 'My Property', icon: Home, path: '/tenant/property' },
    { label: 'Rent & Payments', icon: DollarSign, path: '/tenant/rent' },
    { label: 'Maintenance', icon: Wrench, path: '/tenant/maintenance' },
    { label: 'Amenities', icon: Calendar, path: '/tenant/amenities' },
    { label: 'Lease', icon: ScrollText, path: '/tenant/lease' },
    { label: 'Payment History', icon: FileText, path: '/tenant/payments' },
    { label: 'Documents', icon: FileText, path: '/tenant/documents' },
    { label: 'Community', icon: Users, path: '/tenant/community' },
    { label: 'Inspection', icon: Package, path: '/tenant/inspection' },
    { label: 'Move Out', icon: Package, path: '/tenant/move-out' },
    { label: 'Utilities', icon: Zap, path: '/tenant/utilities' },
    { label: 'Support', icon: HelpCircle, path: '/tenant/support' },
    { label: 'Notifications', icon: Bell, path: '/tenant/notifications' },
    { label: 'Profile', icon: User, path: '/tenant/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-3 flex-1">
            {tenantPages.map((page) => {
              const Icon = page.icon;
              const active = isActive(page.path);
              return (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 
                    whitespace-nowrap transition-all duration-200
                    ${
                      active
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden py-3">
          <select
            value={location.pathname}
            onChange={(e) => navigate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a page...</option>
            {tenantPages.map((page) => (
              <option key={page.path} value={page.path}>
                {page.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TenantNavigation;
