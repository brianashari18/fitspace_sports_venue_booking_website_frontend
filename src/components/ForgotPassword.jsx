import { useState, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ForgotPass from "../assets/ForgotPass.png";
import { forgotPassword } from "../services/auth-service.js";

const EmailContext = createContext();

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); // Clear previous error

    // Validate email input
    if (email.trim() === "") {
      setEmailError("Email is required.");
      return;
    } else if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword({ email }); // Wrap email in an object
      console.log("API Response:", response); // Debugging log
      navigate("/verification-code", { state: { email } });
    } catch (error) {
      console.error("Error in API call:", error.message || error);
      setEmailError(
          error.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setEmailError("");
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setEmailError(""); // Clear error while typing
  };

  return (
      <EmailContext.Provider value={{ email, setEmail }}>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
          <div className="bg-[#738FFD] rounded-lg shadow-xl w-full flex flex-col lg:flex-row lg:w-[64rem] xl:w-[85rem] h-auto lg:h-[35rem] sm: m-10 overflow-hidden">
            {/* Left Form Section */}
            <div className="w-full lg:w-1/2 bg-[#738FFD] lg:rounded-l-lg flex flex-col justify-center items-center text-white p-6 sm:p-10 md:p-12 lg:p-32">
              <h1 className="font-extrabold text-xl sm:text-3xl text-center mb-10">
                FORGOT PASSWORD
              </h1>
              <p className="font-semibold text-sm sm:text-lg text-center mb-10 sm:mb-16">
                Enter your email account to reset your password!
              </p>

              <form className="w-full max-w-sm space-y-4 mb-2" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <input
                      type="text"
                      placeholder="Email"
                      className={`w-full p-3 rounded-lg border text-black ${
                          emailError
                              ? "border-blue-500 focus:ring-blue-500"
                              : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                      value={email}
                      onChange={handleEmailChange}
                  />
                  {emailError && (
                      <span className="text-[#E6FDA3] text-sm mt-1 pl-1">
                        {emailError}
                      </span>
                  )}
                </div>

                <div className="w-full flex flex-col space-y-2 mt-6">
                  <button
                      type="submit"
                      className="w-full p-3 rounded-lg bg-[#E6FDA3] text-[#738ffd] font-semibold hover:bg-[#F2FA5A] transition flex justify-center items-center"
                      disabled={isLoading}
                  >
                    {isLoading ? (
                        <span className="loader inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        "Continue"
                    )}
                  </button>

                  <Link
                      to="/sign-in"
                      className="w-full p-3 rounded-lg bg-[#E6FDA3] text-[#738ffd] font-semibold hover:bg-[#F2FA5A] transition flex justify-center items-center"
                      onClick={handleCancel}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Right Image Section */}
            <div className="w-full lg:w-1/3 bg-[#cad7fdb3] lg:rounded-2xl flex justify-center items-center mx-auto my-6 lg:my-auto lg:h-3/4">
              <img
                  src={ForgotPass}
                  alt="Forgot Password"
                  className="w-full max-w-[24rem] h-auto max-h-[24rem] object-contain"
              />
            </div>
          </div>
        </div>
      </EmailContext.Provider>
  );
};

export default ForgotPassword;
