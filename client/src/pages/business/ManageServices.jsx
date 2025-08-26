import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { ImSwitch } from "react-icons/im";
import AddService from "../../components/business/AddService";
import api from "../../components/config/api";
import { toast } from "react-toastify";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("All");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const servicesPerPage = 5;

  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;

  const fetchServices = async () => {
    try {
      const businessRes = await api.get(
        `/business/owners-businesses/${userId}`
      );
      setBusinesses(businessRes.data);

      const serviceRes = await api.get(`/service/getService`);
      setServices(serviceRes.data);
      console.log(serviceRes.data);
    } catch (error) {
      console.log("Error fetching services or businesses:", error);
      toast.error("Failed to fetch services");
    }
  };

  //toogle
  const toggleServiceStatus = async (service) => {
    try {
      const updateStatus = service.status === "active" ? "inactive" : "active";
      await api.put(`/service/${service.id}`, {
        ...service,
        status: updateStatus,
      });
      toast.success(
        `Service ${
          updateStatus === "active" ? "Activated" : "Deactivated"
        } successfully`
      );
      fetchServices();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update service status");
    }
  };
  const deleteService = async (service) => {
    try {
      await api.delete(`/service/${service.id}`, {
        ...service,
      });
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.log(error);
      toast.error("Deletion failed....");
    }
  };
  useEffect(() => {
    if (userId) {
      fetchServices();
    }
  }, [userId]);

const filteredServices = services.filter((service) => {
  const matchesBusiness =
    selectedBusiness === "All" ||
    service.business_id === parseInt(selectedBusiness);
  const matchesStatus =
    filter === "All" || service.status.toLowerCase() === filter.toLowerCase();
  return matchesBusiness && matchesStatus;
});

  // const toggleStatus = (id) => {
  //   setServices((prev) =>
  //     prev.map((service) =>
  //       service.id === id
  //         ? {
  //             ...service,
  //             status: service.status === "active" ? "inactive" : "active",
  //           }
  //         : service
  //     )
  //   );
  // };
  const handleAddService = (newService) => {
    setServices([...services, newService]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Services
        </h1>
        <div></div>
        <button
          onClick={() => {
            setShowAddService(true);
            setEditingService(null);
          }}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 border border-blue-500 transition-all"
        >
          Add New Service
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-between mb-4">
        <select
          value={selectedBusiness}
          onChange={(e) => setSelectedBusiness(e.target.value)}
          className="px-4 py-1 rounded-lg border font-medium transition-colors outline-none border-gray-300"
        >
          <option value="All">All Businesses</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.business_name}
            </option>
          ))}
        </select>
        <div className="flex gap-3 mb-4">
          {["All", "Active", "Inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Price (Ksh)
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Duration(minutes)
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                  {service.service_name}
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-2xs truncate">
                  {service.description}
                </td>
                <td className="px-6 py-4 text-center text-gray-800">
                  {service.price}
                </td>
                <td className="px-6 py-4 text-center text-gray-800">
                  {service.duration}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <CiEdit
                    onClick={() => {
                      setEditingService(service);
                      setShowAddService(true);
                    }}
                    className="text-yellow-600 cursor-pointer hover:bg-yellow-100 rounded-full p-1 text-2xl"
                    title="Edit"
                  />
                  <ImSwitch
                    title={
                      service.status === "active" ? "Deactivate" : "Activate"
                    }
                    onClick={() => toggleServiceStatus(service)}
                    className={`text-2xl cursor-pointer p-1 rounded-full ${
                      service.status === "active"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  />
                  <MdDeleteOutline
                    title="Delete"
                     onClick={() => deleteService(service)}
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
          serviceData={editingService}
        />
      )}
    </div>
  );
};

export default ManageServices;
