import React, { useState,useEffect } from "react";
import StaffManagement from "../../components/business/StaffManagement";
import api from "../../components/config/api";
import { toast } from "react-toastify";



const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const staffPerPage = 5;

  useEffect(()=>{
    const fetchStaff =async()=>{
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user?.id;
        if(!userId) return;

        //fetch all business for this user
        const businessRes = await api.get(`/business/owners-businesses/${userId}`);
        const businesses = businessRes.data;
        if(businesses.length===0) return;
 



        //fetch staff for all businesses
        const res = await api.get(`/staff/get-staff/${userId}`);
        setStaff(res.data);
        console.log(userId)
      } catch (error) {
        console.log("Error fetching staff info:",error);
        toast.error("Failed to fetch staff")
      }
    };
    fetchStaff();
  },[])





  // Filter staff by name and role
  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  // Handle add/edit staff submit
  const handleSubmit = (newStaff) => {
    setStaff(prev => {
      const exists = prev.find(s => s.id === newStaff.id);
      if (exists) {
        return prev.map(s => (s.id === newStaff.id ? newStaff : s));
      } else {
        return [newStaff, ...prev];
      }
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Staff</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-600 hover:border border-blue-600 cursor-pointer transition-all duration-300"
          onClick={() => { setEditingStaff(null); setModalOpen(true); }}
        >
          Add Staff
        </button>
      </div>

      {/* Search & Role Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Roles</option>
          <option value="Manager">Manager</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Painter">Painter</option>
          <option value="Detailer">Detailer</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStaff.length > 0 ? currentStaff.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{s.name}</td>
                <td className="px-6 py-4 text-gray-600">{s.email}</td>
                <td className="px-6 py-4 text-gray-600">{s.phone}</td>
                <td className="px-6 py-4 text-gray-600">{s.role}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => { setEditingStaff(s); setModalOpen(true); }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md bg-white hover:bg-blue-100 disabled:opacity-50 hover:cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md bg-white hover:bg-blue-100 disabled:opacity-50 hover:cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Staff Modal */}
      {modalOpen && (
        <StaffManagement
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          staffData={editingStaff}
        />
      )}
    </div>
  );
};

export default ManageStaff;
