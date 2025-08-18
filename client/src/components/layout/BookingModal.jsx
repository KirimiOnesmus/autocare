import React, { useState } from "react";

const BookingModal = ({ bookings, staff, onClose }) => {
  const [assignments, setAssignments] = useState({});
  const [rescheduleRow, setRescheduleRow] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({});
  const [confirmedBookings, setConfirmedBookings] = useState({});

  const handleAssign = (bookingId, staffName) => {
    setAssignments({ ...assignments, [bookingId]: staffName });
  };

  const handleReschedule = (bookingId) => {
    setRescheduleRow(rescheduleRow === bookingId ? null : bookingId);
  };

  const handleChange = (bookingId, field, value) => {
    setRescheduleData({
      ...rescheduleData,
      [bookingId]: {
        ...rescheduleData[bookingId],
        [field]: value,
      },
    });
  };

  const handleSaveAndConfirm = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const staffAssigned = assignments[bookingId];
    const newDate = rescheduleData[bookingId]?.date || booking.date;
    const newTime = rescheduleData[bookingId]?.time || booking.time;

    if (!staffAssigned) {
      alert("Please assign a staff member before confirming!");
      return;
    }

    setConfirmedBookings({
      ...confirmedBookings,
      [bookingId]: {
        ...booking,
        date: newDate,
        time: newTime,
        staff: staffAssigned,
      },
    });

    setRescheduleRow(null);
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs sm:text-sm font-semibold text-white";
    switch (status) {
      case "Confirmed":
        return `bg-green-500 ${base}`;
      case "Pending":
        return `bg-yellow-500 ${base}`;
      case "Rescheduled":
        return `bg-purple-500 ${base}`;
      case "Completed":
        return `bg-blue-500 ${base}`;
      default:
        return `bg-gray-500 ${base}`;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/30 flex justify-center items-start sm:items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl sm:p-6 p-4 max-h-[90vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <h2 className="text-2xl font-semibold">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold hover:cursor-pointer"
          >
            X
          </button>
        </div>

        <p className="mb-4 text-gray-700 flex-shrink-0">
          View and manage your bookings. Assign staff and reschedule directly below.
        </p>

        {/* Scrollable Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 rounded border border-gray-200">
          <table className="w-full text-sm min-w-max border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left uppercase tracking-wide">Customer</th>
                <th className="p-3 text-left uppercase tracking-wide">Service</th>
                <th className="p-3 text-left uppercase tracking-wide">Date</th>
                <th className="p-3 text-left uppercase tracking-wide">Time</th>
                <th className="p-3 text-left uppercase tracking-wide">Staff</th>
                <th className="p-3 text-left uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <React.Fragment key={b.id}>
                  <tr
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors duration-150`}
                  >
                    <td className="border-b p-3">{b.customerName}</td>
                    <td className="border-b p-3">{b.service}</td>
                    <td className="border-b p-3">{rescheduleData[b.id]?.date || b.date}</td>
                    <td className="border-b p-3">{rescheduleData[b.id]?.time || b.time}</td>
                    <td className="border-b p-3">
                      <select
                        className="border rounded p-1 w-full sm:w-auto"
                        value={assignments[b.id] || ""}
                        onChange={(e) => handleAssign(b.id, e.target.value)}
                        disabled={!!confirmedBookings[b.id]}
                      >
                        <option value="">-- Select Staff --</option>
                        {staff.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border-b p-3 flex gap-2 items-center">
                      {!confirmedBookings[b.id] && (
                        <button
                          onClick={() => handleReschedule(b.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs sm:text-sm transition-all duration-150"
                        >
                          Reschedule
                        </button>
                      )}
                      {confirmedBookings[b.id] && (
                        <span className={getStatusBadge("Confirmed")}>Confirmed</span>
                      )}
                    </td>
                  </tr>

                  {/* Reschedule Row */}
                  {rescheduleRow === b.id && !confirmedBookings[b.id] && (
                    <tr>
                      <td colSpan="6" className="bg-gray-50 p-3 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <input
                            type="date"
                            className="border p-2 rounded w-full sm:w-auto"
                            value={rescheduleData[b.id]?.date || ""}
                            onChange={(e) => handleChange(b.id, "date", e.target.value)}
                          />
                          <input
                            type="time"
                            className="border p-2 rounded w-full sm:w-auto"
                            value={rescheduleData[b.id]?.time || ""}
                            onChange={(e) => handleChange(b.id, "time", e.target.value)}
                          />
                          <button
                            onClick={() => handleSaveAndConfirm(b.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-xs sm:text-sm transition-all duration-150"
                          >
                            Save & Confirm
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4 gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 hover:cursor-pointer px-4 py-2 rounded transition-colors duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
