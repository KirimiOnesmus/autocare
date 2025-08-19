import React, { useState, useMemo } from "react";
import { MdDeleteSweep, MdLocalPrintshop } from "react-icons/md";


const dummyRequests = Array.from({ length: 10 }, (_, i) => ({
  id: `REQ-${100 + i}`,
  user: `User ${i + 1}`,
  issue: "Unable to login",
  status: i % 2 === 0 ? "Open" : "Closed",
  createdAt: `2024-08-${(i + 1).toString().padStart(2, "0")}`,
}));

const dummyContacts = Array.from({ length: 10 }, (_, i) => ({
  name: `Person ${i + 1}`,
  email: `person${i + 1}@example.com`,
  subject: "Issue with the app",
  date: `2024-08-${(i + 1).toString().padStart(2, "0")}`,
}));

const ITEMS_PER_PAGE = 5;

const Support = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const data = activeTab === "requests" ? dummyRequests : dummyContacts;

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  return (
    <div className="p-4 sm:p-6 ">
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <p
          onClick={() => {
            setActiveTab("requests");
            setCurrentPage(1);
            setSearchTerm("");
          }}
          className={`cursor-pointer text-xl font-semibold ${
            activeTab === "requests"
              ? "text-blue-600 border-b font-semibold"
              : "text-gray-600 hover:text-blue-600 cursor-pointer"
          }`}
        >
          Requests
        </p>
        <p
          onClick={() => {
            setActiveTab("contacts");
            setCurrentPage(1);
            setSearchTerm("");
          }}
          className={`cursor-pointer text-xl font-semibold ${
            activeTab === "contacts"
              ? "text-blue-600 border-b font-semibold"
              : "text-gray-600 hover:text-blue-600 cursor-pointer"
          }`}
        >
          Contact Us
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-gray-600 w-full sm:w-1/2 rounded-lg outline-none shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-0"
        />
        <MdLocalPrintshop
          title="Print"
          className="bg-blue-600 text-white cursor-pointer hover:bg-white hover:text-blue-600 hover:border border-blue-600 rounded-full p-1 text-3xl sm:text-4xl transition-colors"
        />
      </div>

      <div id="requests" className="overflow-x-auto ">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            {activeTab === "requests" ? (
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Request ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Issue
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            ) : (
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Subject
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((item, i) =>
                activeTab === "requests" ? (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.user}</td>
                    <td className="px-4 py-2">{item.issue}</td>
                    <td className="px-4 py-2">{item.status === "Open" ?(
                      <span className="text-green-500 font-semibold">
                        {item.status}
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        {item.status}
                      </span>
                    )}</td>
                    <td className="px-4 py-2">{item.createdAt}</td>
                    <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                      View
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.email}</td>
                    <td className="px-4 py-2">{item.subject}</td>
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                      Reply
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex space-x-2 justify-center">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Support;
