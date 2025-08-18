import React from "react";

const StaffManagement = ({ isOpen, onClose, onSubmit, staffData }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Correctly create the new staff object
    const staff = {
      id: staffData?.id || Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
    };

    // Pass the new/updated staff to parent
    onSubmit(staff);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex justify-center items-start sm:items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 max-h-[90vh] flex flex-col shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {staffData ? "Edit Staff" : "Add Staff"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl font-semibold hover:cursor-pointer"
          >
            X
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={staffData?.name || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={staffData?.email || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="text"
              defaultValue={staffData?.phone || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Role
            </label>
            <input
              name="role"
              type="text"
              defaultValue={staffData?.role || ""}
              placeholder="Enter role (e.g., Manager, Mechanic)"
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white
               hover:text-blue-500 hover:border hover:cursor-pointer border-blue-500 transition-all"
            >
              {staffData ? "Update Staff" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffManagement;
