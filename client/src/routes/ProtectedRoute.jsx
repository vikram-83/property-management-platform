import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Checks JWT token and authentication status.
 * Handles loading state, unauthenticated redirects, and preserves target URL.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, token, loading } = useAuth();

  // 1. Loading state while checking token/session status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated check: Redirect to /login & preserve requested URL in state
  if (!isAuthenticated || !token) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname + location.search }} 
        replace 
      />
    );
  }

  // 3. Authenticated check: Allow access to requested page
  return children;
};

export default ProtectedRoute;