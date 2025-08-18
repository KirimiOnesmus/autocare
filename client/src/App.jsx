import React from "react";
import { Login, Register } from "./pages/auth";
import { Home, BusinessProfile, Bookings } from "./pages/customer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {BusinessDashboard,ManageBookings, ManageServices} from "./pages/business";
import Overview from "./components/layout/Overview";
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
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="services" element={<ManageServices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
