import { useAuth } from "../../context/AuthContext";
import { useProperty } from "../../context/PropertyContext";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ChevronDown, Shield, User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { selectedProperty, properties, selectProperty } = useProperty();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    const found = properties.find((p) => p.id === propId || p._id === propId);
    if (found) {
      selectProperty(found);
    }
  };

  return (
    <header className="navbar flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200 shadow-sm gap-3">
      <div className="navbar-brand flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="navbar-mark font-bold bg-blue-600 group-hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition-colors shadow-sm">
            PM
          </span>
          <span className="navbar-title font-bold text-gray-800 text-base sm:text-lg tracking-tight hidden sm:inline">
            Property Management Platform
          </span>
        </Link>

        {/* Global Active Property Selector */}
        {selectedProperty && (
          <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-200/80 px-2.5 py-1 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-900 font-semibold hidden md:inline">Active:</span>
            <select
              aria-label="Active Property Selection"
              value={selectedProperty.id || selectedProperty._id || ""}
              onChange={handlePropertyChange}
              className="bg-transparent font-bold text-blue-800 focus:outline-none cursor-pointer text-xs max-w-[150px] sm:max-w-[200px] truncate"
            >
              {properties.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="navbar-user flex items-center gap-3 sm:gap-4">
        {/* Real-time Notification Dropdown */}
        <NotificationDropdown />

        {/* User Info / Role */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-800 leading-tight">
              {user?.name || "Demo User"}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
              {user?.role || "Manager"}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;