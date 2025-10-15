import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Package, 
  Plus,
  LogOut
} from "lucide-react";
import { LocalStorageKeys } from "../../constants/localStorageKeys";
import * as localStorageService from "../../service/localStorageService";

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorageService.clearAll();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Products",
      icon: Package,
      path: "/products"
    },
    {
      title: "Add Product",
      icon: Plus,
      path: "/add-product"
    },
    {
      title: "Logout",
      icon: LogOut,
      path: "/logout",
      onClick: handleLogout,
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative top-0 left-0 h-screen bg-premium-white border-r border-luxury-light-gold z-50 lg:z-auto
        transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col shadow-2xl
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-luxury-light-gold h-16 bg-premium-white">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-md text-text-dark hover:text-luxury-gold hover:bg-premium-cream transition-colors"
            aria-label="Toggle menu"
          >
            <Package size={20} />
          </button>

          {!isCollapsed && (
            <div className="flex items-center">
              <img
                src={require("../../assets/YOBHA_logo_final.png")}
                alt="YOBHA Admin"
                className="h-8"
              />
            </div>
          )}
          
          {/* Collapse Toggle - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-premium-cream transition-colors text-text-dark hover:text-luxury-gold"
          >
            {isCollapsed ? (
              <div className="w-4 h-4 border-r-2 border-t-2 border-current transform rotate-45"></div>
            ) : (
              <div className="w-4 h-4 border-l-2 border-b-2 border-current transform rotate-45"></div>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              
              return (
                <li key={index}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={`
                        flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
                        ${isItemActive 
                          ? 'bg-luxury-gold text-white shadow-lg transform scale-105' 
                          : 'text-text-dark hover:bg-premium-cream hover:text-luxury-gold hover:transform hover:scale-105'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 font-semibold">{item.title}</span>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
                        ${isItemActive 
                          ? 'bg-luxury-gold text-white shadow-lg transform scale-105' 
                          : 'text-text-dark hover:bg-premium-cream hover:text-luxury-gold hover:transform hover:scale-105'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 font-semibold">{item.title}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

      </div>
    </>
  );
};

export default Sidebar;