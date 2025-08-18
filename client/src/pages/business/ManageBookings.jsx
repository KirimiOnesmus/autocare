import React, { useState } from "react";
import Calendar from "../../components/layout/Calendar";
import BookingModal from "../../components/layout/BookingModal";

const ManageBookings = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const staff = ["John", "Sarah", "Michael", "Grace"];
  const Bookings = [
    {
      id: "#12345",
      customerName: "John Doe",
      service: "Mechanic",
      date: "2025-08-18",
      time: "10:00 AM",
      staff: "Alice",
      status: "Confirmed",
      phone: "+1-555-0123",
    },
    {
      id: "#12346",
      customerName: "Jane Smith",
      service: "Detailing",
      date: "2025-08-18",
      time: "2:00 PM",
      staff: "Bob",
      status: "Pending",
      phone: "+1-555-0124",
    },
    {
      id: "#12347",
      customerName: "Mike Johnson",
      service: "Painting",
      date: "2025-08-18",
      time: "4:30 PM",
      staff: "Charlie",
      status: "Completed",
      phone: "+1-555-0125",
    },
    {
      id: "#12348",
      customerName: "Sarah Wilson",
      service: "Service",
      date: "2025-08-19",
      time: "11:00 AM",
      staff: "David",
      status: "Confirmed",
      phone: "+1-555-0126",
    },
    {
      id: "#12349",
      customerName: "Tom Brown",
      service: "Detailing",
      date: "2025-08-19",
      time: "3:00 PM",
      staff: "Eve",
      status: "Rescheduled",
      phone: "+1-555-0127",
    },
  ];

  const filteredBookings = Bookings.filter((b) => {
    const labelDate = new Date(b.date).toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return labelDate === selectedDate;
  });

  return (
    <div>
      <div className="header flex justify-between items-center p-4 ">
        <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative flex items-center gap-2 bg-blue-500 text-white p-2 rounded-lg
               hover:border hover:border-blue-500 hover:bg-white hover:text-blue-500 hover:cursor-pointer"
          >
            New Bookings
          </button>
          <span className="absolute -right-2 -top-2 h-3 w-3 bg-red-500 rounded-full p-2"></span>
        </div>
      </div>

      <div className="calendar">
        <Calendar data={Bookings} onDateClick={setSelectedDate} />
      </div>
      <div className="bookings-list p-4 mt-4 bg-white rounded-lg">
        {selectedDate ? (
          <>
            <h2 className="text-xl font-semibold mb-4">{selectedDate}</h2>
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="py-2 px-4 ">Booking ID</th>
                      <th className="py-2 px-4 ">Customer Name</th>
                      <th className="py-2 px-4 ">Service</th>
                      <th className="py-2 px-4 ">Date</th>
                      <th className="py-2 px-4"> Staff</th>
                      <th className="py-2 px-4 ">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-3 px-4 border-b text-center">
                          {b.id}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {b.customerName}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {b.service}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {b.date}, {b.time}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {b.staff}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {b.status === "Confirmed" ? (
                            <span className="text-green-500 font-semibold">
                              {b.status}
                            </span>
                          ) : b.status === "Pending" ? (
                            <span className="text-yellow-500 font-semibold">
                              {b.status}
                            </span>
                          ) : b.status === "Completed" ? (
                            <span className="text-blue-500 font-semibold">
                              {b.status}
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold">
                              {b.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No bookings for this date.</p>
            )}
          </>
        ) : (
          <p className="italic">
            Please select a date from the calendar above.
          </p>
        )}
      </div>
      {isModalOpen && (
        <BookingModal
          bookings={Bookings}
          staff={staff}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageBookings;
