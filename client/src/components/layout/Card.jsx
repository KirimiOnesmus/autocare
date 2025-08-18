import React from "react";
import { BsCalendar2Date } from "react-icons/bs";
import {
  MdPeople,
 MdOutlineEngineering, 

} from "react-icons/md";
import { CiMoneyCheck1 } from "react-icons/ci";
import { BsHourglassSplit } from "react-icons/bs";
const cardContent = [
  { title: "Total Bookings", value: 120, icon: <BsCalendar2Date/> },
  { title: "Total Revenue", value: "Ksh 5000", icon: <CiMoneyCheck1 /> },
  { title: "New Customers", value: 30, icon: <MdPeople/> },
  { title: "Pending Requests", value: 5, icon: <BsHourglassSplit /> },
  { title: "Staff Members", value: 10, icon: <MdOutlineEngineering/> },
];
const Card = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 w-full">
        {cardContent.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg px-4 py-6 flex items-center gap-4 w-full hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
          >
            <div className="text-3xl text-blue-500">{card.icon}</div>
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
