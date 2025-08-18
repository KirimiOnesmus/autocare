import React, { useState, useMemo } from "react";
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
import { CSVLink } from "react-csv";
import { format, parseISO, startOfWeek, startOfMonth } from "date-fns";

const BusinessReports = () => {
  const bookingData = [
    { date: "2025-08-01", service: "Car Wash", staff: "John", bookings: 10, revenue: 500 },
    { date: "2025-08-02", service: "Detailing", staff: "Jane", bookings: 15, revenue: 750 },
    { date: "2025-08-03", service: "Car Wash", staff: "John", bookings: 12, revenue: 600 },
    { date: "2025-08-04", service: "Detailing", staff: "Jane", bookings: 20, revenue: 1000 },
    // Add more sample data
  ];

  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [staffFilter, setStaffFilter] = useState("All Staff");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("week"); // "week" or "month"

  const services = ["All Services", ...new Set(bookingData.map((b) => b.service))];
  const staff = ["All Staff", ...new Set(bookingData.map((b) => b.staff))];

  // Filtered data based on selections
  const filteredData = useMemo(() => {
    return bookingData.filter((item) => {
      const date = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (
        (serviceFilter === "All Services" || item.service === serviceFilter) &&
        (staffFilter === "All Staff" || item.staff === staffFilter) &&
        (!start || date >= start) &&
        (!end || date <= end)
      );
    });
  }, [serviceFilter, staffFilter, startDate, endDate]);

  // Group data for chart
  const groupedData = useMemo(() => {
    const groups = {};

    filteredData.forEach((item) => {
      const dateObj = parseISO(item.date);
      const key =
        groupBy === "week"
          ? format(startOfWeek(dateObj, { weekStartsOn: 1 }), "yyyy-'W'II")
          : format(startOfMonth(dateObj), "yyyy-MM");

      if (!groups[key]) groups[key] = { date: key, bookings: 0, revenue: 0 };
      groups[key].bookings += item.bookings;
      groups[key].revenue += item.revenue;
    });

    return Object.values(groups);
  }, [filteredData, groupBy]);

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Business Analytics</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex flex-col">
          <label>Services</label>
          <select
            className="border p-2 rounded min-w-[150px]"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Staff</label>
          <select
            className="border p-2 rounded min-w-[150px]"
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
          >
            {staff.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Start Date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label>End Date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label>Group By</label>
          <select
            className="border p-2 rounded min-w-[150px]"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <CSVLink
          data={filteredData}
          filename="business_report.csv"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-4"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Chart & Table */}
      <Card className="w-full p-4 flex flex-col gap-6">
        {/* Chart */}
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={groupedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                name="Bookings"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Service</th>
                <th className="py-2 px-4 border">Staff</th>
                <th className="py-2 px-4 border">Bookings</th>
                <th className="py-2 px-4 border">Revenue (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={i}>
                  <td className="py-2 px-4 border">{item.date}</td>
                  <td className="py-2 px-4 border">{item.service}</td>
                  <td className="py-2 px-4 border">{item.staff}</td>
                  <td className="py-2 px-4 border">{item.bookings}</td>
                  <td className="py-2 px-4 border">{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BusinessReports;
