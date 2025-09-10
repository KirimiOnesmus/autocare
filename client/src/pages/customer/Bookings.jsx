import React, { useState, useEffect } from "react";
import { MdOutlineSmartphone } from "react-icons/md";
import { LuCircleCheckBig } from "react-icons/lu";
import HomeButton from "../../components/layout/HomeButton";
import Header from "../../components/layout/Header";
import api from "../../components/config/api";
import { toast } from "react-toastify";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const userData = sessionStorage.getItem("user");
        if (!userData) {
          toast.error("Please login to view bookings");
          return;
        }

        const user = JSON.parse(userData);
        const customer_id = user.customerId;

        const response = await api.get(`/bookings/${customer_id}`);
        console.log("Booking Data", response.data);
        if (response.data && response.data.bookings) {
          // ✅ Transform backend data to match frontend expectations
          const transformedBookings = response.data.bookings.map((booking) => ({
            id: booking.id,
            type: getBookingType(booking.status),
            garageName: booking.business_name || "Unknown Garage",
            serviceName: booking.service_name,
            location: booking.business_address || "Unknown Location",
            dateTime: `${booking.booking_date} ${booking.booking_time}`,
            amount: `KSh ${booking.final_price}`,
            status: formatStatus(booking.status),
            isPaid: booking.payment_status === "pending",
          }));
          setBookings(transformedBookings);
        } else {
          setBookings([]);
          console.log("No bookings found");
        }
      } catch (error) {
        console.log("Error fetching bookings:", error);
        if (error.response?.status === 401) {
          toast.error("Please login to view your bookings");
        } else {
          toast.error("Failed to load bookings");
        }
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Helper function to determine booking type
  const getBookingType = (status) => {
    switch (status) {
      case "pending":
      case "confirmed":
      case "in_progress":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Upcoming";
    }
  };

  // Helper function to format status for display
  const formatStatus = (status) => {
    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const handlePaymentClick = (bookingId, amount) => {
    alert(
      `Initiating M-Pesa payment of ${amount} for booking #${bookingId}. You will receive an SMS prompt on your registered mobile number.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4 relative">
        <h3 className="text-2xl font-semibold">My Bookings</h3>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow overflow-hidden mt-6">
          <div className="flex border-b gap-4">
            {["Upcoming", "In-Progress", "Completed", "Cancelled"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex px-2 py-3 text-sm font-medium transition-colors hover:cursor-pointer ${
                    activeTab === tab
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          <div className="p-6 space-y-5">
            {bookings
              .filter((booking) => booking.type === activeTab)
              .map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex flex-col flex-grow">
                    <h4 className="text-md font-semibold leading-tight">
                      {booking.serviceName} - {booking.garageName}
                    </h4>
                    <p className="text-xs text-gray-500">{booking.location}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.dateTime).toLocaleString()}
                    </p>
                    <span className="mt-1 text-sm font-medium text-gray-700">
                      {booking.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.type === "Upcoming" ? (
                      booking.isPaid ? (
                        <p
                          onClick={() =>
                            handlePaymentClick(booking.id, booking.amount)
                          }
                          className="flex items-center gap-1 px-3 py-2 text-green-500  text-sm font-medium transition cursor-pointer hover:underline"
                        >
                          Intiate Payment
                        </p>
                      ) : (
                        <div className="flex gap-2">
                          <p className="flex items-center gap-1 px-3 py-2 text-red-500  text-sm font-medium transition cursor-pointer hover:underline">
                            Cancel Booking
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-500 rounded-full text-[11px] font-medium">
                        <LuCircleCheckBig className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <HomeButton className="fixed bottom-6 right-6 z-50 shadow-lg hover:scale-105 transition-transform" />
    </div>
  );
};

export default Bookings;
