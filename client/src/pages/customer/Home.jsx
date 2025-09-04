import React, { useState, useMemo, useEffect } from "react";
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
  FaSearch,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BusinessProfile from "./BusinessProfile";
import api from "../../components/config/api";
import { toast } from "react-toastify";

// Service Categories
const serviceCategories = [
  { id: "all", name: "All Services", icon: FaCar, color: "blue" },
  { id: "car_wash", name: "Car Wash", icon: FaTint, color: "cyan" },
  { id: "detailing", name: "Detailing", icon: IoSparkles, color: "yellow" },
  {
    id: "interior_cleaning",
    name: "Interior",
    icon: FaCarSide,
    color: "purple",
  },
  { id: "repairs", name: "Repairs", icon: FaWrench, color: "red" },
  {
    id: "paint_protection",
    name: "Paint Care",
    icon: FaPalette,
    color: "green",
  },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/business/businesses/");
        setBusinesses(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching businesses:", error);
        toast.error("Failed to load businesses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Filtered list
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      // Safe access to business properties
      const businessName = business.name || "";
      const businessLocation = business.location || "";
      const businessServices = business.services || [];

      const matchesSearch =
        businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        businessServices.some((service) => {
          const serviceName = service.service_name || "";
          return serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        });

      const matchesCategory =
        selectedCategory === "all" ||
        businessServices.some((service) => {
          const serviceName = service.service_name || "";
          return (
            serviceName.toLowerCase().replace(/\s+/g, "_") === selectedCategory
          );
        });

      const matchesLocation =
        !selectedLocation ||
        businessLocation.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchTerm, selectedCategory, selectedLocation, businesses]);

  const handleBookService = async (business) => {
    const id = business.id
   
    try {
      setIsLoading(true);
      const response = await api.get(`/business/businesses/${id}`);
      const businessDetails = response.data;

      navigate(`/business/${business.id}`, {
        state: {
          business: businessDetails,
        },
      });
    } catch (error) {
      console.log("Error fetchin business details:", error);
      toast.error("Failed to load business details.");
      navigate(`/business/${business.id}`, {
        state: {
          business: business,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Header />

      <section className="py-12 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find the Best Car Services Near You
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover trusted car wash, detailing, and repair services in your
            area. Book instantly and get your car looking brand new.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for services, locations, or businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-4 border border-gray-300 rounded-full shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCategory === "all"
                ? "All Service Providers"
                : `${
                    serviceCategories.find((c) => c.id === selectedCategory)
                      ?.name
                  } Providers`}
              <span className="text-gray-500 text-lg font-normal ml-2">
                ({filteredBusinesses.length} found)
              </span>
            </h3>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-6 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 text-gray-800 outline-none"
            >
              <option value="">All Areas</option>
              <option value="nairobi">Nairobi</option>
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
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 rounded-t-xl overflow-hidden">
                    <img
                      src={
                        business.business_gallery ||
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
                      }
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        business.is_mobile === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {business.is_mobile === 1
                        ? "Mobile Service"
                        : "Fixed Location"}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                        business.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {business.is_active ? "Open Now" : "Closed"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {business.business_name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {business.rating || "4.5"}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({business.review_count || 0})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="text-sm">
                        {business.location || "Nairobi"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {business.services &&
                        business.services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {service.service_name}
                          </span>
                        ))}
                      {business.services && business.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{business.services.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-600">
                          Starting prices from
                        </span>
                        <p className="font-semibold">
                          KSh{" "}
                          {business.services && business.services.length > 0
                            ? Math.min(
                                ...business.services.map((s) => s.price || 0)
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBookService(business)}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:cursor-pointer transition-colors"
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
