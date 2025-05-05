import React from "react";
import { ArrowRight } from "lucide-react";
import RecipeCard from "../common/RecipeCard";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PopularRecipes = () => {
  const { recipes } = useAuth();
  console.log(recipes);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Popular Recipes
          </h2>
          <Link
            to="/discover"
            className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;
