import React, { useState, useMemo } from "react";
import Header from "../../components/layout/Header";
import {
  FaMapMarkerAlt,
  FaStar,
  FaCar,
  FaTint,
  FaCarSide,
  FaWrench,
  FaPalette,
  FaCalendarAlt,
  FaPhone,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
// Sample Data
const sampleBusinesses = [
  {
    id: 1,
    name: "Premium Auto Detailing",
    type: "mobile",
    rating: 4.8,
    reviews: 127,
    location: "Westlands, Nairobi",
    distance: "2.3 km",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    services: ["Car Wash", "Interior Cleaning", "Detailing"],
    priceRange: "KSh 1,500 - 8,000",
    isOpen: true,
    nextAvailable: "Today 2:00 PM",
  },
  {
    id: 2,
    name: "QuickFix Garage",
    type: "stationary",
    rating: 4.6,
    reviews: 89,
    location: "Kilimani, Nairobi",
    distance: "3.1 km",
    image:
      "https://images.unsplash.com/photo-1632294128358-9104e4cbac65?w=400",
    services: ["Repairs", "Wheel Alignment", "Oil Change"],
    priceRange: "KSh 800 - 15,000",
    isOpen: false,
    nextAvailable: "Tomorrow 8:00 AM",
  },
  {
    id: 3,
    name: "Sparkle Car Wash",
    type: "mobile",
    rating: 4.9,
    reviews: 203,
    location: "Karen, Nairobi",
    distance: "5.2 km",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400",
    services: ["Car Wash", "Waxing", "Paint Protection"],
    priceRange: "KSh 1,200 - 6,000",
    isOpen: true,
    nextAvailable: "Today 4:30 PM",
  },
];

// Service Categories
const serviceCategories = [
  { id: "all", name: "All Services", icon: FaCar, color: "blue" },
  { id: "car_wash", name: "Car Wash", icon: FaTint, color: "cyan" },
  { id: "detailing", name: "Detailing", icon: IoSparkles, color: "yellow" },
  { id: "interior_cleaning", name: "Interior", icon: FaCarSide, color: "purple" },
  { id: "repairs", name: "Repairs", icon: FaWrench, color: "red" },
  { id: "paint_protection", name: "Paint Care", icon: FaPalette, color: "green" },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

  // Filtered list
  const filteredBusinesses = useMemo(() => {
    return sampleBusinesses.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.services.some((service) =>
          service.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" ||
        business.services.some(
          (service) =>
            service.toLowerCase().replace(/\s+/g, "_") === selectedCategory
        );

      const matchesLocation =
        !selectedLocation ||
        business.location.toLowerCase().includes(selectedLocation);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchTerm, selectedCategory, selectedLocation]);

  // Simulate search
//   const handleSearch = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//   };

  const handleBookService = (businessId) => {
    console.log("Booking service for:", businessId);
  };

  return (
    <div>
       <Header />

 
      <section className="py-12 ">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 ">
            Browse by Service
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-2 rounded-xl border hover:cursor-pointer ${
                    isSelected
                      ? `border-${category.color}-500 bg-${category.color}-50`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 mx-auto mb-3 flex items-center justify-center rounded-lg ${
                      isSelected
                        ? `text-${category.color}-500 `
                        : ` text-${category.color}-600`
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected
                        ? `text-${category.color}-700`
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCategory === "all"
                ? "All Service Providers"
                : `${serviceCategories.find((c) => c.id === selectedCategory)?.name} Providers`}
            </h3>
             <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className=" px-6 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 text-gray-800 outline-none"
              >
                <option value="">All Areas</option>
                <option value="westlands">Westlands</option>
                <option value="kilimani">Kilimani</option>
                <option value="karen">Karen</option>
                <option value="eastlands">Eastlands</option>
              </select>
          </div>

          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
                >
                  <div className="relative h-48 rounded-t-xl overflow-hidden">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        business.type === "mobile"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {business.type === "mobile"
                        ? "Mobile Service"
                        : "Fixed Location"}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                        business.isOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {business.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {business.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {business.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({business.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="text-sm">{business.location}</span>
                      <span className="text-sm">• {business.distance}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {business.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {business.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{business.services.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Price Range</span>
                        <p className="font-semibold">{business.priceRange}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          Next Available
                        </span>
                        <p className="font-semibold text-sm">
                          {business.nextAvailable}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBookService(business.id)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
                      >
                        <FaCalendarAlt /> Book Now
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaSearch className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No providers found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse different
                categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedLocation("");
                }}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
