import React, { useState } from "react";
import { MdLocalPrintshop } from "react-icons/md";
const dummyCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+254 700 123456",
    bookings: 5,
    lastBooking: "2025-08-15",
    lastService: "Oil Change",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+254 701 987654",
    bookings: 2,
    lastBooking: "2025-08-12",
    lastService: "Car Wash",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+254 702 456789",
    bookings: 7,
    lastBooking: "2025-08-14",
    lastService: "Wheel Alignment",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+254 703 234567",
    bookings: 3,
    lastBooking: "2025-08-10",
    lastService: "Polishing",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert@example.com",
    phone: "+254 704 987654",
    bookings: 4,
    lastBooking: "2025-08-11",
    lastService: "Car Wash",
  },
  {
    id: 6,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+254 705 123456",
    bookings: 6,
    lastBooking: "2025-08-13",
    lastService: "Oil Change",
  },
  {
    id: 7,
    name: "David Lee",
    email: "david@example.com",
    phone: "+254 706 234567",
    bookings: 2,
    lastBooking: "2025-08-09",
    lastService: "Polishing",
  },
  {
    id: 8,
    name: "Anna Scott",
    email: "anna@example.com",
    phone: "+254 707 345678",
    bookings: 1,
    lastBooking: "2025-08-08",
    lastService: "Wheel Alignment",
  },
];

const ManageCustomers = () => {
  const [customers] = useState(dummyCustomers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 6;

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
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
          <MdLocalPrintshop
          className="bg-blue-600 text-white cursor-pointer hover:bg-white hover:text-blue-600 hover:border border-blue-600 rounded-full p-2 text-6xl"
           />
        
            
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
                Bookings
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
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {customer.bookings}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {customer.lastBooking}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {customer.lastService}
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
