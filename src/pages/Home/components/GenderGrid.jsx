import React from "react";
import { useNavigate } from "react-router-dom";
import MEN_IMAGE from "../../../assets/Men.png";
import WOMEN_IMAGE from "../../../assets/Women.png";

const GenderGrid = () => {
  const navigate = useNavigate();

  const handleNavigate = (category) => {
    navigate(`/products/${category.toLowerCase()}`);
  };

  return (
    <div 
      className="bg-premium-beige py-20"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <section className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-wide mb-3">
            Discover Luxury
          </h2>
          <p className="text-text-medium text-base md:text-lg">
            Explore timeless elegance for every occasion
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MEN CARD */}
          <button
            onClick={() => handleNavigate("men")}
            className="relative group overflow-hidden bg-white border border-text-light/20 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-premium-cream">
              <img
                src={MEN_IMAGE}
                alt="Men's Collection"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <div className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-2">
                Men
              </div>
              <div className="text-white/90 text-sm md:text-base tracking-wide">
                Classic sophistication redefined
              </div>
            </div>
          </button>

          {/* WOMEN CARD */}
          <button
            onClick={() => handleNavigate("women")}
            className="relative group overflow-hidden bg-white border border-text-light/20 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-premium-cream">
              <img
                src={WOMEN_IMAGE}
                alt="Women's Collection"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <div className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-2">
                Women
              </div>
              <div className="text-white/90 text-sm md:text-base tracking-wide">
                The art of elegance and grace
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default GenderGrid;
