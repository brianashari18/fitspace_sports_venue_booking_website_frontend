import { useState, useEffect } from "react";

import Profile from "../assets/Profile.png";
import SideBar from "./SideBar.jsx";
import { updateProfile } from "../services/user-service.js";

const EditProfile = ({ onLogout, user, onUserUpdate }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [isUpdate, setIsUpdate] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);

  const isValidEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdate(true);
    setEmailError("");
    setFirstNameError("");

    let isValid = true;

    if (firstName.trim() === "") {
      setFirstNameError("First name is required");
      isValid = false;
    }

    if (email.trim() === "" || !isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    }

    if (!isValid) {
      setIsUpdate(false);
      return;
    }

    // Data yang akan dikirim ke server
    const profileData = {
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await updateProfile(token, profileData);

      if (response) {
        // Update state di komponen induk
        const updatedUser = { ...user, ...profileData };
        onUserUpdate(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }

    } catch (error) {
      alert(error.message || "Failed to update profile.");
    } finally {
      setIsUpdate(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen bg-[#F5F5F5]">
      <SideBar onLogout={onLogout} />

      <div className="p-4 sm:p-6 w-full">
        <h1 className="text-2xl font-bold text-black text-start mb-6 lg:ml-36">
          Edit Profile
        </h1>

        <div className="bg-white rounded-lg shadow-xl w-full lg:w-[60rem] h-auto lg:h-[40rem] flex flex-wrap lg:ml-36">
          <div className="w-full h-auto lg:h-48 border-b-[1px] border-gray-900 border-opacity-35 shadow-lg p-6">
            <p className="text-start text-gray-400 font-medium lg:ml-[6rem]">
              Your Profile
            </p>
            <div className="flex justify-center lg:justify-start">
              <img
                src={Profile}
                alt="Profile"
                className="w-28 h-28 mt-3 lg:ml-20"
              />
            </div>
          </div>

          {successMessage && (
            <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-center my-4">
              <p>{successMessage}</p>
            </div>
          )}

          <div className="w-full text-center flex justify-center items-center py-4 lg:h-[calc(100%-12rem)]">
            <form className="w-full px-4 sm:px-8 lg:px-0 lg:w-[40rem] flex flex-wrap items-center">
              <div className="flex flex-col lg:flex-row items-start lg:items-center w-full mt-6 lg:mt-20 mb-3">
                <label
                  htmlFor="email"
                  className="w-full lg:w-1/6 text-left mb-2 lg:mb-0 lg:mr-5 text-gray-500 font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full lg:w-3/4 p-3 rounded-lg bg-[#738FFD] bg-opacity-35 placeholder-gray-500 border-[#738FFD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  readOnly
                />
              </div>
              {emailError && (
                <div className="text-sm text-red-600 mb-2 w-full">
                  {emailError}
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-start lg:items-center w-full mb-3">
                <label
                  htmlFor="firstName"
                  className="w-full lg:w-1/6 text-left mb-2 lg:mb-0 lg:mr-5 text-gray-500 font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full lg:w-3/4 p-3 rounded-lg bg-[#738FFD] bg-opacity-35 placeholder-gray-500 border-[#738FFD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              {firstNameError && (
                <div className="text-sm text-red-600 mb-3 w-full">
                  {firstNameError}
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-start lg:items-center w-full mb-8">
                <label
                  htmlFor="lastName"
                  className="w-full lg:w-1/6 text-left mb-2 lg:mb-0 lg:mr-5 text-gray-500 font-medium"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="w-full lg:w-3/4 p-3 rounded-lg bg-[#738FFD] bg-opacity-35 placeholder-gray-500 border-[#738FFD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="w-full flex justify-center lg:justify-end mb-10 lg:mb-20 lg:mr-8">
                <button
                  type="button"
                  className="w-60 p-3 rounded-lg bg-[#E6FDA3] text-[#738ffd] font-semibold hover:bg-[#F2FA5A] transition"
                  disabled={isUpdate}
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
