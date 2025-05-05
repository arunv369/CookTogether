import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecipeForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    servings: "",
    video: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const { title, description, ingredients, steps, cookingTime, servings } =
      form;
    if (
      !title ||
      !description ||
      !ingredients ||
      !steps ||
      !cookingTime ||
      !servings ||
      !image
    ) {
      return toast.error("All fields except video are required!");
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("ingredients", JSON.stringify(form.ingredients.split(",")));
      data.append("steps", JSON.stringify(form.steps.split(",")));
      data.append("cookingTime", form.cookingTime);
      data.append("servings", form.servings);
      data.append("video", form.video);
      data.append("image", image);

      await axios.post("http://localhost:5001/recipes", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Recipe submitted successfully!");
      setForm({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        cookingTime: "",
        servings: "",
        video: "",
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Submission failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Submit Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "description", "cookingTime", "servings", "video"].map(
          (field) => (
            <input
              key={field}
              type={
                field === "cookingTime" || field === "servings"
                  ? "number"
                  : "text"
              }
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          )
        )}

        <textarea
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={form.ingredients}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <textarea
          name="steps"
          placeholder="Steps (comma separated)"
          value={form.steps}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded px-4 py-2"
        />

        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}

        {form.video && (
          <div className="mt-2">
            <iframe
              className="w-full h-64 rounded"
              src={form.video.replace("watch?v=", "embed/")}
              title="Recipe Video"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Recipe
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RecipeForm;

// import { useState } from "react";
// import API from "../api/axiosInstance";
// import { useNavigate } from "react-router-dom";

// function SubmitRecipe() {
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [ingredients, setIngredients] = useState([""]);
//   const [steps, setSteps] = useState([""]);
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");
//   const [time, setTime] = useState("");
//   const [servings, setServings] = useState("");
//   const [error, setError] = useState("");

//   const handleIngredientChange = (index, value) => {
//     const updated = [...ingredients];
//     updated[index] = value;
//     setIngredients(updated);
//   };

//   const handleStepChange = (index, value) => {
//     const updated = [...steps];
//     updated[index] = value;
//     setSteps(updated);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const addIngredient = () => setIngredients([...ingredients, ""]);
//   const addStep = () => setSteps([...steps, ""]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("time", time);
//     formData.append("servings", servings);
//     formData.append("videoUrl", videoUrl);
//     formData.append("image", image);
//     formData.append("ingredients", JSON.stringify(ingredients));
//     formData.append("steps", JSON.stringify(steps));

//     try {
//       await API.post("/recipes", formData);
//       navigate("/");
//     } catch (err) {
//       setError("Submission failed. Try again.", err);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded mt-6 mb-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">
//         Submit Your Recipe
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Recipe Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="w-full px-4 py-2 border rounded"
//         />

//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Cooking Time (e.g., 30 mins)"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//             className="w-full px-4 py-2 border rounded"
//           />
//           <input
//             type="text"
//             placeholder="Servings"
//             value={servings}
//             onChange={(e) => setServings(e.target.value)}
//             className="w-full px-4 py-2 border rounded"
//           />
//         </div>

//         <div>
//           <h4 className="font-semibold">Ingredients</h4>
//           {ingredients.map((ing, idx) => (
//             <input
//               key={idx}
//               type="text"
//               value={ing}
//               onChange={(e) => handleIngredientChange(idx, e.target.value)}
//               placeholder={`Ingredient ${idx + 1}`}
//               className="w-full my-1 px-4 py-2 border rounded"
//             />
//           ))}
//           <button
//             type="button"
//             onClick={addIngredient}
//             className="text-blue-600 text-sm hover:underline"
//           >
//             + Add Ingredient
//           </button>
//         </div>

//         <div>
//           <h4 className="font-semibold">Steps</h4>
//           {steps.map((step, idx) => (
//             <textarea
//               key={idx}
//               value={step}
//               onChange={(e) => handleStepChange(idx, e.target.value)}
//               placeholder={`Step ${idx + 1}`}
//               className="w-full my-1 px-4 py-2 border rounded"
//             />
//           ))}
//           <button
//             type="button"
//             onClick={addStep}
//             className="text-blue-600 text-sm hover:underline"
//           >
//             + Add Step
//           </button>
//         </div>

//         <div>
//           <h4 className="font-semibold">Recipe Image</h4>
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//           {preview && (
//             <img
//               src={preview}
//               alt="preview"
//               className="w-full h-64 object-cover rounded mt-2"
//             />
//           )}
//         </div>

//         <input
//           type="text"
//           placeholder="Video URL (e.g., YouTube)"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           className="w-full px-4 py-2 border rounded"
//         />

//         {error && <p className="text-red-500">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Submit Recipe
//         </button>
//       </form>
//     </div>
//   );
// }

// export default SubmitRecipe;
