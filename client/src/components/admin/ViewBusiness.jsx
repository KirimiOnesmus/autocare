import React from "react";

const ViewBusiness = ({ isOpen, onClose, business }) => {
  if (!isOpen || !business) return null;


  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold cursor-pointer"
          onClick={onClose}
        >
          X
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          {business.logo ? (
            <img
              src={business.logo}
              alt="Business Logo"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
              {business.businessName?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {business.businessName}
            </h2>
            <span
              className={`px-3 py-1 mt-1 inline-block rounded-full text-sm font-semibold ${
                business.status === 1
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {business.status ===1 ? "Active":"Inactive"}
            </span>
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold border-b pb-1">Business Info</h3>
            <p><strong>Email:</strong> {business.businessEmail}</p>
            <p><strong>Phone:</strong> {business.businessPhone}</p>
            <p><strong>License:</strong> {business.license}</p>
            <p><strong>Subscription:</strong> {business.subscription}</p>
            <p><strong>Expires:</strong> {business.validTill}</p>
            <p><strong>KRA Pin:</strong> {business.kra_id}</p>
            <p><strong>Verification:</strong> <span className={`text-md ${business.verification ===1 ?"text-green-600":"text-gray-700"}`}>
              {business.verification === 1 ? "Verified" :  " Not Verified"}</span></p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold border-b pb-1">Owner Info</h3>
            <p><strong>Name:</strong> {business.ownerName}</p>
            <p><strong>Email:</strong> {business.ownerEmail}</p>
            <p><strong>Phone:</strong> {business.ownerPhone}</p>
          </div>
        </div>
        {business.address && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold border-b pb-1 mb-2">Location</h3>
            <p>
              {business.address.street}, {business.address.city}
            </p>
          </div>
        )}


        <div className="mb-6">
          <h3 className="text-xl font-semibold border-b pb-1 mb-2">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Services Offered:</strong> {business.services}</p>
            <p><strong>Operating Hours:</strong> {business.operatingHours || "N/A"}</p>
            <p><strong>Number of Staff:</strong> {business.staffCount || 0}</p>
            <p><strong>Total Bookings:</strong> {business.totalBookings || 0}</p>
            <p><strong>Total Revenue:</strong> {business.totalRevenue ? `Ksh ${business.totalRevenue}` : "0"}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-white hover:text-blue-600 hover:border border-blue-600 hover:cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBusiness;
