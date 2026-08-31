import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Calendar,
  BarChart3,
  Building2,
  Users,
  FileText,
  Settings,
  Home,
  CreditCard,
  Briefcase,
  Package,
  UserCog,
  Bell,
} from "lucide-react";

const navByRole = {
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/properties", label: "Properties", icon: Building2 },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ],

  manager: [
    { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/manager/properties", label: "Properties", icon: Building2 },
    { to: "/manager/buildings", label: "Buildings", icon: Building2 },
    { to: "/manager/units", label: "Units", icon: Home },
    { to: "/manager/tenants", label: "Tenants", icon: Users },
    { to: "/manager/maintenance", label: "Maintenance", icon: Wrench },
    { to: "/manager/amenities", label: "Amenities", icon: Package },
    { to: "/manager/bookings", label: "Bookings", icon: Calendar },
    { to: "/manager/payments", label: "Payments", icon: CreditCard },
    { to: "/manager/leases", label: "Leases", icon: FileText },
    { to: "/manager/staff", label: "Staff", icon: UserCog },
    { to: "/manager/vendors", label: "Vendors", icon: Briefcase },
    { to: "/manager/reports", label: "Reports", icon: BarChart3 },
  ],

  tenant: [
    { to: "/tenant/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/tenant/property", label: "My Property", icon: Home },
    { to: "/tenant/rent", label: "Rent", icon: CreditCard },
    { to: "/tenant/maintenance", label: "Maintenance", icon: Wrench },
    { to: "/tenant/amenities", label: "Amenities", icon: Package },
    { to: "/tenant/bookings", label: "My Bookings", icon: Calendar },
    { to: "/tenant/lease", label: "Lease", icon: FileText },
    { to: "/tenant/documents", label: "Documents", icon: FileText },
    { to: "/tenant/support", label: "Support", icon: ClipboardList },
  ],

  staff: [
    { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/staff/tasks", label: "My Tasks", icon: ClipboardList },
    { to: "/staff/maintenance", label: "Maintenance", icon: Wrench },
    { to: "/staff/schedule", label: "Schedule", icon: Calendar },
    { to: "/staff/performance", label: "Performance", icon: BarChart3 },
  ],

  vendor: [
    { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vendor/jobs", label: "Jobs", icon: Briefcase },
    { to: "/vendor/job-details", label: "Job Details", icon: ClipboardList },
    { to: "/vendor/schedule", label: "Schedule", icon: Calendar },
    { to: "/vendor/materials", label: "Materials", icon: Package },
    { to: "/vendor/invoices", label: "Invoices", icon: FileText },
    { to: "/vendor/profile", label: "Profile", icon: UserCog },
  ],
};

navByRole.owner = navByRole.tenant;


const Sidebar = ({ role }) => {
  const links = navByRole[role] || [];

  return (
    <aside className="sidebar">
      <nav>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {Icon && <Icon className="w-4 h-4 mr-2 inline-block" />}
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;