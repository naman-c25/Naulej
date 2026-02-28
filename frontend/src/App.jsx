import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "./redux/verifyToken.js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { NonPremium } from "./components/ProtectedRoute/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute/PublicRoute.jsx";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import RedirectHandler from "./components/Redirect/RedirectHandler";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import AtsPage from "./components/AtsPage/AtsPage";
import JobPortal from "./components/JobPortal/JobPortal";
import BuyPremium from "./components/BuyPremium/BuyPremium";
import PageNotFound from "./components/PageNotFound/PageNotFound";

import PostJob from "./components/HR/PostJob.jsx"
import HrDashboard from "./components/HR/Dashboard.jsx"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/hr/post-job",
      element: (
        <ProtectedRoute allowedRoles="hr">
          <PostJob />
        </ProtectedRoute>
      ),
    },
    {
      path: "/hr/dashboard",
      element: (
        <ProtectedRoute allowedRoles="hr">
          <HrDashboard />
        </ProtectedRoute>
      ),
    },
    { path: "/auth/redirect", element: <RedirectHandler /> },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute allowedRoles="student">
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute allowedRoles="student">
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/ats-checker",
      element: (
        <ProtectedRoute allowedRoles="student">
          <AtsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/job-portal",
      element: (
        <ProtectedRoute allowedRoles="student">
          <JobPortal />
        </ProtectedRoute>
      ),
    },
    {
      path: "/buy-premium",
      element: (
        <ProtectedRoute allowedRoles="student">
          <NonPremium>
            <BuyPremium />
          </NonPremium>
        </ProtectedRoute>
      ),
    },

    { path: "*", element: <PageNotFound /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

