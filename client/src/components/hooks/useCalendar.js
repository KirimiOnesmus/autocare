import { useState } from "react";

export const generateCalendarDays = (year, month, data = []) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

  const days = [];

  // Count bookings per date
  const bookingsByDate = {};
  data.forEach(booking => {
    if (booking.date) {
      try {
        const bookingDate = new Date(booking.date);
        // Format as YYYY-MM-DD for comparison
        const dateKey = bookingDate.toISOString().split('T')[0];
        bookingsByDate[dateKey] = (bookingsByDate[dateKey] || 0) + 1;
      } catch (e) {
        console.error("Invalid date format:", booking.date);
      }
    }
  });

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dataCount = bookingsByDate[dateStr] || 0;
    const hasData = dataCount > 0;
    
    days.push({ day, dateStr, hasData, dataCount });
  }

  return days;
};

export const useCalendar = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [data, setData] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  return {
    year,
    month,
    currentDate,
    goToNextMonth: nextMonth,
    goToPrevMonth: prevMonth,
    setData,
    data
  };
};