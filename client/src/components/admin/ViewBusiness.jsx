import React from "react";

const ViewBusiness = ({ isOpen, onClose, business }) => {
  if (!isOpen || !business) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-2">{business.businessName}</h2>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            business.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {business.status || "Active"}
        </span>

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          X
        </button>

        <div className="mt-4 space-y-4">
       
          <div>
            <h3 className="font-semibold text-lg mb-2">General Info</h3>
            <p>
              <strong>Owner Name:</strong> {business.ownerName}
            </p>
            <p>
              <strong>Owner Email:</strong> {business.ownerEmail}
            </p>
            <p>
              <strong>Owner Phone:</strong> {business.ownerPhone}
            </p>
            <p>
              <strong>Business Email:</strong> {business.businessEmail}
            </p>
            <p>
              <strong>Business Phone:</strong> {business.businessPhone}
            </p>
          </div>

          
          {business.address && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Location</h3>
              <p>
                {business.address.street}, {business.address.city},{" "}
                {business.address.postalCode}, {business.address.country}
              </p>
            </div>
          )}

          
          <div>
            <h3 className="font-semibold text-lg mb-2">Business Details</h3>
            <p>
              <strong>Services Offered:</strong> {business.services?.join(", ")}
            </p>
            <p>
              <strong>Operating Hours:</strong>{" "}
              {business.operatingHours || "N/A"}
            </p>
            <p>
              <strong>Number of Staff:</strong> {business.staffCount || 0}
            </p>
            <p>
              <strong>Total Bookings:</strong> {business.totalBookings || 0}
            </p>
            <p>
              <strong>Total Revenue:</strong>{" "}
              {business.totalRevenue ? `Ksh ${business.totalRevenue}` : "0"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBusiness;
