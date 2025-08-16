import React, {useState}from 'react'
import {  FaRegClock} from "react-icons/fa";
import{MdOutlineAttachMoney} from "react-icons/md";
const BookService = ({ service, onClose }) => {
      const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
      name: '',
      phone: '',
      email: '',
      carModel: '',
      notes: ''
    });

    const availableTimes = [
      '08:00', '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const handleBooking = () => {
      if (!selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone || !customerInfo.carModel) {
        alert('Please fill in all required fields');
        return;
      }
      alert(`Booking confirmed for ${service.name} on ${selectedDate} at ${selectedTime}`);
      onClose();
    };
  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white  p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Book {service.name}</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-xl cursor-pointer">
              X
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <service.icon className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">{service.name}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <FaRegClock className="h-4 w-4 text-gray-600" />
                {service.duration} mins
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                
                KES {service.price.toLocaleString()}
              </span>
            </div>
          </div>

                      <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-none cursor-pointer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-none cursor-pointer"
                  required
                >
                  <option value="">Select time</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-none cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                placeholder="+254700000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-none cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
              <input
                type="text"
                value={customerInfo.carModel}
                onChange={(e) => setCustomerInfo({...customerInfo, carModel: e.target.value})}
                placeholder="Toyota Camry 2020"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-none cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
              <textarea
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-blue-500 focus:border-none cursor-pointer"
                placeholder="Any special requirements..."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Amount:</span>
                <span className="text-blue-600">KES {service.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Payment via M-Pesa upon confirmation</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-red-500 hover:border-red-500 hover:cursor-pointer transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:cursor-pointer border-blue-500 transition-all duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default BookService