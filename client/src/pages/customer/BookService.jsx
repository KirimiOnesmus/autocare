import React, { useState, useEffect, useCallback } from "react";
import { FaRegClock, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../components/config/api";

const BookService = ({ service, onClose, business, serviceIcon }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    carModel: "",
    licensePlate: "",
    notes: "",
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    console.log("User:",userData)
    if (userData) {
      const user = JSON.parse(userData);
      setCustomerId(user.customerId || user.id);
    }
  }, []);

  // Convert the array format to an object with day names as keys
  const getBusinessHoursByDay = useCallback(() => {
    if (
      !business ||
      !business.business_hours ||
      !Array.isArray(business.business_hours)
    ) {
      return {};
    }

    const hoursByDay = {};
    business.business_hours.forEach((day) => {
      hoursByDay[day.day_of_week] = {
        open_time: day.open_time,
        close_time: day.close_time,
        is_closed: day.is_closed,
      };
    });

    return hoursByDay;
  }, [business]);

  const generateAvailableDates = useCallback(() => {
    const dates = [];
    const today = new Date();

    const businessHoursByDay = getBusinessHoursByDay();

    // Check if we have business hours data
    if (Object.keys(businessHoursByDay).length === 0) {
      console.log("No business hours data available");
      setAvailableDates(dates);
      return;
    }

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayOfWeek = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      // Safely access business hours
      const businessHours = businessHoursByDay[dayOfWeek];

      if (
        businessHours &&
        businessHours.is_closed !== 1 &&
        businessHours.open_time
      ) {
        // For today's date, check if business is still open
        if (i === 0) {
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();

          const [openHour, openMinute] = businessHours.open_time
            .split(":")
            .map(Number);
          const [closeHour, closeMinute] = businessHours.close_time
            .split(":")
            .map(Number);

          // Convert current time and business hours to minutes for easier comparison
          const currentTimeInMinutes = currentHour * 60 + currentMinute;
          const closeTimeInMinutes = closeHour * 60 + closeMinute;

          // If current time is before closing time (minus 2 hours for drop-off), include today
          if (currentTimeInMinutes < closeTimeInMinutes - 120) {
            dates.push({
              date: date.toISOString().split("T")[0],
              display:
                "Today, " +
                date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
              dayName: dayOfWeek,
            });
          }
        } else {
          // For future dates, just add them
          dates.push({
            date: date.toISOString().split("T")[0],
            display: date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            dayName: dayOfWeek,
          });
        }
      }
    }

    setAvailableDates(dates);
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].date);
    }
  }, [business, selectedDate, getBusinessHoursByDay]);

  const generateAvailableTime = useCallback(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const businessHoursByDay = getBusinessHoursByDay();
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Safely access business hours
    const businessHours = businessHoursByDay[dayOfWeek];

    if (
      !businessHours ||
      businessHours.is_closed === 1 ||
      !businessHours.open_time
    ) {
      setAvailableTimes([]);
      return;
    }

    const times = [];
    const [openHour, openMinute] = businessHours.open_time
      .split(":")
      .map(Number);
    const [closeHour, closeMinute] = businessHours.close_time
      .split(":")
      .map(Number);

    // Garage accepts cars from opening time until 1 hours before closing
    const latestDropOffHour = closeHour - 1;

    let currentHour = openHour;
    let currentMinute = openMinute;

    // For today's date, start from current time if it's later than opening time
    const today = new Date();
    const isToday = selectedDate === today.toISOString().split("T")[0];

    if (isToday) {
      const currentHours = today.getHours();
      const currentMinutes = today.getMinutes();

      // If current time is after opening time, start from the next available slot
      if (
        currentHours > openHour ||
        (currentHours === openHour && currentMinutes > openMinute)
      ) {
        currentHour = currentHours;
        currentMinute = Math.ceil(currentMinutes / 30) * 30; // Round up to next 30-minute interval

        if (currentMinute >= 60) {
          currentHour += 1;
          currentMinute = 0;
        }
      }
    }

    // Generate time slots every 30 minutes
    while (
      currentHour < latestDropOffHour ||
      (currentHour === latestDropOffHour && currentMinute === 0)
    ) {
      const timeString = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
      times.push(timeString);

      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }

    setAvailableTimes(times);

    // Auto-select the first available time if none is selected
    if (times.length > 0 && !selectedTime) {
      setSelectedTime(times[0]);
    }
  }, [selectedDate, selectedTime, getBusinessHoursByDay]);

  // Calculate estimated completion time
  useEffect(() => {
    if (selectedDate && selectedTime && service && service.duration) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);

      // Add service duration plus 1-hour buffer for potential delays
      const endTime = new Date(
        startTime.getTime() + (service.duration + 60) * 60000
      );

      // Format the estimated completion time
      const options = { hour: "2-digit", minute: "2-digit" };
      setEstimatedCompletion(endTime.toLocaleTimeString([], options));
    } else {
      setEstimatedCompletion("");
    }
  }, [selectedDate, selectedTime, service]);

  // Generate available dates when business changes
  useEffect(() => {
    generateAvailableDates();
  }, [business, generateAvailableDates]);

  // Generate available times when selected date or business changes
  useEffect(() => {
    generateAvailableTime();
  }, [selectedDate, generateAvailableTime]);

  const handleBooking = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !customerInfo.carModel ||
      !customerInfo.licensePlate ||
      !customerId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        service_id: service.id,
        business_id: business.id,
        customer_id: customerId,
        booking_date: selectedDate,
        booking_time: selectedTime,
        estimated_duration: service.duration || 60,
        original_price: service.price,
        final_price: service.price,
        customer_notes: customerInfo.notes,
        license_plate: customerInfo.licensePlate,
        car_model: customerInfo.carModel,
      };

      console.log("Sending booking data:", bookingData);

      const response = await api.post("/bookings/", bookingData);
      // const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to create booking");
        // console.log(result.error);
      }
      setTimeout(() => {
        const formattedDate = new Date(selectedDate).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        toast.success(
          `Booking confirmed for ${service.service_name} on ${formattedDate} at ${selectedTime}`
        );
        onClose();
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ServiceIcon = serviceIcon;

  // Fallback if no business hours are available
  const businessHoursByDay = getBusinessHoursByDay();
  if (Object.keys(businessHoursByDay).length === 0) {
    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Book {service.service_name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-600 text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-center py-8">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Booking Unavailable
            </h3>
            <p className="text-gray-600">
              We're sorry, but booking information is currently unavailable for
              this business. Please try again later or contact the business
              directly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Book {service.service_name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 text-xl cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            {ServiceIcon && <ServiceIcon className="h-5 w-5 text-blue-600" />}
            <span className="font-semibold text-gray-900">
              {service.service_name}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {service.description || "Professional automotive service"}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <FaRegClock className="h-4 w-4 text-gray-600" />
              {service.duration || 60} mins
            </span>
            <span className="flex items-center gap-1 font-semibold text-blue-600">
              <MdOutlineAttachMoney className="h-4 w-4" />
              KES {service.price ? service.price.toLocaleString() : "N/A"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Service times are estimates. Your vehicle
              may be ready later than expected if additional work is needed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="inline h-4 w-4 mr-1" />
                Drop-off Date *
              </label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(""); // Reset time when date changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                required
              >
                {availableDates.map((date) => (
                  <option key={date.date} value={date.date}>
                    {date.display}
                  </option>
                ))}
              </select>
              {availableDates.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No available dates in the next 7 days
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaRegClock className="inline h-4 w-4 mr-1" />
                Drop-off Time *
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                required
                disabled={!selectedDate || availableTimes.length === 0}
              >
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                ) : (
                  <option value="">No available times</option>
                )}
              </select>
              {availableTimes.length === 0 && selectedDate && (
                <p className="text-xs text-red-500 mt-1">
                  No available times for this date
                </p>
              )}
            </div>
          </div>

          {estimatedCompletion && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Estimated Completion:</strong> Around{" "}
                {estimatedCompletion} (subject to change)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Model *
            </label>
            <input
              type="text"
              value={customerInfo.carModel}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, carModel: e.target.value })
              }
              placeholder="Toyota Camry 2020"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate
            </label>
            <input
              type="text"
              value={customerInfo.licensePlate}
              onChange={(e) =>
                setCustomerInfo({
                  ...customerInfo,
                  licensePlate: e.target.value,
                })
              }
              placeholder="KDA 123A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={customerInfo.notes}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special requirements..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between font-semibold">
              <span>Total Amount:</span>
              <span className="text-blue-600">
                KES {service.price ? service.price.toLocaleString() : "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Final cost may vary if additional repairs are needed. We will
              contact you for approval before any extra work.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-red-500 cursor-pointer hover:border-red-500 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={
                isLoading ||
                !selectedDate ||
                !selectedTime ||
                availableTimes.length === 0
              }
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:text-blue-600 cursor-pointer hover:border border-blue-500 hover:bg-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 bg-white"></div>
                  Processing...
                </span>
              ) : (
                "Book Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
