import React, { useState, useEffect } from "react";
import api from "../config/api";
import { toast } from "react-toastify";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
const StaffManagement = ({
  isOpen,
  onClose,
  onSubmit,
  staffData,
  businessId,
}) => {
  if (!isOpen) return null;
  const [showPassword, setShowPassword] = useState(false);
  const selectedBusinessId = businessId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const staff = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      proffession: formData.get("proffession"),
      national_id: formData.get("national_id"),
      kra_pin: formData.get("kra_pin"),
      pay_commission: parseFloat(formData.get("pay_commission")),
      business_id: selectedBusinessId,
      role: formData.get("role" ),
      password: formData.get("password"),
    };
    if (!staffData) {
      staff.hire_date = formData.get("hire_date");
    }
    try {
      let res;
      if (staffData) {
        console.log(staffData.staff_id);
        res = await api.put(`/staff/update/${staffData.staff_id}`, staff);
        toast.success("Staff updated successfully !");
        onSubmit({ ...staffData, ...staff });
      } else {
        res = await api.post("/staff/register-staff", staff);
        const data = res.data;
        console.log("business id:", data);
        toast.success("Staff registered successfully!" + data.login_id);
        onSubmit({ ...staff, login_id: data.login_id });
      }

      onClose();
    } catch (error) {
      console.log("Error registering staff:", error);
      toast.error("Failed to save the staff. Try again later!");
    }

    onSubmit(staff);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex justify-center items-start sm:items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] flex flex-col shadow-lg overflow-auto">
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
        <form
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-md font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={staffData?.staff_name || ""}
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
              defaultValue={staffData?.staff_email || ""}
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
              defaultValue={staffData?.staff_phone || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Select Role(Manager/ Staff)
            </label>
            <select 
            name="role"
            defaultValue={staffData?.role || ""}
            className="mt-1 block w-full outline-none border-gray-300 font-md font-semibold text-gray-700 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500">
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Designation
            </label>
            <input
              name="proffession"
              type="text"
              defaultValue={staffData?.proffession || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              National ID
            </label>
            <input
              name="national_id"
              type="text"
              defaultValue={staffData?.national_id || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              KRA PIN
            </label>
            <input
              name="kra_pin"
              type="text"
              defaultValue={staffData?.kra_pin || ""}
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Commission %
            </label>
            <input
              name="pay_commission"
              type="number"
              defaultValue={staffData?.pay_commission || ""}
              step="0.01"
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Hire Date
            </label>
            <input
              name="hire_date"
              type="date"
              defaultValue={staffData?.hire_date || ""}
              required={!staffData}
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="lg:col-span-2 relative">
            <label className="block text-md font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Set password for new staff"
              required={!staffData} // password required only for new staff
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-12 right-3 transform -translate-y-1/2 text-gray-500 hover:cursor-pointer hover:text-blue-600"
            >
              {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </span>
          </div>

          <div className="lg:col-span-2 flex justify-end">
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
