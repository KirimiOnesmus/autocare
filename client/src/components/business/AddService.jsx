import React, { useState, useEffect } from "react";
import api from "../config/api";
import { toast } from "react-toastify";

const AddService = ({ isOpen, onClose, onSubmit, serviceData, businessId,fetchServices }) => {
  if (!isOpen) return null;
  const selectedBusinessId = businessId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const service = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      duration: formData.get("duration"),
      status: formData.get("status"),
      subscription_type: formData.get("subscription_type"),
      business_id: selectedBusinessId,
    };
    try {
      let res;
      if (serviceData) {
       res = await api.put(`/service/update/${serviceData.id}`, service);
        toast.success("Service updated successfully!");
        if (fetchServices) {
          fetchServices();
        }
      } else {
       res = await api.post("/service/add-service", service);
        toast.success("Service added successfully!");
        if (fetchServices) {
          fetchServices();
        }
     
      }
         onClose();
    } catch (error) {
      console.log("Error registering new service", error);
      toast.error("Failed to register the new service. Try again later!");
    }
  };
  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex justify-center items-start sm:items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl sm:p-6 p-4 max-h-[90vh] flex flex-col shadow-lg overflow-auto">
        <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <h2 className="text-2xl font-semibold">
            {serviceData ? "Edit Service" : "Add Service"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-2xl font-semibold hover:cursor-pointer"
          >
            X
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={serviceData?.service_name || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
              placeholder="Enter service name"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              defaultValue={serviceData?.description || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
              placeholder="Enter service description"
            ></textarea>
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Price (Ksh)
            </label>
            <input
              type="number"
              name="price"
              required
              defaultValue={serviceData?.price || ""}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
              placeholder="Enter service price"
            />
            <span className="text-xs text-gray-500">
              Enter price in Kenyan Shillings
            </span>
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              required
              defaultValue={serviceData?.duration || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
              placeholder="Enter service duration in minutes (e.g., 120)"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Service Type
            </label>
            <select
              name="subscription_type"
              defaultValue={serviceData?.subscription_type || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:cursor-pointer transition-all"
            >
              {serviceData ? "Update Service" : " Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
