import logo from "../assets/yellow-logo.png";
import instagram from "../assets/instagram.png";
import twitter from "../assets/twitter.png";
import tiktok from "../assets/tiktok.png";
import facebook from "../assets/facebook.png";

const Footer = () => {
  return (
    <section className="flex flex-col">
      <div className="flex-grow"></div>

      {/* Footer utama */}
      <footer className="bg-primary py-10 drop-shadow-2xl">
        <div className="px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-0">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <a href="/home">
              <img
                src={logo}
                alt="footer"
                className="object-cover w-24 lg:w-auto lg:px-4 lg:py-1"
              />
            </a>
          </div>

          {/* Navigasi */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-12 lg:py-6">
            {["Home", "Venue", "About Us", "Contact Us"].map((item) => (
              <a key={item} href={`/${item.toLowerCase().replace(" ", "-")}`}>
                <button className="font-poppins text-primary2">{item}</button>
              </a>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center lg:items-end gap-2">
            <h1 className="font-poppins text-primary2">Follow Us On</h1>
            <div className="flex gap-3">
              {[facebook, instagram, twitter, tiktok].map((icon, idx) => (
                <a
                  key={idx}
                  href="https://www.instagram.com/bri.anashari/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={icon} alt="social" className="w-6 h-6 object-cover" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <footer className="bg-primary text-center">
        <h1 className="font-poppins text-primary2 py-5">
          Copyright &copy; FITSPACE, 2024
        </h1>
      </footer>
    </section>
  );
};

export default Footer;
