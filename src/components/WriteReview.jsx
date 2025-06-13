import { useState } from "react";
import profile from "../assets/profile.png";
import { createReview } from "../services/review-service.js";

const WriteReview = ({
  onClose,
  username,
  selectedFacility,
  venueId,
  facilityId,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !review.trim()) {
      alert("Please provide both a rating and a review.");
      return;
    }
    try {
      setIsLoading(true);
      const reviewData = { rating, comment: review.trim() };
      const response = await createReview(
        venueId,
        facilityId,
        reviewData,
        localStorage.getItem("token")
      );

      console.log("Review submitted successfully:", response);
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="relative bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
            <img
              src={profile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{username}</h2>
          <p className="text-sm text-gray-500">Facility: {selectedFacility}</p>
        </div>

        {/* Rating */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-800">
            How was the facility?
          </h1>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Textarea */}
        <div className="mb-6">
          <textarea
            placeholder="Would you like to write anything about this?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full h-28 border border-gray-300 rounded-lg p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <button
            className="w-full sm:w-auto bg-[#E7FF8C] text-black hover:bg-[#E7FF8C]/90 rounded-full px-6 py-3 text-center"
            onClick={onClose}
          >
            Back
          </button>
          <button
            className="w-full sm:w-auto bg-[#E7FF8C] text-black hover:bg-[#E7FF8C]/90 rounded-full px-6 py-3 text-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
