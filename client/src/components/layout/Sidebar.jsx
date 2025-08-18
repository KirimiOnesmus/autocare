import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { AiFillDashboard, AiOutlineLogout } from "react-icons/ai";
import { BsCalendar2Date } from "react-icons/bs";
import {
  MdMiscellaneousServices,
  MdPeople,
  MdOutlineEngineering,
  MdBusinessCenter,
} from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { RiFolderSettingsFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { LuLogs } from "react-icons/lu";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [
    {
      name: "Overview",
      icons: <AiFillDashboard />,
      path: "/business/dashboard",
    },
    //Business Dashboard Tabs
    {
      name: "Bookings",
      icons: <BsCalendar2Date />,
      path: "/business/dashboard/bookings",
    },
    {
      name: "Services",
      icons: <MdMiscellaneousServices />,
      path: "/business/dashboard/services",
    },
    {
      name: "Customers",
      icons: <MdPeople />,
      path: "/business/dashboard/customers",
    },
    {
      name: "Staff",
      icons: <MdOutlineEngineering />,
      path: "/business/dashboard/staff",
    },
    {
      name: "Reports",
      icons: <BiSolidReport />,
      path: "/business/dashboard/reports",
    },
    {
      name: "Business Settings",
      icons: <RiFolderSettingsFill />,
      path: "/business/dashboard/management",
    },
    //Supper Admin Tabs
    {
      name: "Businesses",
      icons: <MdBusinessCenter />,
      path: "/business/dashboard/businesses",
    },
    { name: "Users", icons: <FaUsers />, path: "/business/dashboard/users" },
    {
      name: "Support",
      icons: <BiSupport />,
      path: "/business/dashboard/support",
    },
    { name: "Logs", icons: <LuLogs />, path: "/business/dashboard/logs" },
    { name: "Logout", icons: <AiOutlineLogout />, path: "/logout" },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="hidden md:block w-16 md:w-64 bg-gray-50 py-2 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <ul className="space-y-2">
            {tabs.map((tab, index) => {
              const isActive =
                tab.path === "/business/dashboard"
                  ? location.pathname === tab.path
                  : location.pathname.startsWith(tab.path);
              return (
                <li
                  key={index}
                  onClick={() => navigate(tab.path)}
                  className={`py-2 px-4 rounded cursor-pointer flex justify-center md:justify-start ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-2 text-lg">
                    {tab.icons}
                    <span className="hidden md:inline">{tab.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Small Screens */}

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-50 shadow-inner">
          <ul className="flex justify-around py-2">
            {tabs.map((tab, index) => {
              const isActive = location.pathname === tab.path;
              return (
                <li
                  key={index}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center cursor-pointer p-2 rounded text-xl ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {tab.icons}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
