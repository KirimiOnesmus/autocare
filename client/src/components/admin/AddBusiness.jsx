import React, { useState } from "react";

const AddBusiness = ({ isOpen, onClose, onSave }) => {
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Owner");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newBusiness = {
      businessName,
      businessEmail,
      businessPhone,
      ownerName,
      ownerEmail,
      ownerPhone,
      password,
      role,
    };
    onSave(newBusiness);
    onClose();
  };
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Add New Business</h2>
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
