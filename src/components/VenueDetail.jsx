import { useNavigate } from "react-router-dom";
import SelectReview from "./SelectReview"; // Ensure the correct path
import WriteReview from "./WriteReview";
import ReviewSuccess from "./ReviewSuccess.jsx";
import {useEffect, useRef, useState} from 'react';
import { Star } from 'lucide-react'; // Assuming lucide-react is needed for stars
import avatar1 from '../assets/avatar1.png'; // Example avatar image import
import { useLocation } from 'react-router-dom';
import VenueService from "../services/venue-service.js";
import L from 'leaflet';
import {getAllFieldsInVenue} from "../services/field-service.js";

function generateWeeklySchedule(date) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const schedule = [];
  let currentDay = new Date(date);
  let diff = currentDay.getDay() - 1; // 0 untuk Minggu, 1 untuk Senin, dst.
  if (diff < 0) {
    diff = 6; // Jika hari ini Minggu, mundur 6 hari
  }
  currentDay.setDate(currentDay.getDate() - diff);

  for (let i = 0; i < 7; i++) {
    const loopDate = new Date(currentDay); // Membuat salinan agar currentDay tidak berubah
    loopDate.setDate(currentDay.getDate() + i);

    const year = loopDate.getFullYear();
    const month = String(loopDate.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(loopDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayOfMonth}`;
    const formattedDay = `${dayOfMonth} ${getMonthName(loopDate.getMonth())}`;
    const dayName = daysOfWeek[loopDate.getDay()];

    schedule.push({
      date: formattedDate,
      day: formattedDay,
      dayName: dayName,
    });
  }

  return schedule;
}

function getMonthName(monthIndex) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[monthIndex];
}

const today = new Date();
const scheduleData = generateWeeklySchedule(today);

const timeSlots = [
  { time: "06:00 - 07:00" },
  { time: "07:00 - 08:00" },
  { time: "08:00 - 09:00" },
  { time: "09:00 - 10:00" },
  { time: "10:00 - 11:00" },
  { time: "11:00 - 12:00" },
  { time: "12:00 - 13:00" },
  { time: "13:00 - 14:00" },
  { time: "14:00 - 15:00" },
  { time: "15:00 - 16:00" },
  { time: "16:00 - 17:00" },
  { time: "17:00 - 18:00" },
  { time: "18:00 - 19:00" },
  { time: "19:00 - 20:00" },
  { time: "20:00 - 21:00" },
  { time: "21:00 - 22:00" },
  { time: "22:00 - 23:00" },
  { time: "23:00 - 00:00" },
];

// Custom Progress Bar component
function ProgressBar({ value }) {
  const progressBarStyle = {
    width: `${value}%`,
    height: "10px",
    backgroundColor: "#4caf50",
    borderRadius: "5px",
  };

  return (
      <div
          className="relative w-full bg-gray-200 rounded-full h-2.5"
          style={{ height: "8px", borderRadius: "5px" }}
      >
        <div style={progressBarStyle}></div>
      </div>
  );
}

export default function VenueDetail() {
  const { state } = useLocation();
  const venue = state?.venue

  const user = JSON.parse(localStorage.getItem("user"));
  const [fieldsInVenue, setFieldsInVenue] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFields = async () => {
      const data = await getAllFieldsInVenue(token, venue.id);
      data.data.map(e => console.log(e));
      setFieldsInVenue(data.data);
    }

    fetchFields();
  }, [token, venue.id])

  const MapComponent = ({ latitude, longitude }) => {
    const mapRef = useRef(null);

    useEffect(() => {
      if (mapRef.current && !mapRef.current._leaflet_id) {
        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([latitude, longitude]).addTo(map);

        return () => {
          if (map) {
            map.remove();
          }
        };
      }
    }, [latitude, longitude]);

    return <div ref={mapRef} className="w-full h-full" />;
  };


  const [selectedField, setSelectedField] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  function normalizeDate(date) {// Debug log
    if (!date || isNaN(new Date(date))) { // Check for invalid or undefined date
      return null; // Return null or handle invalid date appropriately
    }
    return new Date(date).toISOString().split("T")[0];
  }


  const handleFieldChange = (e) => {
    console.log("E: ",e.target.value);
    setSelectedField(e.target.value)
  };

// Fix the logic for selectedFieldSchedules

  const scheduleDetailsByField = fieldsInVenue.map((field) => {
    const flattenedFieldSchedules = field.field_schedules?.flat();
    return {
      fieldType: field.type,
      schedules:
          flattenedFieldSchedules?.map((scheduleItem) => {
            const normalizedDate = normalizeDate(scheduleItem.schedule?.date);
            if (!normalizedDate) {
              console.warn(`Skipping schedule with invalid date:`, scheduleItem);
              return null; // Skip invalid schedules
            }
            return {
              timeSlot: scheduleItem.schedule?.time_slot,
              status: scheduleItem.status.toLowerCase(), // Ensure status is lowercase
              date: normalizedDate, // Use normalized date
            };
          }).filter((schedule) => schedule !== null) || [], // Filter out invalid schedules
    };
  });

  const selectedFieldSchedules =
      scheduleDetailsByField.find((field) => {
        return field.fieldType === selectedField;
      })
          ?.schedules || [];

  {
    /* Reviews Section */
  }

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    if (fieldsInVenue.length > 0) {
      const reviews = fieldsInVenue.map((field) => field.reviews).flat();
      setReviews(reviews);
    }
  }, [fieldsInVenue]);


  useEffect(() => {
    console.log(`Reviews: ${reviews.length}`);
    reviews.map((review) => {
      if (review.user) {
        console.log('Review user keys:', Object.keys(review.user));  // Log the keys of user object
      }
    });
  }, [reviews]);

  // Combine all reviews from all fields
  const allReviews = reviews;

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  
  const [currentReviews, setCurrentReviews] = useState([])
  useEffect(() => {
    setCurrentReviews(allReviews?.slice(startIndex, endIndex));
  }, [allReviews, endIndex, reviews, startIndex]);

  const totalPages = Math.ceil(allReviews?.length / reviewsPerPage);

  const [isSelectReviewOpen, setIsSelectReviewOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityId, setFacilityId] = useState(null);

  const toggleSelectReviewModal = () => {
    setIsSelectReviewOpen(!isSelectReviewOpen);
  };

  const openWriteReviewModal = (facilityType, facilityId) => {
    setSelectedFacility(facilityType); // Set the selected facility type
    setFacilityId(facilityId); // Set the facility ID
    setIsSelectReviewOpen(false); // Close the SelectReview modal
    setIsWriteReviewOpen(true); // Open the WriteReview modal
  };

  const closeWriteReviewModal = () => {
    setIsWriteReviewOpen(false);
  };

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleReviewSubmitSuccess = () => {
    setIsWriteReviewOpen(false); // Close the WriteReview modal
    setIsSuccessModalOpen(true); // Open the success modal

    // Memuat ulang data review setelah berhasil submit
    const fetchReviews = async () => {
      const data = await getAllFieldsInVenue(token, venue.id);
      const reviews = data.data.map((field) => field.reviews).flat();
      setReviews(reviews);
    };

    fetchReviews(); // Memanggil fungsi fetch ulang
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the success modal
  };

  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  const handleBooking = () => {
    if (!selectedField) {
      alert("Please select a field.");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (!selectedTime) {
      alert("Please select a time slot.");
      return;
    }

    navigate("/payment", {
      state: {
        venue,
        field: selectedField,
        date: selectedDate,
        time: selectedTime,
        price: price,
      },
    });
  };

  const overallRating = fieldsInVenue.length > 0
      ? fieldsInVenue
          .filter((field) => field.reviews?.length > 0)
          .reduce((sum, field) => {
            // Flatten reviews untuk menghindari array dalam array
            const flattenedReviews = field.reviews?.flat();

            const totalReviews = flattenedReviews?.length;
            const averageFieldRating =
                flattenedReviews?.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

            return sum + averageFieldRating;
          }, 0) /
      fieldsInVenue.filter((field) => field.reviews?.length > 0).length
      : 0;


  // API nya belom ada
  // VenueService.updateRating(localStorage.getItem("token"),overallRating,venue.id)

  // Find the price for the selected field
  const selectedFieldData = fieldsInVenue.find(
      (field) => field.type === selectedField
  );
  const price = selectedFieldData ? selectedFieldData.price : 0;



  return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="relative h-[500px]">
          <img
              src={fieldsInVenue.length > 0 && fieldsInVenue[0].gallery?.length > 0 ? `http://localhost:8080${fieldsInVenue[0].gallery[0].photoUrl}` : "https://staticg.sportskeeda.com/editor/2022/11/a9ef8-16681658086025-1920.jpg"}
              alt="Progresif Sport Centre"
              className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
              <h1 className="text-4xl font-bold text-white mb-4">{venue.name}</h1>
              <p className="text-white/90 mb-6">
                {venue.street} - {venue.district}, {venue.city_or_regency},{" "}
                {venue.province}
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                {fieldsInVenue.map((field, j) => (
                    <span
                        key={j}
                        className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                    >
          {field.type}
        </span>
                ))}
                <button
                    className="ml-3 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                    onClick={() => navigate("/gallery", {state: {venue, fieldsInVenue}})}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Location Section */}
          <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">LOCATION</h2>
            <div className="h-[300px] bg-gray-200 rounded-lg mb-6">
              <a href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`} target="_blank"
                 rel="noopener noreferrer">
                <MapComponent latitude={venue.latitude} longitude={venue.longitude} />
              </a>
            </div>
          </div>

          {/* Booking Form */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex gap-4">
              {/* Field Selection */}
              <select
                  className="p-2 border border-gray-300 rounded-lg"
                  onChange={handleFieldChange}
                  value={selectedField}
              >
                <option value="" disabled>
                  Select Field
                </option>
                {fieldsInVenue.map((field, i) => (
                    <option key={i} value={field.type}>
                      {field.type}
                    </option>
                ))}
              </select>

              {/* Date Selection */}
              <select
                  className="p-2 border border-gray-300 rounded-lg"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  disabled={!selectedField}
              >
                <option value="" >
                  Select Date
                </option>
                {selectedField &&
                    scheduleData
                        // !TODO : SelectedFieldSchedules nya kosong
                        .filter((day) =>
                            selectedFieldSchedules
                                .sort((a, b) => {
                                  const aTime = a.timeSlot ? a.timeSlot.split(' - ')[0] : '';
                                  const bTime = b.timeSlot ? b.timeSlot.split(' - ')[0] : '';

                                  if (!aTime || !bTime) return 0;

                                  const [aStartHour, aStartMinute] = aTime.split(':').map(Number);
                                  const [bStartHour, bStartMinute] = bTime.split(':').map(Number);

                                  if (aStartHour !== bStartHour) return aStartHour - bStartHour;

                                  return aStartMinute - bStartMinute;
                                })
                                .some(
                                (s) => s.date === day.date && s.status === "available"
                            )

                        )
                        .map((availableDay, idx) => (
                            <option key={idx} value={availableDay.date}>
                              {availableDay.day}
                            </option>
                        ))}
              </select>

              {/* Time Slot Selection */}
              <select
                  className="p-2 border border-gray-300 rounded-lg"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value); // Update state
                  }}
                  disabled={!selectedField || !selectedDate} // Disable if no field or date is selected
              >
                <option value="" disabled>
                  Select Time
                </option>
                {selectedField &&
                    selectedFieldSchedules
                        // !TODO : SelectedFieldSchedules nya kosong
                        .filter(
                            (s) =>
                                s.date === normalizeDate(selectedDate) && // Ensure it matches the selected date
                                s.status === "available" // Ensure the status is "available"
                        )
                        .map((availableSlot, idx) => (
                            <option key={idx} value={availableSlot.timeSlot}>
                              {availableSlot.timeSlot}
                            </option>
                        ))}
              </select>

            </div>
            <button
                className="bg-[#E7FF8C] text-gray-800 hover:bg-[#d9ff66] p-2 rounded-lg"
                onClick={handleBooking}
                disabled={!selectedField || !selectedDate || !selectedTime} // Disable button if selections are incomplete
            >
              Book Now
            </button>
          </div>

          {/* Schedule Section */}
          <div className="mb-12 p-6 bg-[#E6FDA3]">
            <h3 className="text-lg font-semibold mb-4">
              Check Available Schedule
            </h3>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-medium">Time</div>
                  {/* Map days with background */}
                  {scheduleData.map((day) => (
                      <div
                          key={day.day}
                          className="text-center bg-[#F5F5F5] p-4 rounded-lg"
                      >
                        <div className="font-medium">{day.day}</div>
                        <div className="text-sm text-gray-500">{day.dayName}</div>
                      </div>
                  ))}
                </div>

                {/* Scrollable Time Slots */}
                <div
                    className="overflow-y-auto"
                    style={{
                      maxHeight: "250px", // Adjust to show only 5 time slots
                    }}
                >
                  {timeSlots.map((slot, idx) => (
                      <div key={idx} className="grid grid-cols-8 gap-2 mb-2">
                        <div className="font-medium">{slot.time}</div>
                        {scheduleData.map((day, i) => {
                          // Find the schedule that matches both timeSlot and date
                          const schedule = selectedFieldSchedules.find(
                              (s) => {
                                return s.timeSlot === slot.time && s.date === day.date;
                              }
                          );

                          // Determine availability based on status
                          const isAvailable = schedule?.status.toLowerCase() === "available";

                          return (
                              <div
                                  key={i}
                                  className={`p-2 rounded-lg flex justify-center items-center ${
                                      isAvailable
                                          ? "bg-[#F5F5F5] text-black"
                                          : "bg-[#F8B6B6] text-[#a83434]"
                                  }`}
                              >
                                <div className="text-center">
                                  <div className="text-sm font-medium">
                                    Rp{price.toLocaleString()}
                                  </div>
                                  <div className="text-xs">
                                    {isAvailable ? "Available" : "Not Available"}
                                  </div>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">{overallRating ? overallRating : 0}</h2>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-5 h-5 ${
                            i < Math.round(overallRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                based on {allReviews.length} reviews
              </p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-4 mb-8">
              {fieldsInVenue.map((field) => {
                const flattenedReviews = field.reviews?.flat();

                // Calculate the average rating for the current field
                const totalReviews = flattenedReviews?.length;
                const averageRating =
                    totalReviews > 0
                        ? flattenedReviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                    ) / totalReviews
                        : 0;


                return (
                    <div key={field.id} className="space-y-1">
                      <div className="text-sm font-medium">{field.type}</div>
                      {/* Display the average rating as the progress bar value */}
                      <ProgressBar value={averageRating * 20}/>
                    </div>
                );
              })}
            </div>

            <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Reviews</h2>
              </div>

              {/* Display Current Reviews */}
              <div className="space-y-4 mb-8">
                {currentReviews.map((review, idx) => {
                  const fieldType = fieldsInVenue
                      .find((field) => field.id === review.field_id)?.type;

                  return (
                      <div
                          key={idx}
                          className="p-4 bg-white shadow-md rounded-lg mb-4"
                      >
                        <div className="flex items-start gap-4">
                          <img
                              src={avatar1} // Use a default avatar
                              alt="User Avatar"
                              width={48}
                              height={48}
                              className="rounded-full"
                          />

                          <div>
                            <div className="font-medium">{review.user.first_name}</div>
                            <div className="text-sm text-gray-500">{fieldType}</div>
                            <div className="flex mb-1">
                              {[...Array(5)].map((_, i) => (
                                  <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                          i < review.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                      }`}
                                  />
                              ))}
                            </div>
                            <p className="text-sm font-medium">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>


              {/* Pagination Controls */}
              <div className="flex justify-center items-center space-x-4">
                <button
                    className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                  Previous
                </button>
                <p className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

            </div>
            {/* Write a Review Button */}
            <button
                className="w-full bg-[#E7FF8C] text-gray-800 hover:bg-[#d9ff66] p-2 rounded-lg"
                onClick={toggleSelectReviewModal}
            >
              Write a Review
            </button>
          </div>

          {/* SelectReview Modal */}
          {isSelectReviewOpen && (
              <SelectReview
                  facilities={fieldsInVenue.map((field) => ({
                    id: field.id,
                    type: field.type,
                  }))}
                  onClose={toggleSelectReviewModal}
                  username={user.first_name}
                  onNext={openWriteReviewModal} // Trigger WriteReview modal
              />
          )}

          {/* WriteReview Modal */}
          {isWriteReviewOpen && (
              <WriteReview
                  onClose={closeWriteReviewModal}
                  venueId={venue.id}
                  username={user.first_name}
                  selectedFacility={selectedFacility}
                  facilityId={facilityId}
                  onSubmit={handleReviewSubmitSuccess} // Trigger success modal on submit
              />
          )}
          {isSuccessModalOpen && <ReviewSuccess onClose={closeSuccessModal}/>}
        </div>
      </div>
  );
}