import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const StaffLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4 shadow-lg rounded-lg">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Staff Login</h1>
        <div>
          <form action="" className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label htmlFor="id">User ID(Employee Id):</label>
              <input
                type="text"
                placeholder="PE001"
                className=" flex-1 p-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:border-0 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-4 mt-4 relative">
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                className=" flex-1 p-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:border-0 focus:ring-blue-500"
              />

              <span
                className="cursor-pointer absolute right-3 top-13 text-gray-500 hover:text-blue-600 text-xl"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer
                hover:bg-white hover:text-blue-600 hover:border border-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
