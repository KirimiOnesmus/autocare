import React from "react";
import { FaSearchLocation } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import avatar from "../../assets/avatar.jpg";
import { IoSparkles } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role || "";
  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white/30 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 text-xl font-bold text-blue-500">
        <FaSearchLocation />
        <span>AutoCare</span>
      </div>
      <div className="flex items-center gap-4">
        {role === "customer" ? (
          <>
            <button
              onClick={() => {
                navigate(`/bookings`);
              }}
              className="text-white bg-blue-500 p-2 rounded-lg cursor-pointer 
              hover:text-blue-500 hover:bg-white hover:border border-blue-500"
            >
              My Bookings
            </button>

            <button className="relative text-2xl text-gray-700 hover:text-blue-600 transition">
              <IoIosNotifications />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            <button className="hover:scale-105 hover:cursor-pointer transition">
              <img
                src={avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </button>
          </>
        ) : (
          <>
            <button className="relative text-2xl text-gray-700 hover:text-blue-600 transition">
              <IoIosNotifications />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            <button className="hover:scale-105 hover:cursor-pointer transition">
              <img
                src={avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
