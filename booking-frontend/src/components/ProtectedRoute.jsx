import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // The backend role might be lowercase or uppercase. Let's make it case-insensitive.
  const userRoleLower = user?.role?.toLowerCase();
  const allowedRolesLower = allowedRoles ? allowedRoles.map(r => r.toLowerCase()) : null;

  if (allowedRolesLower && (!userRoleLower || !allowedRolesLower.includes(userRoleLower))) {
    return <Navigate to="/" replace />; // Or to an unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
