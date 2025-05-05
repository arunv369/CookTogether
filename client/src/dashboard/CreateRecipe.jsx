import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateRecipe = () => {
  const { state } = useLocation();
  const id = state?._id;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    steps: [""],
    cookingTime: "",
    servings: "",
    video: "",
    image: null,
  });

  const navigate = useNavigate();

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
      if (key === "ingredients" || key === "steps") {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5001/recipes/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Recipe updated successfully!");
      } else {
        await axios.post("http://localhost:5001/recipes/createRecipe", data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Recipe created successfully!");
      }

      setTimeout(() => navigate("/admin-dashboard/recipelist"), 1500);
    } catch (error) {
      toast.error(error.response.data.msg || "Something went wrong!");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Recipe" : "Create New Recipe"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block font-semibold">Ingredients</label>
          {formData.ingredients.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                value={item}
                onChange={(e) => handleListChange(e, index, "ingredients")}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeListItem(index, "ingredients")}
                className="text-red-600"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("ingredients")}
            className="text-blue-600 underline"
          >
            + Add Ingredient
          </button>
        </div>

        <div>
          <label className="block font-semibold">Steps</label>
          {formData.steps.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                value={item}
                onChange={(e) => handleListChange(e, index, "steps")}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeListItem(index, "steps")}
                className="text-red-600"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("steps")}
            className="text-blue-600 underline"
          >
            + Add Step
          </button>
        </div>

        <input
          name="cookingTime"
          value={formData.cookingTime}
          onChange={handleChange}
          placeholder="Cooking Time (e.g., 30 mins)"
          className="w-full p-2 border rounded"
        />

        <input
          name="servings"
          value={formData.servings}
          onChange={handleChange}
          placeholder="Servings"
          className="w-full p-2 border rounded"
        />

        <input
          name="video"
          value={formData.video}
          onChange={handleChange}
          placeholder="YouTube Video URL"
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {id ? "Update" : "Create"} Recipe
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default CreateRecipe;
