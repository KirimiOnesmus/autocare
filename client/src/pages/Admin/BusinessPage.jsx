import React, { useState, useMemo, useEffect } from "react";
import { IoIosEye } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { ImSwitch } from "react-icons/im";
import { MdDeleteSweep, MdLocalPrintshop } from "react-icons/md";
import AddBusinessModal from "../../components/admin/AddBusiness";
import api from "../../components/config/api";
import { toast } from "react-toastify";
import ViewBusiness from "../../components/admin/ViewBusiness";

const BusinessPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const businessesPerPage = 4;

  // viewbusiness modal
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  //Editing business details
  const [editingBusiness, setEditingBusiness] = useState(null);

  const fetchBusinesses = async () => {
    try {
      const res = await api.get("/business/get-all-businesses");
      setBusinesses(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log("Faild to fetch business list", error);
      toast.error("Failed fetching the list of businesses");
    }
  };
  useEffect(() => {
    fetchBusinesses();
  }, []);

  //switch verification

  const filteredBusinesses = useMemo(
    () =>
      businesses.filter(
        (business) =>
          business.business_name.toLowerCase().includes(search.toLowerCase()) ||
          business.owner_name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, businesses]
  );

  const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage);
  const indexOfLast = currentPage * businessesPerPage;
  const indexOfFirst = indexOfLast - businessesPerPage;
  const currentBusinesses = filteredBusinesses.slice(indexOfFirst, indexOfLast);
  const toggleBusinessStatus = async (business) => {
    try {
      const updateStatus = business.is_active === 1 ? 0 : 1;
      const updateVerification = business.is_verified === 1 ? 0 : 1;
      await api.put(`/business/admin-update-business/${business.id}`, {
        ...business,
        is_active: updateStatus,
        is_verified: updateVerification,
      });
      toast.success(
        `Business ${
          updateStatus === 1
            ? "activated & verified"
            : "deactivated & unverified"
        } successfully!`
      );
      fetchBusinesses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Businesses
        </h2>
        <div className="flex items-center  gap-2">
          <MdLocalPrintshop
            title="Print"
            className="bg-blue-600 text-white cursor-pointer hover:bg-white hover:text-blue-600 hover:border border-blue-600 rounded-full p-1 text-3xl sm:text-4xl transition-colors"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-600 hover:border border-blue-600 transition-colors"
          >
            Add New Business
          </button>
        </div>
      </div>

      <div className="mb-4 w-full sm:w-1/2">
        <input
          type="text"
          placeholder="Search by name or owner..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-400 rounded-md outline-none shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-0"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Business Name",
                "Owner",
                "Contact",
                "Location",
                "Status",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 sm:px-8 py-3 text-left text-sm sm:text-base font-semibold text-gray-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBusinesses.length > 0 ? (
              currentBusinesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 text-gray-800 font-medium">
                    {business.business_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600">
                    {business.owner_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600">
                    {business.owner_phone}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600">
                    {business.location}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <span
                      className={`font-semibold ${
                        business.is_verified === 1
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {business.is_verified === 1 ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center flex justify-center gap-3 sm:gap-3">
                    <IoIosEye
                      onClick={() => {
                        setSelectedBusiness(business);
                        setIsViewModalOpen(true);
                      }}
                      className="hover:text-blue-500 cursor-pointer text-xl"
                      title="View"
                    />
                    <RiEdit2Fill
                      onClick={() => {
                        setEditingBusiness(business);
                        setIsModalOpen(true);
                      }}
                      className="hover:text-yellow-500 cursor-pointer text-xl"
                      title="Edit"
                    />
                    <ImSwitch
                      onClick={() => toggleBusinessStatus(business)}
                      className={`cursor-pointer text-xl ${
                        business.is_active === 1 && business.is_verified === 1
                          ? "text-purple-500 hover:text-gray-500"
                          : "text-gray-400 hover:text-purple-500"
                      }`}
                      title={
                        business.is_active === 1 && business.is_verified === 1
                          ? "Deactivate & Unverify"
                          : "Activate & Verify"
                      }
                    />
                    <MdDeleteSweep
                      className="hover:text-red-500 cursor-pointer text-xl"
                      title="Delete"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No businesses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Business Modal */}
      <AddBusinessModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBusiness(null);
        }}
        business={editingBusiness}
        onSave={(updatedBusiness) => {
          fetchBusinesses();
        }}
      />
      {/* View Business modal */}
      <ViewBusiness
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedBusiness(null);
        }}
        business={{
          logo: selectedBusiness?.logo,
          businessName: selectedBusiness?.business_name,
          businessEmail: selectedBusiness?.email,
          businessPhone: selectedBusiness?.phone,
          description: selectedBusiness?.description,
          license: selectedBusiness?.license_number,
          subscription: selectedBusiness?.subscription_plan,
          validTill: selectedBusiness?.subscription_expires_at,
          kra_id: selectedBusiness?.tax_number,
          ownerName: selectedBusiness?.owner_name,
          ownerEmail: selectedBusiness?.owner_email,
          ownerPhone: selectedBusiness?.owner_phone,
          status: selectedBusiness?.is_active,
          verification: selectedBusiness?.is_verified,
          address: {
            street: selectedBusiness?.location,
            city: selectedBusiness?.city,
          },
          services: selectedBusiness?.business_type,
          operatingHours: selectedBusiness?.business_hours,
        }}
      />
    </div>
  );
};

export default BusinessPage;
