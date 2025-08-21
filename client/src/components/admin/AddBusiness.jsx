import React, { useState, useEffect } from "react";
import api from "../config/api";
import { toast } from "react-toastify";

const AddBusiness = ({ isOpen, onClose, onSave, business }) => {
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [business_type, setBusiness_type] = useState("");
  const [city, setCity] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Owner");


  useEffect(() => {
    if (business) {
      setBusinessName(business.business_name || "");
      setBusinessEmail(business.email || "");
      setBusinessPhone(business.phone || "");
      setBusiness_type(business.business_type || "");
      setCity(business.city || "");
      setOwnerName(business.owner_name || "");
      setOwnerEmail(business.owner_email || "");
      setOwnerPhone(business.owner_phone || "");
      setRole(business.user_role || "Owner");
      setPassword("");
    } else {
  
      setBusinessName("");
      setBusinessEmail("");
      setBusinessPhone("");
      setBusiness_type("");
      setCity("");
      setOwnerName("");
      setOwnerEmail("");
      setOwnerPhone("");
      setRole("Owner");
      setPassword("");
    }
  }, [business, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBusiness = {
      business_name: businessName,
      email: businessEmail,
      phone: businessPhone,
      business_type,
      city,
      owner_name: ownerName,
      owner_email: ownerEmail,
      owner_phone: ownerPhone,
      password,
      user_role: role,
    };

    if (!businessName || !businessEmail || !businessPhone || !city) {
      toast.error("Please enter all required business details!");
      return;
    }
    if (!business_type) {
      toast.error("Please select business type");
      return;
    }
    if (!ownerName || !ownerEmail || !ownerPhone) {
      toast.error("Please enter business owner details!");
      return;
    }
    if (!business && (password.length < 6 || !password)) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      if (business) {
        await api.put(
          `/business/admin-update-business/${business.id}`,
          newBusiness
        );
        toast.success("Business updated successfully!");
      } else {
        await api.post("/business/register-business", newBusiness);
        toast.success("Business Registered Successfully!");
      }

      onSave(newBusiness);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4">
          {business ? "Edit Business" : "Add New Business"}
        </h2>
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-600 hover:cursor-pointer"
          onClick={onClose}
        >
          X
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Name
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Email
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />
          </div>  
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Phone
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Type
            </label>
            <select
              name="business_type"
              value={business_type}
              onChange={(e) => setBusiness_type(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="multi-service">Multi-Service</option>
              <option value="car_wash_detailing">Car Wash & Detailing</option>
              <option value="garage">Garage/Workshop</option>
              <option value="accessories_customization">
                Car Accessories & Customization
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Owner Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Owner Email
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Owner Phone
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
            />
          </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          <div>
            <label className="block text-sm font-medium mb-1">User Role</label>
            <select
              className="w-full border rounded px-3 py-2 outline-none focus:border-0 focus:ring ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:cursor-pointer 
             hover:text-red-600 hover:border-red-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded
             hover:bg-white hover:text-blue-600 hover:border border-blue-600 transition-colors hover:cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBusiness;
