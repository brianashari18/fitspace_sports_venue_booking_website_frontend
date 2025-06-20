import React, { useState, useEffect } from "react";
import hero1 from "../assets/hero1.png";
import { ChevronDown, Star, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VenueService from "../services/venue-service";

export default function SportVenues() {
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for mobile filter modal

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = Array.isArray(filteredVenues)
    ? filteredVenues.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil((filteredVenues?.length || 0) / itemsPerPage);
  const navigate = useNavigate();

  const handleButtonClick = (location) => {
    setActiveButton(location);
    const updatedVenues = venues.filter(
      (venue) => venue.city_or_regency.toLowerCase() === location.toLowerCase()
    );
    setFilteredVenues(updatedVenues);
    setCurrentPage(1);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venuesData = await VenueService.getAllVenues();
        setVenues(venuesData);
        setFilteredVenues(venuesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    let updatedVenues = [...venues];
    if (selectedFacility) {
      updatedVenues = updatedVenues.filter((venue) =>
        venue.fields.some((field) => field.type === selectedFacility)
      );
    }
    if (selectedRating) {
      updatedVenues.sort((a, b) => {
        if (selectedRating === "Lowest to Highest") {
          return a.rating - b.rating;
        } else if (selectedRating === "Highest to Lowest") {
          return b.rating - a.rating;
        }
        return 0;
      });
    }
    setFilteredVenues(updatedVenues);
  }, [selectedFacility, selectedRating, venues]);

  const handleResetFilters = () => {
    setSelectedFacility("");
    setSelectedRating("");
    setFilteredVenues(venues);
    setCurrentPage(1);
    setActiveButton(null);
    setIsFilterOpen(false); // Close filter modal on reset
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section */}
      <div className="bg-[#738FFD] mt-16 mx-4 sm:mx-8 md:mx-20 p-6 sm:p-8 md:p-10 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center md:py-16 relative">
        <div className="w-full md:w-1/2 text-left mb-6 md:mb-0">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
            Best Sport Center Location
          </h1>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
                activeButton === "Bandung"
                  ? "bg-white text-black font-semibold"
                  : "bg-[#E6FDA3] text-black"
              }`}
              onClick={() => handleButtonClick("Bandung")}
            >
              Bandung
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
                activeButton === "Kabupaten Bandung"
                  ? "bg-white text-black font-semibold"
                  : "bg-[#E6FDA3] text-black"
              }`}
              onClick={() => handleButtonClick("Kabupaten Bandung")}
            >
              Kabupaten Bandung
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
                activeButton === "Kabupaten Bandung Barat"
                  ? "bg-white text-black font-semibold"
                  : "bg-[#E6FDA3] text-black"
              }`}
              onClick={() => handleButtonClick("Kabupaten Bandung Barat")}
            >
              Kabupaten Bandung Barat
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-end">
          <img
            src={hero1}
            alt="Sports illustration"
            className="w-[200px] sm:w-[250px] md:w-[363px] h-auto object-contain md:absolute md:bottom-0 md:right-0"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile Filter Button (visible below sm) */}
        <div className="flex sm:hidden justify-end">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-[#E6FDA3] p-2 rounded-md flex items-center gap-2"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Mobile Filter Modal (visible when isFilterOpen is true) */}
        {isFilterOpen && (
          <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 pt-20">
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-md">
              <div className="flex flex-col gap-4">
                {/* Facility Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("facility")}
                    className="bg-[#E6FDA3] px-4 py-2 rounded-md flex items-center gap-2 w-full text-sm"
                  >
                    {selectedFacility || "Facility"}
                    <ChevronDown size={16} />
                  </button>
                  {openDropdown === "facility" && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-full z-50">
                      {["Futsal", "Basketball", "Badminton", "Volleyball"].map(
                        (facility) => (
                          <div
                            key={facility}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setSelectedFacility(facility);
                              setOpenDropdown(null);
                              setIsFilterOpen(false); // Close modal on selection
                            }}
                          >
                            {facility}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Rating Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("rating")}
                    className="bg-[#E6FDA3] px-4 py-2 rounded-md flex items-center gap-2 w-full text-sm"
                  >
                    {selectedRating || "Rating"}
                    <ChevronDown size={16} />
                  </button>
                  {openDropdown === "rating" && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-full z-50">
                      {["Lowest to Highest", "Highest to Lowest"].map(
                        (rating) => (
                          <div
                            key={rating}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setSelectedRating(rating);
                              setOpenDropdown(null);
                              setIsFilterOpen(false); // Close modal on selection
                            }}
                          >
                            {rating}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Reset Filters Button */}
                <button
                  onClick={handleResetFilters}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-400 w-full"
                >
                  Reset Filters
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-600 text-sm hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop/Tablet Filters (visible at sm and above) */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
          {/* Facility Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => toggleDropdown("facility")}
              className="bg-[#E6FDA3] px-4 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
            >
              {selectedFacility || "Facility"}
              <ChevronDown size={16} sm:size={20} />
            </button>
            {openDropdown === "facility" && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-full sm:w-48 z-50">
                {["Futsal", "Basketball", "Badminton", "Volleyball"].map(
                  (facility) => (
                    <div
                      key={facility}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                      onClick={() => {
                        setSelectedFacility(facility);
                        setOpenDropdown(null);
                      }}
                    >
                      {facility}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Rating Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => toggleDropdown("rating")}
              className="bg-[#E6FDA3] px-4 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
            >
              {selectedRating || "Rating"}
              <ChevronDown size={16} sm:size={20} />
            </button>
            {openDropdown === "rating" && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-full sm:w-48 z-50">
                {["Lowest to Highest", "Highest to Lowest"].map((rating) => (
                  <div
                    key={rating}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                    onClick={() => {
                      setSelectedRating(rating);
                      setOpenDropdown(null);
                    }}
                  >
                    {rating}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-400 w-full sm:w-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Venue Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {currentVenues.length > 0 ? (
          currentVenues.map((venue) => (
            <div
              key={venue.id}
              className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() =>
                navigate(`/venueDetail/${venue.name}`, { state: { venue } })
              }
            >
              <div className="relative h-40 sm:h-48">
                <img
                  src={
                    venue.fields.length > 0 && venue.fields[0].gallery?.length > 0
                      ? `http://localhost:8080${venue.fields[0]?.gallery[0].photoUrl}`
                      : "https://staticg.sportskeeda.com/editor/2022/11/a9ef8-16681658086025-1920.jpg"
                  }
                  alt="Venue"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm sm:text-base">
                    {venue.name || "Sport Venue"}
                  </h3>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starFill = Math.min(
                        Math.max(venue.rating - index, 0),
                        1
                      );
                      return (
                        <div key={index} className="relative w-3 sm:w-4 h-3 sm:h-4">
                          <Star size={12} sm:size={16} className="text-gray-300" />
                          <Star
                            size={12}
                            sm:size={16}
                            className="absolute top-0 left-0 text-yellow-400 fill-current"
                            style={{
                              clipPath: `inset(0 ${100 - starFill * 100}% 0 0)`,
                            }}
                          />
                        </div>
                      );
                    })}
                    <span className="ml-1 sm:ml-2 text-yellow-500 font-bold text-xs sm:text-sm">
                      {venue.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  {venue.street} - {venue.district}, {venue.city_or_regency},{" "}
                  {venue.province}
                </p>
                <div className="flex flex-wrap gap-2">
                  {venue.fields.map((field, j) => (
                    <span
                      key={j}
                      className="bg-gray-200 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm"
                    >
                      {field.type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-sm sm:text-base">
            No venues available.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-6 sm:py-8">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentPage(pageIndex + 1)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base ${
                currentPage === pageIndex + 1
                  ? "bg-[#6B7FFF] text-white"
                  : "bg-gray-300"
              } flex items-center justify-center`}
            >
              {pageIndex + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}