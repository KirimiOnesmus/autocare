import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { ImSwitch } from "react-icons/im";
import AddService from "../../components/business/AddService";

const dummyServices = [
  { id: 1, name: "Oil Change", description: "Change engine oil and filter", price: 1000, duration: "30 mins", status: "Active" },
  { id: 2, name: "Wheel Alignment", description: "Adjust the wheels to proper angles", price: 1500, duration: "45 mins", status: "Inactive" },
  { id: 3, name: "Car Wash", description: "Exterior and interior cleaning", price: 800, duration: "40 mins", status: "Active" },
  { id: 4, name: "Polishing", description: "Polish car to shine", price: 2000, duration: "60 mins", status: "Inactive" },
];

const ManageServices = () => {
  const [services, setServices] = useState(dummyServices);
  const [filter, setFilter] = useState("All");
  const [showAddService, setShowAddService] = useState(false);

  const filteredServices = services.filter(service => {
    if (filter === "All") return true;
    return service.status === filter;
  });

  const toggleStatus = (id) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id
          ? { ...service, status: service.status === "Active" ? "Inactive" : "Active" }
          : service
      )
    );
  };

  const handleAddService = (newService) => {
    const id = services.length ? services[services.length - 1].id + 1 : 1;
    setServices([...services, { id, ...newService }]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Services</h1>
        <button
          onClick={() => setShowAddService(true)}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 border border-blue-500 transition-all"
        >
          Add New Service
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        {["All", "Active", "Inactive"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-lg border font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Price (Ksh)</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Duration</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map(service => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{service.name}</td>
                <td className="px-6 py-4 text-gray-600">{service.description}</td>
                <td className="px-6 py-4 text-center text-gray-800">{service.price}</td>
                <td className="px-6 py-4 text-center text-gray-800">{service.duration}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <CiEdit
                  className="text-yellow-600 cursor-pointer hover:bg-yellow-100 rounded-full p-1 text-2xl" title="Edit"/>
                  <ImSwitch
                    title="Toggle Status"
                    onClick={() => toggleStatus(service.id)}
                    className={`text-2xl cursor-pointer p-1 rounded-full ${
                      service.status === "Active" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  />
                  <MdDeleteOutline 
                    title="Delete"
                    className="text-2xl cursor-pointer bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <AddService
          isOpen={showAddService}
          onClose={() => setShowAddService(false)}
          onSubmit={handleAddService}
        />
      )}
    </div>
  );
};

export default ManageServices;
