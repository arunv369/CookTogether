import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CreateRecipeForm = () => {
  const { state } = useLocation();
  const id = state?._id;
  const navigate = useNavigate();
  console.log(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    steps: [""],
    cookingTime: "",
    servings: "",
    video: "",
    difficulty: "medium",
    tags: [""],
    image: null,
  });

  useEffect(() => {
    if (state) {
      setFormData({
        title: state.title || "",
        description: state.description || "",
        ingredients: state.ingredients || [""],
        steps: state.steps || [""],
        cookingTime: state.cookingTime || "",
        servings: state.servings || "",
        video: state.video || "",
        image: null,
        difficulty: state.difficulty || "",
        tags: state.tags || "",
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleListChange = (e, index, field) => {
    const newList = [...formData[field]];
    newList[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  const addListItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeListItem = (index, field) => {
    const updatedList = [...formData[field]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      formData.ingredients.length === 0 ||
      formData.steps.length === 0
    ) {
      return toast.error("Please fill all required fields.");
    }

    const data = new FormData();

    for (const key in formData) {
      if (key === "ingredients" || key === "steps" || key === "tags") {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (id) {
        await axios.put(
          `https://cooktogether.onrender.com/recipes/${id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Recipe updated successfully!");
      } else {
        await axios.post(
          "https://cooktogether.onrender.com/recipes/createRecipe",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        console.log("data:", data);
        toast.success("Recipe created successfully!");
      }

      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      toast.error(error.response.data.msg || "Something went wrong!");
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        {id ? "Edit Recipe" : "Create New Recipe"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Recipe title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Brief description of your recipe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients
          </label>
          {formData.ingredients.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleListChange(e, index, "ingredients")}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="Ingredient name"
              />
              <button
                type="button"
                onClick={() => removeListItem(index, "ingredients")}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("ingredients")}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <Plus size={20} className="mr-1" /> Add Ingredient
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Steps
          </label>
          {formData.steps.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full">
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleListChange(e, index, "steps")}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder={`Step ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeListItem(index, "steps")}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("steps")}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <Plus size={20} className="mr-1" /> Add Step
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servings
            </label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="4"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeListItem(index, "tags")}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const newTag = e.target.value.trim();
                if (newTag) {
                  setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                  }));
                  e.target.value = "";
                }
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Type a tag and press Enter"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            name="video"
            value={formData.video}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md"
        >
          {id ? "update Recipe" : "Create New Recipe"}
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default CreateRecipeForm;
