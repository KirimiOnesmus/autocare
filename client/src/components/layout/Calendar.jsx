import React, { useState } from "react";
import { useCalendar, generateCalendarDays } from "../hooks/useCalendar";

const Calendar = ({ data = [], onDateClick }) => {
  const { year, month, currentDate, goToNextMonth, goToPrevMonth } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(null);

  const days = generateCalendarDays(year, month, data);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleSelect = (item) => {
    const formatted = new Date(item.dateStr).toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setSelectedDate(formatted);
    onDateClick(formatted);
  };

  return (
    <div className="calendar-container p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className="bg-blue-500 py-2 px-6 rounded-lg text-white
        hover:text-blue-500 hover:bg-white hover:border border-blue-500 hover:cursor-pointer">
        Prev</button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={goToNextMonth}
        className="bg-blue-500 py-2 px-6 rounded-lg text-white
        hover:text-blue-500 hover:bg-white hover:border border-blue-500 hover:cursor-pointer"
        >Next</button>
      </div>

        {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center font-semibold">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Cells */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item, index) =>
          item ? (
            <div
              key={index}
              className={` px-2 py-6 text-center relative cursor-pointer rounded font-semibold hover:bg-blue-100
              hover:text-blue-600 transition-colors duration-200
                ${
                  selectedDate ===
                  new Date(item.dateStr).toLocaleDateString("default", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              onClick={() => handleSelect(item)}
            >
              {item.day}

              {item.hasData && (
                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs px-1">
                  {item.dataCount}
                </span>
              )}
            </div>
          ) : (
            <div key={index} className="p-2"></div>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;
