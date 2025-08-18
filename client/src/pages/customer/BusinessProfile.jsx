import React, { useState } from "react";
import Header from "../../components/layout/Header";
import BookService from "./BookService";
import HomeButton from "../../components/layout/HomeButton";

import {
  MdOutlineLocalCarWash,
  MdPhoneIphone,
  MdEngineering,
  MdOutlineAttachMoney,
  MdLocalPhone,
} from "react-icons/md";
import { FaCarSide, FaMapMarkedAlt, FaRegClock, FaUser } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import { IoShieldSharp } from "react-icons/io5";
import { IoIosStar, IoMdMail } from "react-icons/io";
import { GiCarWheel } from "react-icons/gi";
import { LuDatabaseZap, LuCircleCheckBig } from "react-icons/lu";
import { PiEngineFill } from "react-icons/pi";
const BusinessProfile = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  const business = {
    id: 1,
    name: "Premier Auto Spa",
    type: "stationary",
    description:
      "Premium car care services with over 10 years of experience. We specialize in paint protection, detailing, and comprehensive car maintenance services.",
    location: "Westlands Plaza, Nairobi",
    fullAddress: "Westlands Plaza, Ground Floor, Shop 12, Nairobi",
    coordinates: { lat: -1.2676, lng: 36.8108 },
    phone: "+254700123456",
    email: "info@premierautospa.com",
    website: "www.premierautospa.com",
    rating: 4.8,
    reviewCount: 247,
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=400&fit=crop",
    services: [
      {
        id: 1,
        name: "Full Car Wash",
        price: 800,
        duration: 45,
        description:
          "Complete exterior and interior cleaning with premium products",
        icon: MdOutlineLocalCarWash,
        popular: true,
      },
      {
        id: 2,
        name: "Interior Detailing",
        price: 1500,
        duration: 90,
        description:
          "Deep cleaning of seats, carpets, dashboard, and all interior surfaces",
        icon: FaCarSide,
      },
      {
        id: 3,
        name: "Paint Protection",
        price: 5000,
        duration: 180,
        description: "Ceramic coating and paint protection film application",
        icon: IoShieldSharp,
        premium: true,
      },
      {
        id: 4,
        name: "Wheel Alignment",
        price: 2000,
        duration: 60,
        description: "Professional wheel alignment and balancing service",
        icon: GiCarWheel,
      },
      {
        id: 5,
        name: "Polishing & Waxing",
        price: 2500,
        duration: 120,
        description:
          "Premium polishing and protective waxing for lasting shine",
        icon: LuDatabaseZap,
      },
      {
        id: 6,
        name: "Engine Cleaning",
        price: 1200,
        duration: 75,
        description: "Safe engine bay cleaning and degreasing",
        icon: PiEngineFill,
      },
    ],
    workingHours: {
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: false },
      saturday: { open: "08:00", close: "16:00", closed: false },
      sunday: { open: "09:00", close: "15:00", closed: false },
    },
    features: [
      "Free Wi-Fi",
      "Waiting Lounge",
      "Coffee & Refreshments",
      "CCTV Monitoring",
      "Insurance Coverage",
      "Mobile Service Available",
    ],
    owner: {
      name: "John Kamau",
      experience: "12+ years",
      certifications: ["ASE Certified", "Paint Protection Specialist"],
    },
    staff: [
      {
        name: "Peter Mwangi",
        role: "Senior Technician",
        experience: "8 years",
      },
      {
        name: "Grace Akinyi",
        role: "Detailing Specialist",
        experience: "5 years",
      },
      {
        name: "Samuel Kiprotich",
        role: "Paint Technician",
        experience: "6 years",
      },
    ],
    reviews: [
      {
        id: 1,
        customer: "David Ochieng",
        rating: 5,
        comment:
          "Excellent service! My car looks brand new after their paint protection service.",
        date: "2025-01-10",
        verified: true,
      },
      {
        id: 2,
        customer: "Sarah M.",
        rating: 5,
        comment:
          "Professional staff and great attention to detail. Highly recommended!",
        date: "2025-01-08",
        verified: true,
      },
      {
        id: 3,
        customer: "Michael K.",
        rating: 4,
        comment: "Good service, reasonable prices. Will definitely come back.",
        date: "2025-01-05",
        verified: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="relative h-80">
          <img
            src={business.image}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {business.type === "mobile" && (
                <MdPhoneIphone className="h-5 w-5" />
              )}
              {business.type === "stationary" && (
                <FaMapMarkedAlt className="h-5 w-5" />
              )}
              <span className="text-sm text-blue-500 font-medium capitalize bg-opacity-20 px-2 py-1 rounded">
                {business.type} Service
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <IoIosStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{business.rating}</span>
                <span className="opacity-80">
                  ({business.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaMapMarkedAlt className="h-4 w-4" />
                <span>{business.location}</span>
              </div>
            </div>
          </div>
        </div>
        {/* main content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-4 w-full">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                About {business.name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {business.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaAward className="h-5 w-5 text-blue-600" />
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {business.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <LuCircleCheckBig className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MdEngineering className="h-5 w-5 text-blue-600" />
                  Our Team
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">
                      {business.owner.name} (Owner)
                    </div>
                    <div className="text-gray-600">
                      {business.owner.experience}
                    </div>
                  </div>
                  {business.staff.slice(0, 2).map((staff, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-gray-600">
                        {staff.role} • {staff.experience}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">
          <div className="flex border-b">
            {["services", "hours", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-medium text-sm transition-colors hover:cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-600  border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6">
            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-4">
                {business.services.map((service) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <service.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {service.name}
                              </h3>
                              {service.popular && (
                                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                              {service.premium && (
                                <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaRegClock className="h-4 w-4" />
                              {service.duration} mins
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-blue-500">
                              <MdOutlineAttachMoney className="h-4 w-4" />
                              KES {service.price.toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setShowBookingModal(true);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-blue-500 hover:border border-blue-500  hover:cursor-pointer transition-colors"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Hours Tab */}
            {activeTab === "hours" && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg mb-4">Working Hours</h3>
                {Object.entries(business.workingHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium capitalize text-gray-900">
                      {day}
                    </span>
                    <span className="text-gray-600">
                      {hours.closed ? (
                        <span className="text-red-500">Closed</span>
                      ) : (
                        `${hours.open} - ${hours.close}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Customer Reviews</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IoIosStar
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(business.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {business.rating} out of 5 ({business.reviewCount}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {business.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FaUser className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {review.customer}
                              </span>
                              {review.verified && (
                                <LuCircleCheckBig className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <IoIosStar
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6 mt-4">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FaMapMarkedAlt className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{business.fullAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MdLocalPhone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${business.phone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {business.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <IoMdMail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${business.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {business.email}
                </a>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
        
              <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-white hover:text-blue-500  hover:border border-blue-500 hover:cursor-pointer transition-colors flex items-center justify-center gap-2">
                <FaMapMarkedAlt className="h-4 w-4" />
                Directions
              </button>
            </div>
          </div>
        </div>
      </div>
   {showBookingModal && selectedService &&(
    <BookService
    service={selectedService}
    onClose={()=>{
      setShowBookingModal(false);
      setSelectedService(null);
    }}
    />
   )}
   <HomeButton className="fixed bottom-6 right-6 z-50 shadow-lg hover:scale-105 transition-transform" />
    
    </div>
  );
};

export default BusinessProfile;


