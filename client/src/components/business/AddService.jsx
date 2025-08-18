import React from "react";

const AddService = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null; // Only render when modal is open

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newService = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      duration: formData.get("duration"),
      status: formData.get("status"),
    };
    if (onSubmit) onSubmit(newService);
    onClose();
  };
  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex justify-center items-start sm:items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl sm:p-6 p-4 max-h-[90vh] flex flex-col shadow-lg">
               <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <h2 className="text-2xl font-semibold">Add Service</h2>
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
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
              placeholder="Enter service name"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
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
              required
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
              required
              pattern="^\d+\s*(mins|hours)$"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500"
              placeholder="Enter service duration (e.g., 30 mins)"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-gray-700">
              Status
            </label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm  focus:outline-none focus:border-blue-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:cursor-pointer transition-all"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
