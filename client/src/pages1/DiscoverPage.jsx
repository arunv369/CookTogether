import React, { useEffect, useState } from "react";
import { Plus, X, Filter, Search, SlidersHorizontal } from "lucide-react";
import RecipeCard from "../components/common/RecipeCard";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const DiscoverPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const { recipes } = useAuth();
  console.log(recipes);

  console.log("filteredRecipes:", filteredRecipes);

  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      try {
        const params = {
          searchQuery,
          ingredients,
          diet: selectedDiet,
          mealType: selectedMealType,
          cuisine: selectedCuisine,
          minRating,
        };
        console.log("params:", params);

        const response = await axios.get("/recipes/search", { params });
        setFilteredRecipes(response.data); // Set state from server response
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };
    fetchFilteredRecipes();
  }, [
    searchQuery,
    ingredients,
    minRating,
    selectedDiet,
    selectedMealType,
    selectedCuisine,
  ]);

  const handleClearFilters = () => {
    setSelectedDiet("");
    setSelectedMealType("");
    setSelectedCuisine("");
    setMinRating(0);
    setIngredients([]);
    setSearchQuery("");
  };

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Keto",
    "Paleo",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
  const cuisineTypes = [
    "Italian",
    "Asian",
    "Mexican",
    "Mediterranean",
    "Indian",
    "American",
    "French",
  ];

  // Filter recipes based on all criteria
  // const filteredRecipes = recipes.filter((recipe) => {
  //   // Search query filter
  //   const matchesSearch =
  //     !searchQuery ||
  //     recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

  //   // Ingredients filter
  //   const hasIngredients =
  //     ingredients.length === 0 ||
  //     ingredients.every((searchIngredient) =>
  //       recipe.ingredients.some(({ name }) =>
  //         name.toLowerCase().includes(searchIngredient.toLowerCase())
  //       )
  //     );

  //   // Dietary restrictions
  //   const matchesDiet = !selectedDiet || recipe.tags.includes(selectedDiet);

  //   // Meal type
  //   const matchesMealType =
  //     !selectedMealType || recipe.tags.includes(selectedMealType);

  //   // Cuisine type
  //   const matchesCuisine =
  //     !selectedCuisine || recipe.tags.includes(selectedCuisine);

  //   // Rating
  //   const matchesRating = (recipe.averageRating || 0) >= minRating;

  //   return (
  //     matchesSearch &&
  //     hasIngredients &&
  //     matchesDiet &&
  //     matchesMealType &&
  //     matchesCuisine &&
  //     matchesRating
  //   );
  // });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Discover Recipes
        </h1>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-primary-600"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by name or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div
        className={`bg-white rounded-lg shadow-md p-6 mb-8 ${
          isFilterOpen ? "block" : "hidden"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`px-3 py-1 rounded ${
                    minRating === rating
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {rating === 0 ? "Any" : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Cuisine Type</h3>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() =>
                    setSelectedCuisine(
                      selectedCuisine === cuisine ? "" : cuisine
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCuisine === cuisine
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </h3>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((diet) => (
                <button
                  key={diet}
                  onClick={() =>
                    setSelectedDiet(selectedDiet === diet ? "" : diet)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedDiet === diet
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Meal Type</h3>
            <div className="flex flex-wrap gap-2">
              {mealTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSelectedMealType(selectedMealType === type ? "" : type)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedMealType === type
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {(ingredients.length > 0 ||
        selectedDiet ||
        selectedMealType ||
        selectedCuisine ||
        minRating > 0 ||
        searchQuery) && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchQuery && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
              Search: {searchQuery}
            </span>
          )}
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
            >
              {ingredient}
            </span>
          ))}
          {selectedDiet && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
              {selectedDiet}
            </span>
          )}
          {selectedMealType && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
              {selectedMealType}
            </span>
          )}
          {selectedCuisine && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
              {selectedCuisine}
            </span>
          )}

          {minRating > 0 && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
              {minRating}★ or higher
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-2">
            No recipes found matching your criteria
          </p>
          <p className="text-sm text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
