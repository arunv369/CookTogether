import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <div className="rounded-xl shadow hover:shadow-lg transition duration-300 bg-white overflow-hidden">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg">{recipe.title}</h2>
        <p className="text-sm text-gray-500">By {recipe.author}</p>
        <p className="mt-2 text-sm">{recipe.description?.slice(0, 80)}...</p>
        <div className="flex justify-between mt-3 text-sm">
          <span>⭐ {recipe.rating}</span>
          <Link
            to={`/recipe/${recipe._id}`}
            className="text-emerald-600 hover:underline"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
