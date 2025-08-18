import React, { useState } from "react";
import { MdOutlineSmartphone } from "react-icons/md";
import { LuCircleCheckBig } from "react-icons/lu";
import HomeButton from "../../components/layout/HomeButton";
import Header from "../../components/layout/Header";
const Bookings = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const handlePaymentClick = (bookingId, amount) => {
    // Simulate M-Pesa payment initiation
    alert(
      `Initiating M-Pesa payment of ${amount} for booking #${bookingId}. You will receive an SMS prompt on your registered mobile number.`
    );
  };

  const bookings = [
    {
      id: 1,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      garageName: "SpeedFix Auto Garage",
      technicianName: "James Mwangi",
      location: "Nairobi, Kenya",
      dateTime: "2025-08-20 10:30 AM",
      status: "Confirmed",
      type: "Upcoming",
      isPaid: false,
      amount: "KSh 3,500",
    },
    {
      id: 2,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      garageName: "Prime Motors Workshop",
      technicianName: "Sarah Otieno",
      location: "Mombasa, Kenya",
      dateTime: "2025-08-15 02:00 PM",
      status: "In progress",
      type: "Past",
      isPaid: true,
      amount: "KSh 5,200",
    },
    {
      id: 3,
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      garageName: "AutoCare Solutions",
      technicianName: "Peter Njoroge",
      location: "Kisumu, Kenya",
      dateTime: "2025-08-22 09:00 AM",
      status: "Rescheduled",
      type: "Upcoming",
      isPaid: false,
      amount: "KSh 2,800",
    },
    {
      id: 4,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      garageName: "TurboFix Garage",
      technicianName: "Lilian Wanjiku",
      location: "Nakuru, Kenya",
      dateTime: "2025-08-10 03:15 PM",
      status: "Confirmed",
      type: "Past",
      isPaid: true,
      amount: "KSh 4,100",
    },
    {
      id: 5,
      image: "https://randomuser.me/api/portraits/men/77.jpg",
      garageName: "Elite Auto Repairs",
      technicianName: "Daniel Kiptoo",
      location: "Eldoret, Kenya",
      dateTime: "2025-08-23 11:00 AM",
      status: "In progress",
      type: "Upcoming",
      isPaid: false,
      amount: "KSh 6,750",
    },
    {
      id: 6,
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      garageName: "Metro Car Service",
      technicianName: "Grace Njenga",
      location: "Thika, Kenya",
      dateTime: "2025-08-13 04:45 PM",
      status: "Rescheduled",
      type: "Past",
      isPaid: true,
      amount: "KSh 3,900",
    },
    {
      id: 7,
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      garageName: "Pro Mechanics Hub",
      technicianName: "Kevin Omondi",
      location: "Machakos, Kenya",
      dateTime: "2025-08-24 08:00 AM",
      status: "Confirmed",
      type: "Upcoming",
      isPaid: false,
      amount: "KSh 2,450",
    },
    {
      id: 8,
      image: "https://randomuser.me/api/portraits/women/15.jpg",
      garageName: "GearUp Auto Shop",
      technicianName: "Mercy Achieng",
      location: "Nyeri, Kenya",
      dateTime: "2025-08-12 01:30 PM",
      status: "In progress",
      type: "Past",
      isPaid: true,
      amount: "KSh 5,600",
    },
    {
      id: 9,
      image: "https://randomuser.me/api/portraits/men/19.jpg",
      garageName: "Reliable Auto Garage",
      technicianName: "Brian Mutua",
      location: "Meru, Kenya",
      dateTime: "2025-08-25 09:30 AM",
      status: "Rescheduled",
      type: "Upcoming",
      isPaid: false,
      amount: "KSh 4,300",
    },
    {
      id: 10,
      image: "https://randomuser.me/api/portraits/women/30.jpg",
      garageName: "SuperFix Car Repairs",
      technicianName: "Esther Wairimu",
      location: "Kakamega, Kenya",
      dateTime: "2025-08-09 02:15 PM",
      status: "Confirmed",
      type: "Past",
      isPaid: true,
      amount: "KSh 3,750",
    },
    {
      id: 11,
      image: "https://randomuser.me/api/portraits/men/19.jpg",
      garageName: "Reliable Auto Garage",
      technicianName: "Brian Mutua",
      location: "Meru, Kenya",
      dateTime: "2025-08-25 09:30 AM",
      status: "Rescheduled",
      type: "Upcoming",
      isPaid: false,
      amount: "KSh 4,300",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4 relative">
        <h3 className="text-2xl font-semibold">My Bookings</h3>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow overflow-hidden mt-6">
          <div className="flex border-b">
            {["Upcoming", "Past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors hover:cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-600 bg-blue-50  border-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {bookings
              .filter((booking) => booking.type === activeTab)
              .map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <img
                    src={booking.image}
                    alt={booking.technicianName}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex flex-col flex-grow">
                    <h4 className="text-lg font-semibold leading-tight">
                      {booking.garageName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Technician: {booking.technicianName}
                    </p>
                    <p className="text-xs text-gray-500">{booking.location}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.dateTime).toLocaleString()}
                    </p>
                    <span className="mt-1 text-sm font-medium text-gray-700">
                      {booking.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "In progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>

                    {booking.type === "Upcoming" ? (
                      booking.isPaid ? (
                        <div className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-500 rounded-full text-[11px] font-medium ">
                          <LuCircleCheckBig className="w-4 h-4" />
                          <span>Paid via M-Pesa</span>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handlePaymentClick(booking.id, booking.amount)
                          }
                          className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-[11px] font-medium transition cursor-pointer"
                        >
                          <MdOutlineSmartphone className="w-4 h-4" />
                          <span>Pay via M-Pesa</span>
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-500 rounded-full text-[11px] font-medium">
                        <LuCircleCheckBig className="w-4 h-4" />
                        <span>Paid via M-Pesa</span>
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
