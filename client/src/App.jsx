import React from "react";
import { Login, Register } from "./pages/auth";
import { Home, BusinessProfile, Bookings } from "./pages/customer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {BusinessDashboard,ManageBookings, ManageServices,ManageCustomers,ManageStaff,BusinessManagement,BusinessReports} from "./pages/business";
import Overview from "./components/layout/Overview";
import { AdminOverview, Logs, Support, SystemUsers,BusinessPage } from "./pages/Admin";
import { StaffLogin, Assignment } from "./pages/staff";
// import ManageBookings from "./pages/business/ManageBookings";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/business/:id" element={<BusinessProfile />} />
        <Route path="/bookings" element={<Bookings />} />

        <Route path="/business/dashboard" element={<BusinessDashboard />}>
          <Route index element={<Overview />} />
          {/* Business dashboard routes here */}
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="staff" element={<ManageStaff />} />
          <Route path="management" element={<BusinessManagement />} />
          <Route path="reports" element={<BusinessReports />} />
          {/* Admin dashboard routes here */}
          {/* <Route path="admin" element={<AdminOverview />} /> */}
          <Route path="admin" element={<AdminOverview />} />
          <Route path="businesses" element={<BusinessPage />} />
          <Route path="logs" element={<Logs />} />
          <Route path="support" element={<Support />} />
          <Route path="users" element={<SystemUsers />} />
        </Route>
        {/* Staff */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/assignment" element={<Assignment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
