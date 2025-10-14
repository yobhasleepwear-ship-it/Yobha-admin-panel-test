import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/YOBHA_logo_final.png";

const AdminFooter = () => {
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
                      to="/products" 
                      className="flex items-center"
                    >
                      <img 
                        src={logoImage} 
                        alt="YOBHA Admin Logo" 
                        className="h-8 md:h-10"
                      />
                    </Link>
            </div>
            <p className="text-text-medium text-sm leading-relaxed">
              YOBHA Admin Panel - Premium sleepwear management system. Designed for efficiency and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-black uppercase tracking-wider">
              Admin Panel
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/products" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/add-product" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Add Product
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-text-medium hover:text-black transition-colors duration-300"
                >
                  Manage Products
                </Link>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h3 className="text-sm font-semibold mb-6 text-black uppercase tracking-wider">
              System
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-text-medium">
                  Admin Panel v1.0
                </span>
              </li>
              <li>
                <span className="text-text-medium">
                  Product Management
                </span>
              </li>
              <li>
                <span className="text-text-medium">
                  Inventory Control
                </span>
              </li>
            </ul>
          </div>

          {/* Support & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-6 text-black uppercase tracking-wider">
                Support
              </h3>
              <p className="text-text-medium text-sm mb-4">
                Need help with the admin panel? Contact our support team.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-black uppercase tracking-wider">
                Follow YOBHA
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
            <p>© 2025 YOBHA Admin Panel. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="hover:text-black transition-colors duration-300">
                Privacy
              </span>
              <span className="hover:text-black transition-colors duration-300">
                Terms
              </span>
              <span className="hover:text-black transition-colors duration-300">
                Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
