import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";
import SaveButton from "../components/SaveButton";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await API.get(`/recipes/${id}`);
        setRecipe(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    fetchRecipe();
  }, [id]);

  const submitComment = async () => {
    if (!comment || !rating) return;
    try {
      await API.post(`/recipes/${id}/comments`, { comment, rating });
      setComment("");
      setRating(0);
      const res = await API.get(`/recipes/${id}`);
      setRecipe(res.data); // refresh comments
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading recipe...</p>;
  if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-600">
        {recipe.time} • {recipe.servings} servings
      </p>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <SaveButton recipeId={recipe._id} />
      </div>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover my-4 rounded"
        />
      )}

      <div className="grid md:grid-cols-2 gap-4 my-6">
        <div>
          <h4 className="font-semibold text-lg mb-2">Ingredients</h4>
          <ul className="list-disc ml-5 space-y-1">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">Steps</h4>
          <ol className="list-decimal ml-5 space-y-2">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.videoUrl && (
        <div className="my-6">
          <h4 className="font-semibold text-lg mb-2">Video Tutorial</h4>
          <iframe
            src={recipe.videoUrl.replace("watch?v=", "embed/")}
            className="w-full h-64 rounded"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="mt-8">
        <h4 className="font-semibold text-lg mb-2">User Ratings</h4>
        <p className="text-yellow-500 text-xl font-semibold">
          ⭐{" "}
          {recipe.averageRating
            ? recipe.averageRating.toFixed(1)
            : "No ratings yet"}
        </p>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-2">Leave a Comment</h4>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your comment"
          className="w-full px-4 py-2 border rounded mb-2"
        ></textarea>
        <div className="flex items-center gap-3">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value="0">Rate</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>
          <button
            onClick={submitComment}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>

      {recipe.comments.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-2">Comments</h4>
          <ul className="space-y-3">
            {recipe.comments.map((c, idx) => (
              <li key={idx} className="border-b pb-2">
                <p className="text-sm text-gray-800">⭐ {c.rating}</p>
                <p>{c.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
