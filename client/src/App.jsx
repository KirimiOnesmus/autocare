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
// import ManageBookings from "./pages/business/ManageBookings";
import "./index.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route
          path="/business/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner", "manager", "super_admin"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          {/* Business dashboard routes here */}
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="management" element={<BusinessManagement />} />
          <Route path="reports" element={<BusinessReports />} />
        </Route>

        {/* Admin dashboard routes here */}
        <Route path="admin" element={<AdminOverview />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/businesses"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <BusinessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <Logs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <Support />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <SystemUsers />
            </ProtectedRoute>
          }
        />

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
