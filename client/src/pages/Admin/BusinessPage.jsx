import React, { useState, useMemo } from "react";
import { IoIosEye } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { ImSwitch } from "react-icons/im";
import { MdDeleteSweep, MdLocalPrintshop } from "react-icons/md";
import AddBusinessModal from "../../components/admin/AddBusiness"; // renamed for clarity

const dummyBusinesses = [
  {
    id: 1,
    name: "AutoCare Garage",
    owner: "John Doe",
    contact: "+254712345678",
    location: "123 Main St, Nairobi",
    status: "Active",
  },
  {
    id: 2,
    name: "Speedy Wash",
    owner: "Jane Smith",
    contact: "+254798765432",
    location: "456 Park Ave, Nairobi",
    status: "Inactive",
  },
  {
    id: 3,
    name: "DetailPro Center",
    owner: "Michael Johnson",
    contact: "+254701234567",
    location: "789 Riverside Rd, Nairobi",
    status: "Active",
  },
  {
    id: 4,
    name: "Shiny Wheels",
    owner: "Alice Brown",
    contact: "+254722345678",
    location: "101 Central St, Nairobi",
    status: "Active",
  },
  {
    id: 5,
    name: "QuickFix Garage",
    owner: "David Kim",
    contact: "+254799812345",
    location: "202 Kenyatta Ave, Nairobi",
    status: "Active",
  },
  {
    id: 6,
    name: "Sparkle Auto",
    owner: "Njeri Mwangi",
    contact: "+254745123987",
    location: "24 Industrial Area, Nairobi",
    status: "Inactive",
  },
];

const BusinessPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const businessesPerPage = 4;

  const filteredBusinesses = useMemo(
    () =>
      dummyBusinesses.filter(
        (biz) =>
          biz.name.toLowerCase().includes(search.toLowerCase()) ||
          biz.owner.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage);
  const indexOfLast = currentPage * businessesPerPage;
  const indexOfFirst = indexOfLast - businessesPerPage;
  const currentBusinesses = filteredBusinesses.slice(indexOfFirst, indexOfLast);

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
              {["Business Name", "Owner", "Contact", "Location", "Status", "Actions"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-semibold text-gray-700"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBusinesses.length > 0 ? (
              currentBusinesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 text-gray-800 font-medium">{biz.name}</td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600">{biz.owner}</td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600">{biz.contact}</td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600">{biz.location}</td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <span
                      className={`font-semibold ${
                        biz.status === "Active" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {biz.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center flex justify-center gap-3 sm:gap-3">
                    <IoIosEye className="hover:text-blue-500 cursor-pointer text-xl" title="View" />
                    <RiEdit2Fill className="hover:text-yellow-500 cursor-pointer text-xl" title="Edit" />
                    <ImSwitch className="hover:text-purple-500 cursor-pointer text-xl" title="Toggle" />
                    <MdDeleteSweep className="hover:text-red-500 cursor-pointer text-xl" title="Delete" />
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
        onClose={() => setIsModalOpen(false)}
        onSave={(newBusiness) => console.log("Save business:", newBusiness)}
      />
    </div>
  );
};

export default BusinessPage;
