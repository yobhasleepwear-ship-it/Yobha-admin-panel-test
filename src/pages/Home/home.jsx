import React from "react";
import heroVideo from "../../assets/heroVideo.mp4";
import TrendingNewArrivals from './components/TrendingNewArrivals'
import GenderGrid from './components/GenderGrid'
const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-[#FAF6F2]">
   

      <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
      
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

     
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60"></div>

    
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-0">
          {/* Large YOBHA Logo - Gucci Style */}
          <h1 className="text-8xl md:text-[12rem] lg:text-[15rem] font-bold text-white/20 tracking-widest mb-8 select-none">
            YOBHA
          </h1>
          
          {/* SHOP NOW Button - Gucci Style */}
          <button className="px-12 py-4 bg-white border-2 border-black text-black font-medium text-lg uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
            SHOP NOW
          </button>
        </div>
      </section>
      {/* Render Trending arrivals and Gender grid below the hero */}
      <TrendingNewArrivals />
      <GenderGrid />
    </div>
  );
};

export default HomePage;
