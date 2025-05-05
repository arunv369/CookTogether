import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(101,54,46,0.7)] to-[rgba(41,53,50,0.7)] z-10"
        aria-hidden="true"
      />
      <div
        className="relative bg-cover bg-center h-[500px] md:h-[600px]"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-20 relative">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Discover, Plan, and Share Your Culinary Journey
            </h1>
            <p className="mt-4 text-lg text-white opacity-90">
              Find recipes based on ingredients you have, connect with other
              food enthusiasts, and transform your cooking experience.
            </p>
            {/* <div className="mt-8">
              <SearchBar onSearch={handleSearch} />
            </div> */}
            <div className="mt-6 flex space-x-4">
              <Link
                to="/discover"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Explore Recipes
              </Link>
              <Link
                to="/meal-planning"
                className="inline-flex items-center px-4 py-2 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-700 transition-colors"
              >
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
