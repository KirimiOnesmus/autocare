import React from "react";
const cardContent = [
  { title: "Total Bookings", value: 120, icon: "📅" },
  { title: "Total Revenue", value: "Ksh 5000", icon: "💰" },
  { title: "New Customers", value: 30, icon: "👥" },
  { title: "Pending Requests", value: 5, icon: "⏳" },
  { title: "Staff Members", value: 10, icon: "👨‍" },
];
const Card = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 w-full">
        {cardContent.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 w-full hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
          >
            <div className="text-2xl">{card.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-gray-600">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
