import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PaymentIlus from "../assets/PaymentIlus.png";

const ConfirmPayment = () => {
  const { state } = useLocation();
  const {
    venue,
    field,
    date,
    time,
    price,
    taxPrice,
    totalPrice,
    selectedPaymentMethod = { category: "", method: "" },
    formData,
  } = state || {};

  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-GB",
      options
    );
    return formattedDate;
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const getVirtualAccountNumber = (selectedPaymentMethod) => {
    const virtualAccounts = {
      BCA: "VA-BCA-123456",
      BNI: "VA-BNI-789012",
      Mandiri: "VA-Mandiri-345678",
      BRI: "VA-BRI-901234",
      BSI: "VA-BSI-567890",
      GoPay: "EW-GoPay-123456",
      OVO: "EW-OVO-789012",
      ShopeePay: "EW-ShopeePay-345678",
      Visa: "CC-Visa-123456",
      Mastercard: "CC-Mastercard-789012",
    };

    return virtualAccounts[selectedPaymentMethod?.method] || "Not available";
  };

  const handleNext = async () => {
    if (!isChecked) {
      alert("Harap menyetujui syarat dan ketentuan sebelum melanjutkan.");
      return;
    }

    const bookingData = {
      venue,
      field,
      date,
      time,
      price,
      taxPrice,
      totalPrice,
      selectedPaymentMethod,
      formData,
    };

    const bookingData2 = {
      date: date,
      time_slot: time,
      type: field,
    };

    try {
      setIsSubmitting(true);
      console.log("Sending booking data:", bookingData2);

      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/${venue.id}/bookings/create`, bookingData2, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log("Response data:", response.data);

      if (response.status !== 200) {
        console.error("Response error:", response.data);
        throw new Error("Failed to save booking.");
      }

      console.log("Booking successful:", response.data);
      navigate("/booking-success");
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Terjadi kesalahan saat menyimpan booking. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-4 sm:py-6 mx-4">
      <div className="w-full max-w-[85rem] flex flex-col lg:flex-row lg:h-[45rem]">
        {/* Left Side */}
        <div className="w-full lg:w-2/3 flex flex-col items-center gap-4 mr-2 sm:gap-6 py-6 sm:py-8">
          <div className="w-full max-w-[50rem] px-4 sm:px-6">
            <p className="text-base sm:text-lg font-semibold">
              1. Customer Detail and Payment Option
            </p>
            <div className="w-full h-2 bg-gray-200 rounded mt-2">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="bg-[#738FFD] rounded-lg shadow-lg w-full max-w-[50rem] h-auto sm:h-[20rem] p-6 sm:p-8 pl-8 sm:pl-12 text-white flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 h-auto sm:h-[16rem]">
              <h2 className="text-lg sm:text-xl font-bold mt-3">Booking Information</h2>
              <div className="mt-6 sm:mt-10 text-base sm:text-lg font-semibold">
                <h3>Lapangan {field}</h3>
                <h3>{venue?.name}</h3>
              </div>
              <div className="mt-4 sm:mt-5 text-base sm:text-lg font-semibold">
                <h3>{formatDate(date)}</h3>
                <h3>{time}</h3>
              </div>
            </div>
            <div className="w-full sm:w-1/2 h-auto sm:h-full flex justify-center items-center mt-4 sm:mt-0">
              <img
                src={PaymentIlus}
                alt="Lapangan Futsal"
                className="rounded-lg object-contain max-h-[12rem] sm:max-h-[14rem] max-w-[100%]"
              />
            </div>
          </div>

          <div className="w-full max-w-[50rem] px-4 sm:px-6">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label className="text-xs sm:text-sm text-[#475569]">
              Saya telah membaca dan menyetujui Syarat dan Ketentuan yang
              berlaku
            </label>
          </div>

          <div className="hidden lg:block w-full max-w-[50rem] px-4 sm:px-6 mt-4 sm:mt-6 text-left">
            <Link
              to="/payment"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#E6FDA3] text-black font-semibold rounded-lg shadow-md hover:bg-[#F2FA5A] transition text-sm sm:text-base"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/3 flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8">
          <div className="w-full max-w-[50rem] lg:max-w-[25rem] px-4 sm:px-6 text-start">
            <p className="text-base sm:text-lg font-semibold">
              2. Review and Confirm Payment
            </p>
            <div className="w-full h-2 bg-gray-200 rounded mt-2">
              <div
                className="h-full bg-blue-400 rounded"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="bg-[#738FFD] rounded-lg shadow-lg w-full max-w-[50rem] lg:max-w-[25rem] h-auto sm:h-[20rem] p-4 sm:p-6 text-white">
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Payment Details</h2>
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm">
                {selectedPaymentMethod?.category} {selectedPaymentMethod?.method}
              </p>
              <p className="text-lg sm:text-xl font-semibold">{getVirtualAccountNumber(selectedPaymentMethod)}</p>
            </div>
            <div className="text-xs sm:text-sm">
              <div className="flex justify-between mb-2">
                <span>Price</span>
                <span>{price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax Fee 12%</span>
                <span>{taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-base sm:text-lg mt-3 sm:mt-4">
                <span>Total</span>
                <span>{totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[50rem] lg:max-w-[25rem] px-4 sm:px-6">
            <h3 className="text-black font-semibold text-sm sm:text-base mb-2">
              Venue Terms and Condition
            </h3>
            <ul className="text-xs sm:text-sm text-[#475569] list-disc pl-5">
              <li>Reschedule hanya bisa dilakukan sebelum H-3 Jadwal Main.</li>
              <li>Dilarang merokok dalam lapangan.</li>
              <li>Wajib menjaga kebersihan lingkungan di dalam area venue.</li>
            </ul>
          </div>

          <div className="w-full max-w-[50rem] px-4 sm:px-6 mt-4 sm:mt-6 text-left">
            <Link
              to="/payment"
              className="block lg:hidden w-full sm:w-auto text-center px-4 sm:px-6 py-2 sm:py-3 bg-[#E6FDA3] text-black font-semibold rounded-lg shadow-md hover:bg-[#F2FA5A] transition text-sm sm:text-base"
            >
              Back
            </Link>
          </div>
          <div className="w-full max-w-[50rem] lg:max-w-[25rem] px-4 sm:px-6 mt-4 sm:mt-6 text-right">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`block lg:w-auto lg:ml-auto w-full px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg shadow-md transition text-sm sm:text-base ${
                isSubmitting
                  ? "bg-gray-300 text-gray-600"
                  : "bg-[#E6FDA3] text-black hover:bg-[#F2FA5A]"
              }`}
            >
              {isSubmitting ? "Processing..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;