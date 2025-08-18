import React from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const BusinessDashboard = () => {
  return (
    <div className="min-h-screen ">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />

        <div className="flex-1 h-[calc(100vh-72px)] overflow-y-auto p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
