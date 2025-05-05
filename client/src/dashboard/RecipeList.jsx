import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await axios.get("https://cooktogether.onrender.com/recipes");
      setRecipes(res.data);
      console.log(res.data);
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://cooktogether.onrender.com/recipes/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.msg || "Recipe deleted");
      setRecipes(recipes.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Failed to delete recipe", err);
    }
  };

  const handleEdit = (recipe) => {
    navigate("/admin-dashboard/create", { state: recipe });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recipe List</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="border rounded shadow p-4 flex flex-col justify-between"
          >
            <div>
              <img
                src={`https://cooktogether.onrender.com/${recipe.image}`}
                alt={recipe.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <p className="text-sm text-gray-600">{recipe.description}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(recipe)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(recipe._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default RecipeList;
