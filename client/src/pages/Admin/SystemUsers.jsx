import React, { useState, useMemo, useEffect } from "react";
import { MdDeleteSweep, MdLocalPrintshop } from "react-icons/md";
import api from "../../components/config/api";
import { toast } from "react-toastify";
const ITEMS_PER_PAGE = 5;
const SystemUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users/getAllUsers`);
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Failed to fetch the system users:", error);
      toast.error("Failed to fetch the system users");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtering & search
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone || "").includes(searchTerm);

      const matchesRole = filterRole ? user.role === filterRole : true;
      const matchesStatus = filterStatus !== "" 
      ? Number(user.is_active)=== Number(filterStatus)
       : true;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">System Users</h1>
      <p className="text-gray-600 mb-6">
        Manage system users, including admins, staff, and customers.
      </p>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 outline-none focus:ring-1 focus:ring-blue-500 focus:border-0"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="font-semibold text-lg text-gray-800">
              Filter by role:
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="font-semibold text-lg text-gray-800">
              Filter by status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div>
            <MdLocalPrintshop
              title="Print"
              className="bg-blue-600 text-white cursor-pointer hover:bg-white
             hover:text-blue-600 hover:border border-blue-600 rounded-full p-1 text-3xl sm:text-4xl transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2 px-4 text-left">User ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.phone}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className={`py-2 px-4 capitalize ${
                    user.is_active === 1 ?"text-green-600":"text-gray-700"
                  }`}>
                    {user.is_active === 1 ? "Active" : "In active"}
                    </td>
                  <td className="py-2 px-4 ">
                    <button className="text-blue-500 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded-md border hover:cursor-pointer ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SystemUsers;
