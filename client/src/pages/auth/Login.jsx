import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import background from "../../assets/background.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../components/config/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Please enter the password");
      return;
    }

    const dataToSend = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      const response = await api.post("/auth/login", dataToSend);
      const { token, user, businesses, isBusinessLogin } = response.data;

      sessionStorage.setItem("token", token);

      console.log("Customer ID:", user.customerId);

      let userToStore = { ...user };
      if (user.role === "owner" && businesses && businesses.length > 0) {
        userToStore.businessId = businesses[0].id;
      }

      sessionStorage.setItem("user", JSON.stringify(userToStore));

      if (businesses && businesses.length > 0) {
        sessionStorage.setItem("businesses", JSON.stringify(businesses));
      }

      toast.success(
        isBusinessLogin
          ? "Business login successfully. Welcome!"
          : "Logging in. Welcome back..."
      );

      if (user.role === "customer") {
        navigate("/home");
      } else if (user.role === "owner") {
        if (businesses && businesses.length > 0) {
          navigate(`/business/${businesses[0].id}/dashboard`);
        } else {
          navigate("/business/dashboard");
        }
      } else if (user.role === "manager") {
     
        let businessId = user.businessId;
        if (!businessId && businesses && businesses.length > 0) {
          businessId = businesses[0].id;
          // console.log("Using business ID from businesses array:", businessId);
        }

        if (businessId) {
          navigate(`/business/${businessId}/dashboard`);
        } else {
          // console.error("Manager has no business ID assigned");
          toast.error(
            "Your account is not associated with any business. Please contact administrator."
          );
        }
      } else if (["admin", "super_admin"].includes(user.role)) {
        navigate("/admin");
      } else if (user.role === "staff") {
        navigate("/staff/assignment");
      } else {
        toast.error("Unauthorized role!");
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Login failed:",
          error.response.status,
          error.response.data
        );
      } else {
        console.error("Login error:", error.message);
      }
      toast.error("Failed to log in..!");
    } finally {
      setLoading(false);
    }
  };
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

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md bg-opacity-90 rounded-xl shadow-lg mr-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Welcome
        </h2>
        <form onSubmit={handleSubmit}>
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
              value={formData.email}
              onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
              disabled={loading}
              className="w-full px-4 py-3 text-white text-md font-bold cursor-pointer bg-blue-500 rounded-lg
               hover:bg-transparent hover:border border-blue-500 hover:text-blue-500 transition duration-200"
            >
              {loading ? "Signing In ..." : "Sign In"}
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
            <a
              onClick={() => {
                navigate("/register");
              }}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
