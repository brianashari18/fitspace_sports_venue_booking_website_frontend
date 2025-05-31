import venueImage from '../assets/venue.png';
import aboutImage from '../assets/about.png';
import logoImage from '../assets/white-logo.png';
import searchIcon from '../assets/search-icon.png';
import calendarIcon from '../assets/calendar-icon.png';
import securityIcon from '../assets/security-icon.png';
import starIcon from '../assets/star-icon.png';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const venues = [
    { name: 'FUTSAL', image: 'https://greendeahan.com/wp-content/uploads/2024/07/photo_18_2024-07-23_10-52-44.webp' },
    { name: 'BASKET', image: 'https://atlanta.urbanize.city/sites/default/files/styles/1140w/public/2021-11/Overtime%20Elite%20Atlantic%20Station%20secondary%20gym.jpg?itok=jN0gzDCw' },
    { name: 'BADMINTON', image: 'https://media.istockphoto.com/id/1040174716/id/foto/garis-di-lapangan-bulu-tangkis-hijau.jpg?s=612x612&w=0&k=20&c=hQV94ocP4qjsRHjBNmnrEG1lfZTzUA6KsmDotvj1U_E=' },
    { name: 'VOLI', image: 'https://media.istockphoto.com/id/1216739474/photo/volleyball-stadium.jpg?s=612x612&w=0&k=20&c=Orn6IBPDjw998_4L7G87yoD45MacoMknDNjPbJ0ZmVU=' },
  ];

  return (
    <div>
      {/* Hero Section */}
<section className="min-h-[70vh] flex items-center mx-4 sm:mx-12 md:mx-20 lg:mx-40 my-10 md:my-20 rounded-2xl bg-hero-pattern bg-cover bg-center">
  <div className="text-white py-12 px-4 sm:px-8 md:px-10 w-full md:w-2/3 lg:w-2/5">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
      Find and Book Your Perfect Sports Venue.
    </h1>
    <p className="text-base md:text-lg mb-8">
      From football fields to swimming pools, we've got it all. Explore top-rated venues and secure your spot with just a few clicks!
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        className="bg-white text-black px-6 py-2 rounded-md font-medium shadow-md hover:bg-gray-200"
        onClick={() => navigate("/venue")}
      >
        BOOK NOW
      </button>
      <button
        className="bg-lime-500 text-black px-6 py-2 rounded-md font-medium shadow-md hover:bg-lime-400"
        onClick={() => navigate("/venue")}
      >
        EXPLORE
      </button>
    </div>
  </div>
</section>


      {/* Venue Section */}
      <section className="mx-4 sm:mx-12 md:mx-20 lg:mx-40 my-10 md:my-20">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">VENUES</h2>
        <p className="text-center text-primary mb-8">Find the best sports venues near you for your fitness journey.</p>
        <div className="bg-primary py-12 px-6 sm:px-10 md:px-20 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-14">
          {venues.map((venue, index) => (
            <div key={index} className="h-64 sm:h-72 md:h-80 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 shadow-lg" style={{ backgroundImage: `url(${venue.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="absolute inset-0 bg-black bg-opacity-45 shadow-lg"></div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
                <h3 className="text-white font-bold text-xl sm:text-2xl">{venue.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="mx-4 sm:mx-12 md:mx-20 lg:mx-40 my-10 md:my-20 p-4 sm:p-10 md:p-20 flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <img src={aboutImage} alt="about" className="w-full" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center md:text-right">About Us</h2>
          <p className="text-gray-700 leading-7 text-justify md:text-right">
            FitSpace is your ultimate destination for discovering and booking the finest sports venues around you. Whether you’re a seasoned athlete, a casual sports enthusiast, or someone just beginning your fitness journey, we are here to make your experience smoother, more convenient, and enjoyable.
            <br /><br />
            We believe that sports and physical activity are not just about staying fit—they’re about fostering community, boosting mental health, and building a healthier lifestyle. Our platform connects you with a wide range of high-quality venues, from futsal courts and basketball arenas to golf courses and swimming pools, ensuring you have everything you need to pursue your passion for sports.
            <br /><br />
            We provide an easy platform to book your favorite sports venues with real-time availability. Whether you’re looking for a futsal field or a golf course, FitSpace has you covered!
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="mx-4 sm:mx-12 md:mx-20 lg:mx-40 my-10 md:my-20">
        <div className="relative bg-blue-500 text-white rounded-3xl p-6 sm:p-12 md:p-16 lg:p-20 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">How it works?</h2>
            <img src={logoImage} alt="logo" className="w-32 mt-6 lg:mt-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-8">
            <div className="flex gap-4 items-start">
              <img src={searchIcon} alt="search-icon" className="w-16 sm:w-20 md:w-28" />
              <div className="relative">
                <p className="absolute -top-6 -left-4 text-2xl font-bold">1</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Easily find sports venues near you</h3>
                <p className="text-sm opacity-80 max-w-xs">
                  Use our search bar to find the perfect venue by location, sport type, or available date. Or just go to the venue page using the navigation bar.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="relative text-right">
                <p className="absolute -top-6 -right-4 text-2xl font-bold">2</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Check real-time availability</h3>
                <p className="text-sm opacity-80 max-w-xs ml-auto">
                  Choose the date and time that fits your schedule. Our platform gives you real-time updates on venue availability, so you can book with confidence.
                </p>
              </div>
              <img src={calendarIcon} alt="calendar-icon" className="w-16 sm:w-20 md:w-28" />
            </div>
            <div className="flex gap-4 items-start">
              <img src={securityIcon} alt="security-icon" className="w-16 sm:w-20 md:w-28" />
              <div className="relative">
                <p className="absolute -top-6 -left-4 text-2xl font-bold">3</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Fast and secure booking process</h3>
                <p className="text-sm opacity-80 max-w-xs">
                  Finalize your booking with a few clicks. We offer secure online payments, ensuring your reservation is confirmed instantly.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="relative text-right">
                <p className="absolute -top-6 -right-4 text-2xl font-bold">4</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Play and have fun!</h3>
                <p className="text-sm opacity-80 max-w-xs ml-auto">
                  Head to the venue and enjoy your game! Everything’s set for you to focus on having a great time.
                </p>
              </div>
              <img src={starIcon} alt="star-icon" className="w-16 sm:w-20 md:w-28" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
