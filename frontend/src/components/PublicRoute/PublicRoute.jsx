import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, role } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    if (role === "student") {
      return <Navigate to="/dashboard" replace />;
    } else if (role === "hr") {
      return <Navigate to="/hr/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
