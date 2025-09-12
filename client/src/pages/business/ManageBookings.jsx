import React, { useState, useEffect } from "react";
import Calendar from "../../components/layout/Calendar";
import api from "../../components/config/api";
import { toast } from "react-toastify";

const ManageBookings = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [staff, setStaff] = useState([]);

  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const businessId = storedUser?.businessId;

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Rescheduled",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;

      try {
        const [bookingsResponse, staffResponse] = await Promise.all([
          api.get(`/bookings/business/${businessId}`),
          api.get(`/staff/get-staff/${businessId}`),
        ]);

        const transformedBookings = bookingsResponse.data.map((booking) => ({
          id: booking.id || booking.reference,
          date: booking.date,
          customerName: booking.customer_name,
          service: booking.service_name,
          time: booking.time,
          staff: booking.staff || "Select Staff",
          status: booking.status,
        }));

        setBookings(transformedBookings);
        setStaff(staffResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  const filteredBookings = bookings.filter((booking) => {
    if (!selectedDate) return false;

    const bookingDate = new Date(booking.date);
    const selectedDateObj = new Date(selectedDate);

    return (
      bookingDate.getFullYear() === selectedDateObj.getFullYear() &&
      bookingDate.getMonth() === selectedDateObj.getMonth() &&
      bookingDate.getDate() === selectedDateObj.getDate()
    );
  });

  const handleEditClick = (booking) => {
    setEditingBooking(booking.id);
    setEditedValues(booking);
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedValues({});
  };

  const handleSaveClick = async (bookingId) => {
    setSaving(true);
    try {
      const originalBooking = bookings.find((b) => b.id === bookingId);
      const isReschedule =
        editedValues.date !== originalBooking.date ||
        editedValues.time !== originalBooking.time;

      if (isReschedule) {
        const rescheduleData = {
          date: editedValues.date,
          time: editedValues.time,
          staff: editedValues.staff,
        };

        await api.put(`/bookings/${bookingId}/reschedule`, rescheduleData);
      } else {
        await api.put(`/bookings/${bookingId}/status`, {
          status: editedValues.status.toLowerCase(),
        });
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...editedValues } : b))
      );

      setEditingBooking(null);
      setEditedValues({});
      toast.success(
        isReschedule
          ? "Booking rescheduled successfully!"
          : "Status updated successfully!"
      );
    } catch (err) {
      console.error("Error updating booking:", err);
      toast.error("Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const apiData = {
        status: newStatus.toLowerCase(),
      };
      await api.put(`/bookings/${bookingId}/status`, apiData);

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );

      toast.success(`Booking status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update booking status.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    const statusStyles = {
      Confirmed: "text-green-800",
      Pending: "text-yellow-800",
      Rescheduled: " text-purple-800",
      Completed: " text-blue-800",
      Cancelled: " text-red-800",
    };

    return `${statusStyles[status] || "bg-gray-100 text-gray-800"} ${base}`;
  };

  if (loading) {
    return <div className="p-4">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="header flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
            {bookings.length} Total Bookings
          </span>
        </div>
      </div>

      <div className="calendar-container p-4">
        <Calendar data={bookings} onDateClick={setSelectedDate} />
      </div>

      <div className="bookings-list p-4 mt-4 bg-white rounded-lg shadow">
        {selectedDate ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <p className="text-gray-600 text-sm">
                {filteredBookings.length} booking(s) found
              </p>
            </div>

            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                        Customer
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                        Service
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                        Date & Time
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                        Staff
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {booking.customerName}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-900">
                          {booking.service}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-900">
                          {editingBooking === booking.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="date"
                                className="border border-gray-300 rounded-md p-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={
                                  editedValues.date
                                    ? new Date(editedValues.date)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  handleInputChange("date", e.target.value)
                                }
                              />
                              <input
                                type="time"
                                className="border border-gray-300 rounded-md p-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={editedValues.time || ""}
                                onChange={(e) =>
                                  handleInputChange("time", e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            `${new Date(booking.date).toLocaleDateString()}, ${
                              booking.time
                            }`
                          )}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-900">
                          {editingBooking === booking.id ? (
                            <select
                              className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                              value={editedValues.staff || ""}
                              onChange={(e) =>
                                handleInputChange("staff", e.target.value)
                              }
                            >
                              {staff.map((staffMember) => (
                                <option
                                  key={staffMember.id || staffMember._id}
                                  value={staffMember.name}
                                >
                                  {staffMember.staff_name} - (
                                  {staffMember.proffession})
                                </option>
                              ))}
                            </select>
                          ) : (
                            booking.staff
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {editingBooking === booking.id ? (
                            <select
                              className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                              value={editedValues.status || ""}
                              onChange={(e) =>
                                handleInputChange("status", e.target.value)
                              }
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={getStatusBadge(booking.status)}>
                              {booking.status}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {editingBooking === booking.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveClick(booking.id)}
                                disabled={saving}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-white hover:text-green-500 border cursor-pointer transition-colors disabled:opacity-50"
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-red-500 cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(booking)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-white hover:text-blue-500 border cursor-pointer transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No bookings for this date.
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-gray-500 italic">
            Please select a date from the calendar above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
