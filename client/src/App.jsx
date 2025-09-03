
import React from "react";
import { Login, Register } from "./pages/auth";
import { Home, BusinessProfile, Bookings } from "./pages/customer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  BusinessDashboard,
  ManageBookings,
  ManageServices,
  ManageCustomers,
  ManageStaff,
  BusinessManagement,
  BusinessReports,
} from "./pages/business";
import Overview from "./components/layout/Overview";
import {
  AdminOverview,
  Logs,
  Support,
  SystemUsers,
  BusinessPage,
} from "./pages/Admin";
import { StaffLogin, Assignment } from "./pages/staff";
import "./index.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BusinessProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />

        {/* Business Dashboard */}
        <Route
          path="/business/:businessId/dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager", "owner"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="management" element={<BusinessManagement />} />
          <Route path="reports" element={<BusinessReports />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
               <BusinessDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="businesses" element={<BusinessPage />} />
          <Route path="users" element={<SystemUsers />} />
          <Route path="support" element={<Support />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* Staff */}
        <Route
          path="/staff/assignment"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <Assignment />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
