import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import logo from "../../images/logo.png";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useSelector((state) => state.auth);

  if (loading)
    return (
      <>
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-indigo-50 shadow-md p-4 px-8 z-10">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </div>
        </header>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-400 text-white">
          <div className="bg-gray-600 backdrop-blur-lg px-10 py-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Verifying your account...
            </h2>
            <p className="text-gray-100 text-center text-sm">
              Please wait while we log you in securely.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </>
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

export const NonPremium = ({ children }) => {
  const isPremium = useSelector((state) => state.auth.isPremium);
  return !isPremium ? children : <Navigate to="/dashboard" />;
};

export default ProtectedRoute;
