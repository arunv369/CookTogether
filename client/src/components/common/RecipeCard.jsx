import React, { useState } from "react";
import {
  Heart,
  Clock,
  MessageCircle,
  Edit,
  Trash2,
  Bookmark,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RecipeCard = ({ recipe, showActions = false, onDelete }) => {
  const {
    _id: id,
    title,
    description,
    image,
    cookingTime,
    author,
    tags,
    likes,
  } = recipe;

  const user = JSON.parse(localStorage.getItem("user"));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const { id: currentId, savedRecipe: savedRecipesFromStorage } = user;
  console.log("currentuserId:", currentId);
  const navigate = useNavigate();

  const hasUserLiked = likes.includes(currentId);
  const [isLiked, setIsLiked] = useState(hasUserLiked);

  const hasUsersaved = savedRecipesFromStorage.includes(id);
  const [isSaved, setIsSaved] = useState(hasUsersaved);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `https://cooktogether.onrender.com/recipes/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.msg || "Recipe deleted successfully!");
      setShowDeleteModal(false);
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete recipe.");
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    navigate("/create-recipe-form", { state: recipe });
  };

  const handleLike = async () => {
    if (!currentId) {
      toast.error("You must be logged in to like a recipe.");
      return;
    }

    const data = { userId: currentId };
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((count) => count + 1);
    } else {
      setIsLiked(false);
      setLikeCount((count) => count - 1);
    }

    try {
      if (!previousIsLiked) {
        await axios.post(
          `https://cooktogether.onrender.com/recipes/${id}/like`,
          data,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `https://cooktogether.onrender.com/recipes/${id}/unlike`,
          data,
          {
            withCredentials: true,
          }
        );
      }
    } catch (err) {
      console.error(err);
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error("Failed to update like status.");
    }
  };

  const handleSave = async () => {
    if (!currentId) {
      toast.error("You must be logged in to save a recipe.");
      return;
    }

    const data = { userId: currentId };
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved);

    try {
      let updatedUser;
      if (!previousIsSaved) {
        await axios.post(
          `https://cooktogether.onrender.com/users/${id}/save`,
          data,
          {
            withCredentials: true,
          }
        );
        updatedUser = {
          ...user,
          savedRecipe: [...user.savedRecipe, id],
        };
      } else {
        await axios.post(
          `https://cooktogether.onrender.com/users/${id}/unsave`,
          data,
          {
            withCredentials: true,
          }
        );
        updatedUser = {
          ...user,
          savedRecipe: user.savedRecipe.filter((rid) => rid !== id),
        };
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      setIsSaved(previousIsSaved);
      toast.error("Failed to update save status.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <Link to={`/recipe/${id}`}>
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt="Recipe"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-0 right-0 bg-white bg-opacity-90 rounded-bl-lg px-2 py-1">
              <div className="flex items-center text-xs text-gray-700">
                <Clock size={14} className="mr-1 text-primary-600" />
                <span>{cookingTime} min</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-center mb-2">
            <img
              src={author?.profilePic}
              alt="User"
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
            <span className="text-xs text-gray-600">{author?.name}</span>
          </div>

          <Link to={`/recipe/${id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
              {title}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center transition-colors ${
                  isLiked
                    ? "text-accent-500"
                    : "text-gray-500 hover:text-accent-500"
                }`}
              >
                <Heart
                  size={18}
                  className={`mr-1 ${isLiked ? "fill-current" : ""}`}
                />
                <span className="text-xs">{likeCount}</span>
              </button>
              <span className="flex items-center text-gray-500">
                <MessageCircle size={18} className="mr-1" />
                <span className="text-xs">{recipe.comments.length}</span>
              </span>
              <button
                onClick={handleSave}
                className={`flex items-center transition-colors ${
                  isSaved
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-primary-600"
                }`}
              >
                <Bookmark
                  size={18}
                  className={`${isSaved ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {showActions && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Recipe
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;
