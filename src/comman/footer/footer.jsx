import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-premium-cream border-t border-text-light/20 py-8 md:py-12"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <img
              src={require("../../assets/YOBHA_logo_final.png")}
              alt="YOBHA Logo"
              className="h-8 md:h-10"
            />
            <p className="text-text-medium text-sm text-center md:text-left max-w-md">
              Discover the ultimate luxury in sleepwear with YOBHA. 
              Indulge in exclusivity and comfort.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6 text-text-medium text-2xl">
            <button 
              className="hover:text-luxury-gold transition-colors duration-300" 
              aria-label="Instagram"
            >
              <FaInstagram />
            </button>
            <button 
              className="hover:text-luxury-gold transition-colors duration-300" 
              aria-label="Facebook"
            >
              <FaFacebookF />
            </button>
            <button 
              className="hover:text-luxury-gold transition-colors duration-300" 
              aria-label="Twitter"
            >
              <FaTwitter />
            </button>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-text-light/20 mt-8 pt-6">
          <p className="text-center text-text-medium text-xs">
            © {new Date().getFullYear()} YOBHA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
