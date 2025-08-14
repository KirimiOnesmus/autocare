import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import background from "../../assets/background.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="relative flex items-center justify-end min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="absolute inset-0 bg-black opacity-60"></div>

     
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xs bg-opacity-90 rounded-xl shadow-lg mr-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Welcome</h2>
        <form>
         
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-md font-medium text-white mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 text-white border  border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-md font-medium text-white mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="w-full text-white px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white  transition duration-200"
                disabled={loading}
              >
                {showPassword ? (
                  <FaRegEyeSlash className="w-5 h-5 hover:cursor-pointer" />
                ) : (
                  <FaRegEye className="w-5 h-5 hover:cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          
          <div className="mb-4">
            <button
              type="submit"
              className="w-full px-4 py-3 text-white text-md font-bold cursor-pointer bg-blue-500 rounded-lg
               hover:bg-transparent hover:border border-blue-500 hover:text-blue-500 transition duration-200"
            >
              Sign In
            </button>
          </div>

          
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <FcGoogle /> Sign In with Google
            </button>
          </div>

         
          <p className="text-center text-sm">
            Not yet registered?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;