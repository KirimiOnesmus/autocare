import React, { useState } from "react";
import { MdLocalPrintshop,MdDoneAll  } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";

const dummyAssignments = [
  {
    id: "ASG001",
    customer: "John Doe",
    service: "Engine Diagnosis",
    date: "2025-08-15",
    time: "10:00 AM",
    status: "InProgress",
  },
  {
    id: "ASG002",
    customer: "Jane Smith",
    service: "Car Wash",
    date: "2025-08-08",
    time: "02:00 PM",
    status: "InProgress",
  },
  {
    id: "ASG003",
    customer: "Peter Mwangi",
    service: "Interior Cleaning",
    date: "2025-07-31",
    time: "09:30 AM",
    status: "Completed",
  },
];

const Assignment = () => {
  const [activeTab, setActiveTab] = useState("InProgress");

  const filteredAssignments = dummyAssignments.filter(
    (asg) => asg.status === activeTab
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-2">Assignment Bookings</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Manage your assignments of the month here. Kindly print at the end of
          the month.
        </p>
        <MdLocalPrintshop
          title="Print"
          onClick={handlePrint}
          className="bg-blue-600 text-white cursor-pointer hover:bg-white hover:text-blue-600 hover:border border-blue-600 rounded-full p-1 text-3xl sm:text-4xl transition-colors"
        />
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        {["InProgress", "Completed"].map((tab) => (
          <p
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer text-xl font-semibold ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab === "InProgress" ? "In Progress" : "Completed"}
          </p>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              {[
                "Assignment ID",
                "Customer Name",
                "Service",
                "Date",
                "Time",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((item) => (
              <tr key={item.id} className="border-b border-gray-300 last:border-none">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.customer}</td>
                <td className="px-6 py-4">{item.service}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">{item.time}</td>
                <td className="px-6 py-4">{item.status}</td>
                <td className="px-6 py-4 space-x-4 text-lg">
                  <button className="text-blue-600 hover:underline cursor-pointer"><FaEye title="View Details" /></button>
                  {item.status === "InProgress" && (
                    <>
                      <button className="text-yellow-600 hover:underline cursor-pointer">
                       <LuCalendarClock title="Reschedule" />
                      </button>
                      <button className="text-green-600 hover:underline cursor-pointer">
                       <MdDoneAll title="Mark as done"/>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredAssignments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignment;
