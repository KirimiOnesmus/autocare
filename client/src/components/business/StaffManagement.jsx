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
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    staffData?.business_id || businessId || ""
  );
  const [showPassword, setShowPassword] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;

  // Fetch owner's businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get(`/business/owners-businesses/${userId}`);
        setBusinesses(res.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();
  }, [userId]);
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
      hire_date: formData.get("hire_date"),
      business_id: selectedBusinessId, 
      password: formData.get("password"),
      // designation: formData.get("designation"), // optional display role
    };
    try {
      const res = await api.post("/staff/register-staff", staff);
      const data = res.data;
      console.log("business id:", data)
      toast.success("Staff registered successfully!" + data.login_id);
      onSubmit({ ...staff, login_id: data.login_id });
      onClose();
    } catch (error) {
      console.log("Error registering staff:", error);
      toast.error("Faliked to register the new staff. Try again later!");
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
        <div className="flex w-full mb-2">
          <select
            name="business_id"
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            required
            className="mt-1 block w-full outline-none border-gray-300 font-md font-semibold text-gray-700 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
          >
            <option value="" className="">
              Select Business
            </option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.business_name}
              </option>
            ))}
          </select>
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
              required
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="lg:col-span-2 relative">
            <label className="block text-md font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type={showPassword ?"text":"password"}
              placeholder="Set password for new staff"
              required={!staffData} // password required only for new staff
              className="mt-1 block w-full outline-none border-gray-300 rounded-md p-2 shadow-sm focus:ring-1 focus:ring-blue-500"
            />
            <span onClick={
              ()=>setShowPassword(!showPassword)
            }
            className="absolute top-12 right-3 transform -translate-y-1/2 text-gray-500 hover:cursor-pointer hover:text-blue-600"
            >
              {showPassword ? <IoMdEyeOff size={20} /> :  <IoMdEye size={20} /> }
              
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
