import React from "react";
import Hero from "../components/home/Hero";
import FeatureSection from "../components/home/FeatureSection";
import PopularRecipes from "../components/home/PopularRecipes";
import CommunitySection from "../components/home/CommunitySection";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <PopularRecipes />
      <CommunitySection />
    </div>
  );
};

export default HomePage;
