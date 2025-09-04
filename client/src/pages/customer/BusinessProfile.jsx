import React, { useState, useEffect } from "react";
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
import { GiCarWheel, GiConsoleController } from "react-icons/gi";
import { LuDatabaseZap, LuCircleCheckBig } from "react-icons/lu";
import { PiEngineFill } from "react-icons/pi";
import { useLocation, useParams } from "react-router-dom";
import api from "../../components/config/api";
import { toast } from "react-toastify";

const BusinessProfile = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { id } = useParams();
  // const [showReviewForm, setShowReviewForm] = useState(false);
  // const [reviewData, setReviewData] = useState({
  //   rating: 5,
  //   review_text: "",
  //   booking_id: "",
  //   staff_id: ""
  // });
  //const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const serviceIcons = {
    car_wash: MdOutlineLocalCarWash,
    detailing: IoShieldSharp,
    interior_cleaning: FaCarSide,
    repairs: MdEngineering,
    paint_protection: PiEngineFill,
    default: GiCarWheel,
  };

  useEffect(() => {
    const fetchBusinessesDetails = async () => {
      try {
        setIsLoading(true);
        if (location.state?.business) {
          setBusiness(location.state.business);
          console.log("busisness details:", location.state.business);
        } else {
          const response = await api.get(`/business/businesses/${id}`);
          setBusiness(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log("Error fetching business details:", error);
        toast.error("Failed to load business details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinessesDetails();
  }, [id, location.state]);

  const formatDate = (dataString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dataString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Business not found
          </h2>
          <p className="text-gray-600 mt-2">
            The business you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="relative h-80">
          <img
            src={
              business.business_gallery ||
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
            }
            alt={business.business_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {business.is_mobile === 1 ? (
                <MdPhoneIphone className="h-5 w-5" />
              ) : (
                <FaMapMarkedAlt className="h-5 w-5" />
              )}

              <span className="text-sm text-blue-500 font-medium capitalize bg-opacity-20 px-2 py-1 rounded">
                {business.is_mobile === 1 ? "Mobile" : "Fixed Location"} Service
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {business.business_name}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <IoIosStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {business.rating || "4.5"}
                </span>
                <span className="opacity-80">
                  ({business.review_count || 0} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaMapMarkedAlt className="h-4 w-4" />
                <span>{business.location || "Nairobi"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-4 w-full">
          <div className="lg:col-span-full space-y-6 w-full">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                About {business.business_name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {business.description}
              </p>

              {/* <div className="grid md:grid-cols-2 gap-6">
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
              </div> */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MdEngineering className="h-5 w-5 text-blue-600" />
                  Our Team
                </h3>
                <div className="space-y-2">
                  {/* <div className="text-sm">
                    <div className="font-medium">
                      {business.owner.name} (Owner)
                    </div>
                    <div className="text-gray-600">
                      {business.owner.experience}
                    </div>
                  </div> */}
                  {business.staff.slice(0, 10).map((staff, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">
                        {staff.name}{" "}
                        <span className="italic text-gray-700">
                          ({staff.contact})
                        </span>
                      </div>
                      <div className="text-gray-600">{staff.proffession}</div>
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
                {business.services &&
                  business.services.map((service) => {
                    const ServiceIcon =
                      serviceIcons[service.service_type] ||
                      serviceIcons.default;

                    return (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <ServiceIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {service.service_name}
                                  </h3>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">
                                  {service.description ||
                                    "No description available"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FaRegClock className="h-4 w-4" />
                                  {service.duration || 30} mins
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-blue-500">
                                  <MdOutlineAttachMoney className="h-4 w-4" />
                                  KES{" "}
                                  {service.price
                                    ? service.price.toLocaleString()
                                    : "N/A"}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowBookingModal(true);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-colors"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
            {/* Hours Tab */}
            {activeTab === "hours" && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg mb-4">Working Hours</h3>
                {Object.entries(business.business_hours).map(([day_of_week, business_hours]) => (
                  <div
                    key={day_of_week}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium capitalize text-gray-900">
                      {business_hours.day_of_week}
                    </span>
                    <span className="text-gray-600">
                      {business_hours.is_closed === 1 ? (
                        <span className="text-red-500">Closed</span>
                      ) : (
                        `${business_hours.open_time} - ${business_hours.close_time}`
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
                        {business.rating || "0"} out of 5 (
                        {business.review_count || 0}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {business.reviews && business.reviews.length > 0 ? (
                    business.reviews.map((review) => (
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
                                  {review.customer_name || "Anonymous Customer"}
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
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(review.create_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.review_text}
                        </p>

                        {review.booking_date && (
                          <div className="mt-2 text-xs text-gray-500">
                            Service date: {formatDate(review.booking_date)}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaUser className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>
                        No reviews yet. Be the first to review this business!
                      </p>
                    </div>
                  )}
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
                <span className="text-gray-700">{business.location}</span>
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
                <IoMdMail className="h-4 w-4" />
                Contact Business
              </button>
            </div>
          </div>
        </div>
      </div>
      {showBookingModal && selectedService && (
        <BookService
          service={selectedService}
          business ={business}
          onClose={() => {
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
