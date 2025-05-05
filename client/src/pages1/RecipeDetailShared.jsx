import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const RecipeDetailShared = () => {
  const { shareId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedRecipe = async () => {
      try {
        const { data } = await axios.get(
          `https://cooktogether.onrender.com/recipes/shared/${shareId}`,
          { withCredentials: true }
        );
        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch shared recipe", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedRecipe();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center text-red-500 mt-10">
        Recipe not found or no longer shared.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {recipe.title}
        </h1>
        <p className="text-gray-500">By {recipe.author?.name}</p>
      </div>

      {recipe.image && (
        <img
          src={`https://cooktogether.onrender.com/${recipe.image.replace(
            /\\/g,
            "/"
          )}`}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-lg mb-4 text-gray-700">{recipe.description}</p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Ingredients
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Steps</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-600">
        <span className="bg-blue-100 px-3 py-1 rounded-full">
          ⏱ {recipe.cookingTime} min
        </span>
        <span className="bg-green-100 px-3 py-1 rounded-full">
          👥 Serves {recipe.servings}
        </span>
        <span className="bg-yellow-100 px-3 py-1 rounded-full capitalize">
          ⚙️ {recipe.difficulty}
        </span>
      </div>

      {recipe.video && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tutorial Video
          </h3>
          <a
            href={recipe.video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailShared;
