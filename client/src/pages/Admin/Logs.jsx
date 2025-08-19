import React, { useMemo, useState } from "react";
import { MdLocalPrintshop } from "react-icons/md";

// Generate dummy logs
const users = ["Admin", "Staff", "Customer"];
const activities = ["Login", "Update", "Delete", "Create"];

const generateDummyLogs = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    timestamp: `2024-08-${(i + 1).toString().padStart(2, "0")} 10:00 AM`,
    user: users[Math.floor(Math.random() * users.length)],
    name: `User ${i + 1}`,
    activity: activities[Math.floor(Math.random() * activities.length)],
    details: "Sample log entry details",
  }));
};

const ITEMS_PER_PAGE = 10;

const Logs = () => {
  const [logs] = useState(generateDummyLogs());
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & search
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch = Object.values(log).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      );

      const matchUser = filterUser ? log.user === filterUser : true;

      const matchDate =
        startDate && endDate
          ? new Date(log.timestamp) >= new Date(startDate) &&
            new Date(log.timestamp) <= new Date(endDate)
          : true;

      return matchSearch && matchUser && matchDate;
    });
  }, [logs, search, filterUser, startDate, endDate]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">System Logs</h1>
          <p className="text-gray-600">Displays system logs and activities.</p>
        </div>
        <MdLocalPrintshop
          title="Print"
          className="bg-blue-600 text-white cursor-pointer hover:bg-white hover:text-blue-600 hover:border border-blue-600 rounded-full p-1 text-3xl sm:text-4xl transition-colors"
          onClick={() => window.print()}
        />
      </div>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="search"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 outline-none focus:ring-1 focus:ring-blue-500 focus:border-0"
        />
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-48 outline-none focus:ring-1 focus:ring-blue-500 focus:border-0"
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-48 outline-none focus:ring-1 focus:ring-blue-500 focus:border-0"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-48 outline-none focus:ring-1 focus:ring-blue-500 focus:border-0"
        />
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-100">
              <th className="py-2 px-4 text-left text-sm font-semibold">Timestamp</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">User</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Name</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Activity</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4">{log.timestamp}</td>
                  <td className="py-2 px-4">{log.user}</td>
                  <td className="py-2 px-4">{log.name}</td>
                  <td className="py-2 px-4">{log.activity}</td>
                  <td className="py-2 px-4">{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded cursor-pointer ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Logs;
