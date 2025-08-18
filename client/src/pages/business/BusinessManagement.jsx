import React, { useState } from "react";
import{useNavigate} from "react-router-dom";

const dummyServices = [
  { id: 1, name: "Oil Change", description: "Change engine oil and filter", price: 1000, duration: "30 mins" },
  { id: 2, name: "Tire Rotation", description: "Rotate tires for even wear", price: 800, duration: "20 mins" },
  { id: 3, name: "Car Wash", description: "Exterior and interior cleaning", price: 500, duration: "40 mins" },
];

const dummyStaff = [
  { id: 1, name: "Alice Johnson", role: "Manager", email: "alice.johnson@example.com", phone: "+254 700 123456", availability: "Available" },
  { id: 2, name: "Brian Mwangi", role: "Mechanic", email: "brian.mwangi@example.com", phone: "+254 701 234567", availability: "Busy" },
  { id: 3, name: "Catherine Njeri", role: "Painter", email: "catherine.njeri@example.com", phone: "+254 702 345678", availability: "Available" },
];

const BusinessManagement = () => {
  const [galleryFiles, setGalleryFiles] = useState([]);
  const navigate = useNavigate();

  const handleGalleryChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };

  return (
    <div className="p-6 bg-gray-50 ">
      <h1 className="text-2xl font-bold mb-4">Garage Management</h1>
      <p className="text-gray-600 mb-6">
        Manage your garage profile, services, staff, and other configurations here.
      </p>

      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input type="text" placeholder="Enter business name" className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" placeholder="Enter business address" className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input type="email" placeholder="Enter contact email" className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" placeholder="Enter phone number" className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Gallery</label>
            <input
              type="file"
              multiple
              onChange={handleGalleryChange}
              className="mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm outline-none focus:ring focus:ring-blue-500"
            />
            {galleryFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {galleryFiles.map((file, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded-md text-sm">{file.name}</span>
                ))}
              </div>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer
           hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all">
            Save Changes
          </button>
        </form>
      </div>

      {/* Services Offered */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">List the services your garage offers.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Price (Ksh)</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4">{service.name}</td>
                  <td className="px-6 py-4">{service.description}</td>
                  <td className="px-6 py-4 text-center">{service.price}</td>
                  <td className="px-6 py-4 text-center">{service.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Staff</h2>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">Manage your staff members.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Availability</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dummyStaff.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-6 py-4">{staff.name}</td>
                  <td className="px-6 py-4">{staff.role}</td>
                  <td className="px-6 py-4">{staff.email}</td>
                  <td className="px-6 py-4">{staff.phone}</td>
                  <td className="px-6 py-4 text-center">{staff.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessManagement;
