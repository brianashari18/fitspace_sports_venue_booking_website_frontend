import { Link } from "react-router-dom";
import ResetSuccessfull from "../assets/ResetSuccessfull.png";

const ResetSuccess = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-4 sm:py-6">
      <div className="bg-[#738FFD] rounded-lg shadow-xl w-full max-w-[85rem] h-auto md:h-full sm:h-full flex flex-col lg:flex-row m-2">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center text-white p-4 sm:p-8 lg:p-32">
          <h1 className="font-extrabold text-base sm:text-xl md:text-2xl lg:text-3xl text-center mb-4 sm:mb-8 lg:mb-10">
            RESET SUCCESFULL
          </h1>
          <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-center mb-4 sm:mb-8 lg:mb-16">
            Please sign in again with your new password
          </p>

          <Link
            to="/sign-in"
            className="w-2/3 p-3 rounded-lg bg-[#E6FDA3] text-[#738ffd] font-semibold hover:bg-[#F2FA5A] transition mt-4 sm:mt-6 text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/3 h-auto lg:h-3/4 flex justify-center items-center bg-[#cad7fdb3] rounded-2xl mx-auto my-4 sm:my-6 lg:my-auto">
          <img
            src={ResetSuccessfull}
            alt="Reset Password"
            className="w-64 h-64 sm:w-80 h-80 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetSuccess;