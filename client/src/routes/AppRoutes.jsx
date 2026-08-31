import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Auth
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import RoleSelection from "../components/pages/auth/RoleSelection";
import ForgatPassword from "../components/pages/auth/ForgatPassword";
import ResetPassword from "../components/pages/auth/ResetPassword";

// Route protection
import RoleRoute from "./RoleRoute";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import DashboardLayout from "../components/layout/DashboardLayout";

// Admin
import AdminDashboard from "../components/pages/admin/Dashboard";
import Users from "../components/pages/admin/Users";
import Notifications from "../components/pages/admin/Notification";
import Settings from "../components/pages/admin/Setting";
import AdminProperties from "../components/pages/admin/Properties";
import AdminPayments from "../components/pages/admin/Payment";
import AdminReports from "../components/pages/admin/Reports";

// Manager
import ManagerDashboard from "../components/pages/manager/Dashboard";
import ManagerProperties from "../components/pages/manager/properties";
import PropertyDetails from "../components/pages/manager/propertyDetails";
import Buildings from "../components/pages/manager/Buildings";
import Units from "../components/pages/manager/Units";
import Tenants from "../components/pages/manager/Tenants";
import Maintenance from "../components/pages/manager/Maintenance";
import Payments from "../components/pages/manager/Payments";
import Reports from "../components/pages/manager/Reports";
import Amenities from "../components/pages/manager/Amenities";
import Bookings from "../components/pages/manager/Bookings";
import LeaseManagement from "../components/pages/manager/leaseManagement";
import ManagerVendors from "../components/pages/manager/Vendors";
import ManagerStaff from "../components/pages/staff/Staff";

// Other roles
import TenantDashboard from "../components/pages/tenant/Dashboard";
import MyProperty from "../components/pages/tenant/MyProperty";
import Rent from "../components/pages/tenant/Rent";
import TenantAmenities from "../components/pages/tenant/Amenities";
import Lease from "../components/pages/tenant/lease";
import PaymentHistory from "../components/pages/tenant/PaymentHistory";
import CreateMaintenance from "../components/pages/tenant/CreateMaintainance";
import Documents from "../components/pages/tenant/Documents";
import Community from "../components/pages/tenant/Community";
import Inspection from "../components/pages/tenant/Inpection";
import MoveOut from "../components/pages/tenant/MoveOut";
import Profile from "../components/pages/tenant/Profile";
import Support from "../components/pages/tenant/Support";
import Utilities from "../components/pages/tenant/Utilities";
import Notification from "../components/pages/tenant/Notification";
import StaffDashboard from "../components/pages/staff/Dashboard";
import MyTasks from "../components/pages/staff/myTask";
import TaskDetails from "../components/pages/staff/taskDetail";
import StaffSchedule from "../components/pages/staff/Sudule";
import StaffMaintenance from "../components/pages/staff/Maintainence";
import StaffPerformance from "../components/pages/staff/Performance";
import VendorDashboard from "../components/pages/vendor/Dashboard";
import VendorJobs from "../components/pages/vendor/jobs";
import VendorJobDetails from "../components/pages/vendor/jobDetails";
import VendorSchedule from "../components/pages/vendor/Schedule";
import VendorMaterials from "../components/pages/vendor/Materials";
import VendorInvoices from "../components/pages/vendor/Invoices";
import VendorProfile from "../components/pages/vendor/vender";





// ======================================================
// Role Home
// ======================================================

const roleHome = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  tenant: "/tenant/dashboard",
  staff: "/staff/dashboard",
  vendor: "/vendor/dashboard",
  owner: "/tenant/dashboard",
};


// ======================================================
// Dashboard Layout Wrapper
// ======================================================

const withDashboard = (element) => (
  <DashboardLayout>
    {element}
  </DashboardLayout>
);

// Admin can also access manager pages (full oversight)
const withManagerDashboard = (element) => (
  <RoleRoute allowedRoles={["manager", "admin"]}>
    {withDashboard(element)}
  </RoleRoute>
);

const withTenantDashboard = (element) => (
  <RoleRoute allowedRoles={["tenant", "owner"]}>
    {withDashboard(element)}
  </RoleRoute>
);


// ======================================================
// Root Redirect
// ======================================================

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/select-role" replace />;
  }

  return (
    <Navigate
      to={roleHome[user.role] || "/login"}
      replace
    />
  );
};


// ======================================================
// Unauthorized
// ======================================================

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900">
        403 — Not authorized
      </h2>

      <p className="text-slate-600 mt-2">
        You don't have permission to view this page.
      </p>
    </div>
  </div>
);


// ======================================================
// Not Found
// ======================================================

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-900">
        404 — Page not found
      </h2>

      <p className="text-slate-600 mt-2">
        The requested page does not exist.
      </p>
    </div>
  </div>
);


// ======================================================
// APP ROUTES
// ======================================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ==================================================
          BASIC / AUTH ROUTES
      ================================================== */}

      <Route
        path="/"
        element={<RootRedirect />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/select-role"
        element={<RoleSelection />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgatPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* ==================================================
          ADMIN ROUTES
      ================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<AdminDashboard />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<Users />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<Notifications />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<Settings />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/properties"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<AdminProperties />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/payments"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<AdminPayments />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<AdminReports />)}
          </RoleRoute>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            {withDashboard(<Notifications />)}
          </RoleRoute>
        }
      />


        {/* ==================================================
          MANAGER ROUTES
        ================================================== */}

      <Route
        path="/manager/dashboard"
        element={
          withManagerDashboard(<ManagerDashboard />)
        }
      />

      <Route
        path="/manager/properties"
        element={
          withManagerDashboard(<ManagerProperties />)
        }
      />

      <Route
        path="/manager/properties/:id"
        element={
          withManagerDashboard(<PropertyDetails />)
        }
      />

      <Route
        path="/manager/buildings"
        element={
          withManagerDashboard(<Buildings />)
        }
      />

      <Route
        path="/manager/units"
        element={
          withManagerDashboard(<Units />)
        }
      />

      <Route
        path="/manager/tenants"
        element={
          withManagerDashboard(<Tenants />)
        }
      />

      <Route
        path="/manager/maintenance"
        element={
          withManagerDashboard(<Maintenance />)
        }
      />

      <Route
        path="/manager/payments"
        element={
          withManagerDashboard(<Payments />)
        }
      />

      <Route
        path="/manager/reports"
        element={
          withManagerDashboard(<Reports />)
        }
      />

      <Route
        path="/manager/amenities"
        element={
          withManagerDashboard(<Amenities />)
        }
      />

      <Route
        path="/manager/bookings"
        element={
          withManagerDashboard(<Bookings />)
        }
      />

      <Route
        path="/manager/leases"
        element={
          withManagerDashboard(<LeaseManagement />)
        }
      />

      <Route
        path="/manager/vendors"
        element={
          withManagerDashboard(<ManagerVendors />)
        }
      />

      <Route
        path="/manager/staff"
        element={
          withManagerDashboard(<ManagerStaff />)
        }
      />


      {/* ==================================================
          TENANT
      ================================================== */}

      <Route
        path="/tenant/dashboard"
        element={
          withTenantDashboard(<TenantDashboard />)
        }
      />

      <Route path="/tenant/property" element={withTenantDashboard(<MyProperty />)} />
      <Route path="/tenant/rent" element={withTenantDashboard(<Rent />)} />
      <Route path="/tenant/maintenance" element={withTenantDashboard(<CreateMaintenance />)} />
      <Route path="/tenant/maintenance/create" element={withTenantDashboard(<CreateMaintenance />)} />
      <Route path="/tenant/amenities" element={withTenantDashboard(<TenantAmenities />)} />
      <Route path="/tenant/bookings" element={withTenantDashboard(<TenantAmenities />)} />
      <Route path="/tenant/lease" element={withTenantDashboard(<Lease />)} />
      <Route path="/tenant/payments" element={withTenantDashboard(<PaymentHistory />)} />
      <Route path="/tenant/documents" element={withTenantDashboard(<Documents />)} />
      <Route path="/tenant/community" element={withTenantDashboard(<Community />)} />
      <Route path="/tenant/inspection" element={withTenantDashboard(<Inspection />)} />
      <Route path="/tenant/move-out" element={withTenantDashboard(<MoveOut />)} />
      <Route path="/tenant/profile" element={withTenantDashboard(<Profile />)} />
      <Route path="/tenant/support" element={withTenantDashboard(<Support />)} />
      <Route path="/tenant/utilities" element={withTenantDashboard(<Utilities />)} />
      <Route path="/tenant/notifications" element={withTenantDashboard(<Notification />)} />


      {/* ==================================================
          STAFF
      ================================================== */}

      <Route
        path="/staff/dashboard"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            {withDashboard(<StaffDashboard />)}
          </RoleRoute>
        }
      />

      <Route
        path="/staff/tasks"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            {withDashboard(<MyTasks />)}
          </RoleRoute>
        }
      />

      <Route
        path="/staff/tasks/:id"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            {withDashboard(<TaskDetails />)}
          </RoleRoute>
        }
      />

      <Route
        path="/staff/schedule"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            {withDashboard(<StaffSchedule />)}
          </RoleRoute>
        }
      />

      <Route
        path="/staff/maintenance"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            {withDashboard(<StaffMaintenance />)}
          </RoleRoute>
        }
      />

      <Route
        path="/staff/performance"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            {withDashboard(<StaffPerformance />)}
          </RoleRoute>
        }
      />

      <Route
        path="/staff/staff"
        element={
          <RoleRoute allowedRoles={["staff", "manager", "admin"]}>
            {withDashboard(<ManagerStaff />)}
          </RoleRoute>
        }
      />


      {/* ==================================================
          VENDOR
      ================================================== */}

      <Route
        path="/vendor/dashboard"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorDashboard />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/jobs"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorJobs />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/jobs/:id"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorJobDetails />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/job-details"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorJobDetails />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/schedule"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorSchedule />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/materials"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorMaterials />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/invoices"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorInvoices />)}
          </RoleRoute>
        }
      />

      <Route
        path="/vendor/profile"
        element={
          <RoleRoute allowedRoles={["vendor"]}>
            {withDashboard(<VendorProfile />)}
          </RoleRoute>
        }
      />


      {/* ==================================================
          404
      ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;