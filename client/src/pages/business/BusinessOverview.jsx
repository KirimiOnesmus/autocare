import React from "react";
import Card from "../../components/layout/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const BusinessOverview = () => {
  // Sample booking data for the line graph
  const bookingData = [
    { date: "Week 1", bookings: 45, revenue: 2250 },
    { date: "Week 2", bookings: 52, revenue: 2600 },
    { date: "Week 3", bookings: 38, revenue: 1900 },
    { date: "Week 4", bookings: 67, revenue: 3350 },
  ];
  const staffData = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Mechanic",
      bookingsCompleted: 48,
      revenue: "2,400",
      rating: 4.8,
      efficiency: "92%",
    },
    {
      id: 2,
      name: "Bob Smith",
      role: "Wrapper",
      bookingsCompleted: 42,
      revenue: "2,100",
      rating: 4.6,
      efficiency: "88%",
    },
    {
      id: 3,
      name: "Carol Davis",
      role: "Detailer",
      bookingsCompleted: 35,
      revenue: "1,750",
      rating: 4.9,
      efficiency: "95%",
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Technician",
      bookingsCompleted: 28,
      revenue: "1,960",
      rating: 4.7,
      efficiency: "90%",
    },
  ];
  return (
    <div className="w-full p-4 bg-gray-50 ">
      {/* The business name */}
      <h1 className="text-3xl font-bold mb-4">Business Overview</h1>
      <Card className="w-full" />
      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-4">
          Recent Activities
          <span className="text-gray-500 text-sm"> (Last 30 days)</span>
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                  name="Booking"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  name="Revenue (Ksh)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </h2>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-4">Staff Performance</h2>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-200">
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Bookings Completed</th>
                        <th className="px-4 py-2 text-left">Revenue(Ksh)</th>
                        <th className="px-4 py-2 text-left">Rating</th>
                        <th className="px-4 py-2 text-left">Efficiency</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {staffData.map((staff) => (
                        <tr key={staff.id} className=" hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-2 whitespace-nowrap">{staff.name}</td>
                            <td className="px-4 py-2">{staff.role}</td>
                            <td className="px-4 py-2">{staff.bookingsCompleted}</td>
                            <td className="px-4 py-2">{staff.revenue}</td>
                            <td className="px-4 py-2">{staff.rating}</td>
                            <td className="px-4 py-2">{staff.efficiency}</td>
                        </tr>
                    )
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverview;
