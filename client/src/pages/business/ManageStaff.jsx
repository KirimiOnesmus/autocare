import React, { useState, useEffect } from "react";
import StaffManagement from "../../components/business/StaffManagement";
import api from "../../components/config/api";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { ImSwitch } from "react-icons/im";

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const staffPerPage = 5;

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user?.id;
        if (!userId) return;

        //fetch all business for this user
        const businessRes = await api.get(
          `/business/owners-businesses/${userId}`
        );
        const businesses = businessRes.data;
        if (businesses.length === 0) return;

        //fetch staff for all businesses
        const businessIds = businesses.map((b) => b.id).join(",");
        const res = await api.get(`/staff/get-staff/${businessIds}`);
        setStaff(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Error fetching staff info:", error);
        toast.error("Failed to fetch staff");
      }
    };
    fetchStaff();
  }, []);

  // Filter staff by name and role
  const filteredStaff = staff.filter((s) => {
    const staffName = s.staff_name || s.name || "";
    const proffession = s.proffession || "";

    const matchesSearch =
      staffName.toLowerCase().includes(search.toLowerCase()) ||
      proffession.toLowerCase().includes(search.toLowerCase());

    const matchesRole = filterRole === "All" || proffession === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);


  const handleSubmit = (newStaff) => {
    setStaff((prev) => {
      const exists = prev.find((s) => s.staff_id === newStaff.staff_id);
      if (exists) {
        return prev.map((s) =>
          s.staff_id === newStaff.staff_id ? newStaff : s
        );
      } else {
        return [newStaff, ...prev];
      }
    });
  };

  


  //activate the staff
  const handleReactivate = async (id) => {
    try {
      await api.patch(`/staff/reactivate/${id}`); // or reuse registerStaff logic
      setStaff((prev) =>
        prev.map((s) => (s.staff_id === id ? { ...s, is_active: 1 } : s))
      );
      toast.success("Staff reactivated successfully");
    } catch (error) {
      console.error("Error reactivating staff:", error);
      toast.error("Failed to reactivate staff");
    }
  };
  // Handle delete
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to mark this staff as inactive?")
    ) {
      try {
        await api.delete(`/staff/delete/${id}`); // call backend soft delete route
        setStaff((prev) =>
          prev.map((s) => (s.staff_id === id ? { ...s, is_active: 0 } : s))
        );
        toast.success("Staff marked as inactive");
      } catch (error) {
        console.error("Error marking staff inactive:", error);
        toast.error("Failed to update staff status");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Staff
        </h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-600 hover:border border-blue-600 cursor-pointer transition-all duration-300"
          onClick={() => {
            setEditingStaff(null);
            setModalOpen(true);
          }}
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Staff ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStaff.length > 0 ? (
              currentStaff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {s.login_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {s.staff_name || s.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.staff_email}</td>

                  <td className="px-6 py-4 text-gray-600">{s.staff_phone}</td>
                  <td
                    className={`px-6 py-4 text-gray-600 ${
                      s.is_active === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {s.is_active === 1 ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.proffession}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <CiEdit
                      className="text-yellow-600 cursor-pointer hover:bg-yellow-100 rounded-full p-1 text-2xl"
                      onClick={() => {
                        setEditingStaff(s);
                        setModalOpen(true);
                      }}
                      title="Edit"
                    />
                    {s.is_active === 1 ? (
                      <MdDeleteOutline
                        className="text-2xl cursor-pointer bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleDelete(s.staff_id)}
                        title="Delete"
                      />
                    ) : (
                      <ImSwitch
                        title="Activate"
                        onClick={() => handleReactivate(s.staff_id)}
                        className="text-2xl cursor-pointer p-1 rounded-full text-white bg-green-600"
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md bg-white hover:bg-blue-100 disabled:opacity-50 hover:cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
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
