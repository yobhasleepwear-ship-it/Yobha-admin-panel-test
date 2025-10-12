import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/yobhaLogo.png";
const Footer = () => {
  return (
    <footer 
      className="bg-premium-cream relative z-10 border-t border-text-light/20"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Brand & About */}
          <div className="space-y-5">
            <div className="text-3xl font-bold text-black tracking-wider">
             <Link 
                      to="/" 
                      className="flex items-center"
                    >
                      <img 
                        src={logoImage} 
                        alt="YOBHA Logo" 
                        className="h-8 md:h-10"
                      />
                    </Link>
            </div>
            <p className="text-text-medium text-sm leading-relaxed">
              Premium sleepwear for your ultimate comfort. Designed with care, elegance, and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-black uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-black uppercase tracking-wider">
              Customer Service
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="#!" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#!" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#!" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a 
                  href="#!" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-6 text-black uppercase tracking-wider">
                Newsletter
              </h3>
              <p className="text-text-medium text-sm mb-4">
                Subscribe to receive updates, access to exclusive deals, and more.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm border border-text-light/30 focus:outline-none focus:border-black transition-colors bg-white"
                />
                <button className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-text-dark transition-colors duration-300 uppercase tracking-wider">
                  Sign Up
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-black uppercase tracking-wider">
                Follow Us
              </h3>
              <div className="flex items-center gap-5">
                <a 
                  href="#!" 
                  aria-label="Facebook" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  <Facebook size={22} strokeWidth={1.5} />
                </a>
                <a 
                  href="#!" 
                  aria-label="Twitter" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  <Twitter size={22} strokeWidth={1.5} />
                </a>
                <a 
                  href="#!" 
                  aria-label="Instagram" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  <Instagram size={22} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-text-light/20 bg-premium-beige">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-medium">
            <p>© 2025 YOBHA. All rights reserved.</p>
            <div className="flex gap-8">
              <Link 
                to="/privacy" 
                className="hover:text-black transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="hover:text-black transition-colors duration-300"
              >
                Terms
              </Link>
              <Link 
                to="/cookies" 
                className="hover:text-black transition-colors duration-300"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
