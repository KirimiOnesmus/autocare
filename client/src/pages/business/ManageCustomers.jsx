import React, { useState, useEffect } from "react";
import { MdLocalPrintshop } from "react-icons/md";
import api from "../../components/config/api";
import { toast } from "react-toastify";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 6;
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const businessId = storedUser?.businessId;

  useEffect(() => {
   const fetchCustomers = async () => {
    try {
      const res = await api(`/business/customers/${businessId}`);
      setCustomers(res.data.customers || []);
      console.log("Customer Data:", res.data.customers);
    } catch (error) {
      console.log("Error fetching the customers:", error);
      toast.error("Failed to fetch business customers.");
    }
  };
  fetchCustomers();
  }, [businessId]);

  const filteredCustomers = customers.filter((customer) =>
    (customer.customer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800">Customers</h2>
      <div className="flex items-center justify-between mt-4">
        <p className="mt-2 text-gray-600">View your customers here.</p>
        <MdLocalPrintshop className="bg-blue-600 text-white cursor-pointer hover:bg-white hover:text-blue-600 hover:border border-blue-600 rounded-full p-2 text-6xl" />
      </div>

      <div className="mt-4 mb-4 w-full ">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-400 rounded-md outline-none shadow-sm focus:border-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Phone Number
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Reference Number
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Last Booking
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Last Service
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {customer.customer_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.customer_email}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.customer_phone}</td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {customer.reference}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {customer.last_booking}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {customer.last_service}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer"
        >
          Prev
        </button>
        {/* {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded-md hover:bg-blue-100 ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>

    
        ))} */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageCustomers;
