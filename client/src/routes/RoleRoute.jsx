import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * RoleRoute Component
 * Enforces Role-Based Access Control (RBAC).
 * Verifies if the authenticated user's role matches the allowed permissions for the requested route.
 *
 * Supported Roles: ADMIN | MANAGER | STAFF | TENANT | VENDOR
 */
const RoleRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Loading State Check
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Check (Fallback safety)
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // 3. Normalize roles to uppercase to prevent case-mismatch issues
  const userRole = user?.role?.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

  // 4. Permission Check
  const hasPermission = normalizedAllowedRoles.includes(userRole);

  if (!hasPermission) {
    // ❌ Access Denied -> Redirect to unauthorized page with context
    return (
      <Navigate
        to="/unauthorized"
        state={{
          attemptedUrl: location.pathname,
          userRole: userRole,
          requiredRoles: normalizedAllowedRoles,
        }}
        replace
      />
    );
  }

  // ✅ Access Granted -> Render authorized component
  return children;
};

export default RoleRoute;