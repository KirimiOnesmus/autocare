import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/config/api";
import { toast } from "react-toastify";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const BusinessManagement = () => {
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState({});
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  //fetch all businesses owned by the user
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get(`/business/owners-businesses/${userId}`);
        setBusinesses(res.data);
      } catch (error) {
        console.log("Error fetching bsinesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  //select business

  const handleBusinessChange = async (e) => {
    const businessId = e.target.value;
    setSelectedBusinessId(businessId);
    if (businessId) {
      try {
        const res = await api.get(`/business/business/${businessId}`);
        setSelectedBusiness(res.data);
      } catch (error) {
        console.log("Error fetching business details:", error);
        toast.error("Failed to load business details!");
      }
    } else {
      setSelectedBusiness(null);
    }
  };
  const handleInputChange = (field, value) => {
    setSelectedBusiness((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    if (!selectedBusiness) return;
    try {
      console.log("Sending this to backend:", selectedBusiness);
      await api.put(
        `/business/owner-update/${selectedBusiness.id}`,
        selectedBusiness
      );
      toast.success("Business updated successfully!");
    } catch (err) {
      console.error("Failed to update business:", err);
      toast.error("Failed to save changes!");
    }
  };

  const handleGalleryChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };

  //dummy hours
  const [hours, setHours] = useState(
    daysOfWeek.map((day) => ({
      day_of_week: day,
      open_time: "09:00",
      close_time: "17:00",
      is_closed: false,
    }))
  );
  const handleChange = (day, field, value) => {
    setHours((prev) =>
      prev.map((h) => (h.day_of_week === day ? { ...h, [field]: value } : h))
    );
  };

  const handleSubmit = () => {
    console.log("Business Hours Saved:", hours);
    alert("Dummy save — check console for output ✅");
  };

  return (
    <div className="p-6 bg-gray-50 ">
      <h1 className="text-2xl font-bold mb-4">Garage Management</h1>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Manage your garage profile, services, staff, and other configurations
          here.
        </p>
        <select
          name="businesses"
          value={selectedBusinessId}
          onChange={handleBusinessChange}
          className="border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
        >
          <option value="#">Select Business</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.business_name}
            </option>
          ))}
        </select>
      </div>

      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>{" "}
          <span
            className={`text-md font-semibold ${
              selectedBusiness.is_verified === 1
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {selectedBusiness.is_verified === 1 ? "Verified" : "Not Verified"}
          </span>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                value={selectedBusiness?.business_name || ""}
                onChange={(e) =>
                  handleInputChange("business_name", e.target.value)
                }
                placeholder="Enter business name"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Logo
              </label>
              <input
                type="file"
                onChange={(e) => handleInputChange("logo", e.target.files[0])}
                placeholder="Enter business name"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                value={selectedBusiness?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter contact email"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={selectedBusiness?.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                value={selectedBusiness?.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter business address"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={selectedBusiness?.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter business city"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                value={selectedBusiness?.license_number || ""}
                onChange={(e) =>
                  handleInputChange("license_number", e.target.value)
                }
                placeholder="Enter business license"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                KRA PIN
              </label>
              <input
                type="text"
                value={selectedBusiness?.tax_number || ""}
                onChange={(e) =>
                  handleInputChange("tax_number", e.target.value)
                }
                placeholder="Enter tax number"
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Gallery
              </label>
              <input
                type="file"
                multiple
                onChange={handleGalleryChange}
                className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
              />
              {galleryFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {galleryFiles.map((file, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Description
            </label>
            <textarea
              name="business_description"
              id=""
              value={selectedBusiness?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600  text-white px-4 py-2 rounded-md hover:cursor-pointer
           hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      {/* Business hours */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Set Business Hours</h2>

        {/* Responsive wrapper for table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {hours.map((h, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2 capitalize font-medium w-1/3 sm:w-1/4">
                    {h.day_of_week}
                  </td>
                  <td className="py-3 px-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <input
                      type="time"
                      value={h.open_time}
                      onChange={(e) =>
                        handleChange(h.day_of_week, "open_time", e.target.value)
                      }
                      disabled={h.is_closed}
                      className="border rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-none focus:ring focus:ring-blue-400 disabled:bg-gray-100"
                    />
                    <span className="hidden sm:inline">–</span>
                    <input
                      type="time"
                      value={h.close_time}
                      onChange={(e) =>
                        handleChange(
                          h.day_of_week,
                          "close_time",
                          e.target.value
                        )
                      }
                      disabled={h.is_closed}
                      className="border rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-none focus:ring focus:ring-blue-400 disabled:bg-gray-100 "
                    />
                  </td>

                  <td className="py-3 px-2 text-right w-24">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={h.is_closed}
                        onChange={(e) =>
                          handleChange(
                            h.day_of_week,
                            "is_closed",
                            e.target.checked
                          )
                        }
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span className="hidden sm:inline">Closed</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600  text-white px-4 py-2 rounded-md hover:cursor-pointer
           hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all"
          >
            Save Hours
          </button>
        </div>
      </div>

      {/* Services Offered */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">List the services your garage offers.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer
           hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all"
            onClick={() => navigate("/business/dashboard/services")}
          >
            Edit Services
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Price (Ksh)
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* {dummyServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4">{service.name}</td>
                  <td className="px-6 py-4">{service.description}</td>
                  <td className="px-6 py-4 text-center">{service.price}</td>
                  <td className="px-6 py-4 text-center">{service.duration}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Staff</h2>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">Manage your staff members.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer
           hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all"
            onClick={() => navigate("/business/dashboard/staff")}
          >
            Edit Staff
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Availability
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* {dummyStaff.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-6 py-4">{staff.name}</td>
                  <td className="px-6 py-4">{staff.role}</td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">{staff.phone}</td>
                  <td className="px-6 py-4 text-center">
                    {staff.availability}
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessManagement;
