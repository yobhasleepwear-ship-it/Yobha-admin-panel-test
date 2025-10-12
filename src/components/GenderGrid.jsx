import React from "react";
import MEN_IMAGE from "../assets/Men.png";
import WOMEN_IMAGE from "../assets/Women.png";

const GenderGrid = () => {
  return (
    <div className="bg-white mt-8 md:mt-12">
      <section className="max-w-7xl mx-auto px-6 pt-8 md:pt-12 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#e7bfb3] via-[#f6d6cb] to-[#d9a79a]">Categories</h2>
            <p className="text-neutral-600 text-sm md:text-base mt-1">Browse our product categories</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button type="button" className="relative group rounded-2xl overflow-hidden border border-[#e7bfb3]/30 bg-white text-left">
            <img src={MEN_IMAGE} alt="Men" className="h-[320px] md:h-[420px] w-full object-cover group-hover:scale-[1.02] transition" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/40" />
            <div className="absolute bottom-5 left-5">
              <div className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#e7bfb3] via-[#f6d6cb] to-[#d9a79a]">Men</div>
              <div className="text-neutral-700 text-sm">Elevated lounge essentials</div>
            </div>
          </button>
          <button type="button" className="relative group rounded-2xl overflow-hidden border border-[#e7bfb3]/30 bg-white text-left">
            <img src={WOMEN_IMAGE} alt="Women" className="h-[320px] md:h-[420px] w-full object-cover group-hover:scale-[1.02] transition" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/40" />
            <div className="absolute bottom-5 left-5">
              <div className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#e7bfb3] via-[#f6d6cb] to-[#d9a79a]">Women</div>
              <div className="text-neutral-700 text-sm">Signature satin and silk</div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default GenderGrid;


