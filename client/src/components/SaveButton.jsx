import { useState, useEffect } from "react";
import API from "../api/axiosInstance";

const SaveButton = ({ recipeId }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const res = await API.get(`/users/saved/${recipeId}`);
        setSaved(res.data.isSaved);
      } catch (err) {
        console.error("Auth required to check saved recipe", err);
      }
    };
    checkSaved();
  }, [recipeId]);

  const toggleSave = async () => {
    try {
      await API.post(`/users/save/${recipeId}`);
      setSaved((prev) => !prev);
    } catch (err) {
      alert("Please log in to save recipes.", err);
    }
  };

  return (
    <button onClick={toggleSave} className="text-red-500 text-xl">
      {saved ? "💖 Saved" : "🤍 Save"}
    </button>
  );
};

export default SaveButton;
