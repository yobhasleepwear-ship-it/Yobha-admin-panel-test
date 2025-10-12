import React, { useState, useEffect } from "react";
import { LogOut, Menu, X, User, Heart, Package } from "lucide-react";
import { BsBag } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { LocalStorageKeys } from "../../constants/localStorageKeys";
import * as localStorageService from "../../service/localStorageService";
import logoImage from "../../assets/yobhaLogo.png";
import { useDispatch, useSelector } from "react-redux";

const HeaderWithSidebar = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector(state => state.cart.count);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const menuItems = ["Home", "Collections", "About", "Contact"];
  const collectionItems = ["Nightwear", "Loungewear", "Couple Sets", "Silk Series"];

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorageService.getValue(LocalStorageKeys.AuthToken);
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth); // update if storage changes
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorageService.clearAll(); // clear all keys
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",

      }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 md:px-8 lg:px-12 py-4">

        {/* Logo - Left Side */}
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

        {/* Desktop Nav - Center */}
        <nav className="hidden md:flex space-x-8 text-[15px] font-medium">
          {menuItems.map((item) => (
            <div key={item} className="relative group">
              {item === "Collections" ? (
                <button className="text-black hover:text-gray-700 tracking-wide transition-colors duration-300">
                  {item}
                </button>
              ) : (
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-black hover:text-gray-700 tracking-wide transition-colors duration-300"
                >
                  {item}
                </Link>
              )}
              {item === "Collections" && (
                <div className="absolute top-8 left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-150 bg-white rounded-xl p-4 min-w-[200px] animate-slideDown shadow-lg">
                  {collectionItems.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products/${cat.toLowerCase().replace(/\s/g, "-")}`}
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm text-black hover:text-gray-700"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-8 md:gap-10">
          {/* User Account Icon with Dropdown */}
          {isAuthenticated ? (
            <div className="relative group">
              <button
                className="text-black hover:text-gray-700 flex items-center cursor-pointer transition-colors duration-300"
                title="My Account"
              >
                <User size={22} strokeWidth={1.8} />
              </button>

              {/* User Dropdown Menu */}
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[200px]">
                  <Link
                    to="/account"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm text-black hover:text-gray-700"
                  >
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm text-black hover:text-gray-700"
                  >
                    <Package size={16} />
                    <span>Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm text-black hover:text-gray-700"
                  >
                    <Heart size={16} />
                    <span>Wishlist</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-black hover:text-gray-700 flex items-center transition-colors duration-300"
              title="Login"
            >
              <User size={22} strokeWidth={1.8} />
            </Link>
          )}

          {/* Cart Icon - Always visible with unique design */}
          <Link
            to="/cart"
            className="text-black hover:text-gray-700 flex items-center transition-colors duration-300"
            title="Shopping Cart"
          >
            <BsBag size={22} />
            {cartCount > 0 && (
              // <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
               <span> {cartCount}</span>
              // </span>
            )}
          </Link>

          {/* Logout Icon - Only when authenticated and on desktop */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center text-black hover:text-gray-700 transition-colors duration-300"
              title="Logout"
            >
              <LogOut size={20} strokeWidth={1.8} />
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden focus:outline-none text-black hover:text-gray-700 transition-colors duration-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative w-72 bg-white shadow-2xl animate-slideInLeft">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-300">
              <img
                src={logoImage}
                alt="YOBHA Logo"
                className="h-10"
              />
              <button
                className="text-black hover:text-gray-700 transition-all duration-300"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col p-6 space-y-3 text-black text-base">
              {menuItems.map((item) => (
                <div key={item} className="w-full">
                  {item === "Collections" ? (
                    <span className="block w-full text-black font-semibold">{item}</span>
                  ) : (
                    <Link
                      to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="block w-full text-black hover:text-gray-700 transition-colors duration-300 font-medium"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item}
                    </Link>
                  )}
                  {item === "Collections" && (
                    <div className="pl-4 mt-3 space-y-2">
                      {collectionItems.map((cat) => (
                        <Link
                          key={cat}
                          to={`/products/${cat.toLowerCase().replace(/\s/g, "-")}`}
                          className="block text-black hover:text-gray-700 transition-colors duration-300 py-1"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Sidebar Login/Logout */}
              <div className="pt-4 border-t border-gray-300 mt-2">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="block text-black hover:text-gray-700 transition-colors duration-300 font-semibold"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 text-black hover:text-gray-700 transition-colors duration-300 text-left w-full font-semibold"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
        }
        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease forwards;
        }
      `}</style>
    </header>
  );
};

export default HeaderWithSidebar;
