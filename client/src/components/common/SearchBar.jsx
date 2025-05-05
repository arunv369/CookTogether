import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients, chefs..."
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="absolute right-3 text-gray-400 hover:text-primary-600"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </form>

      {isFilterOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="mb-3">
            <h3 className="font-medium text-gray-700 mb-2">Diet</h3>
            <div className="flex flex-wrap gap-2">
              {["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo"].map(
                (diet) => (
                  <button
                    key={diet}
                    className="px-2 py-1 bg-gray-100 hover:bg-primary-100 text-gray-700 text-sm rounded-full"
                  >
                    {diet}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-medium text-gray-700 mb-2">Meal Type</h3>
            <div className="flex flex-wrap gap-2">
              {["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"].map(
                (meal) => (
                  <button
                    key={meal}
                    className="px-2 py-1 bg-gray-100 hover:bg-primary-100 text-gray-700 text-sm rounded-full"
                  >
                    {meal}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-medium text-gray-700 mb-2">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  className="px-2 py-1 bg-gray-100 hover:bg-primary-100 text-gray-700 text-sm rounded-full"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
              Clear All
            </button>
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
