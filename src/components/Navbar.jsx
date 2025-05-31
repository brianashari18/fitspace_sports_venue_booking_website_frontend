import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/yellow-logo.png";
import iconProfile from "../assets/user-icon.png";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar Default (Desktop) */}
      <section className="bg-primary px-10 py-5 hidden lg:flex justify-between items-center">
        <div className="text-primary2 flex justify-start gap-16">
          <a href="/home">
            <img src={logo} alt="navbar" className="w-20 h-auto object-cover" />
          </a>
          <a href="/home"><button className="font-poppins">Home</button></a>
          <a href="/venue"><button className="font-poppins">Venue</button></a>
          <a href="/about-us"><button className="font-poppins">About Us</button></a>
          <a href="/contact-us"><button className="font-poppins">Contact Us</button></a>
        </div>
        <div className="text-primary2 flex justify-center gap-5 items-center">
          {user ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 hover:underline"
            >
              <img src={iconProfile} alt="profile" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-poppins p-2 text-[#f5f5f5]">{user.email}</span>
            </button>
          ) : (
            <>
              <a href="/sign-in"><button className="font-poppins p-2">Sign In</button></a>
              <a href="/sign-up">
                <button className="text-hitam font-poppins font-bold rounded-lg px-3 py-2 hover:bg-secondaryK bg-primary2">
                  Sign Up
                </button>
              </a>
            </>
          )}
        </div>
      </section>

      {/* Navbar Tablet/Mobile */}
      <section className="bg-primary px-6 py-4 flex lg:hidden justify-between items-center relative">
        <a href="/home">
          <img src={logo} alt="navbar" className="w-16 h-auto object-cover" />
        </a>
        <button onClick={toggleMenu} className="text-white text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-primary text-primary2 py-4 px-6 flex flex-col gap-4 shadow-md z-50"
          >
            <a href="/home" onClick={() => setIsOpen(false)}>Home</a>
            <a href="/venue" onClick={() => setIsOpen(false)}>Venue</a>
            <a href="/about-us" onClick={() => setIsOpen(false)}>About Us</a>
            <a href="/contact-us" onClick={() => setIsOpen(false)}>Contact Us</a>
            {user ? (
              <button
                onClick={() => {
                  navigate("/edit-profile");
                  setIsOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <img src={iconProfile} alt="profile" className="w-6 h-6 rounded-full" />
                <span>{user.email}</span>
              </button>
            ) : (
              <>
                <a href="/sign-in" onClick={() => setIsOpen(false)}>Sign In</a>
                <a
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="text-hitam font-bold bg-primary2 px-3 py-2 rounded"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Navbar;
