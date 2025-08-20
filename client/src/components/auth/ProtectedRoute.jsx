import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  // Otherwise render children
  return children;
};

export default ProtectedRoute;
