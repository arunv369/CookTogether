const mongoose = require("mongoose");

const recipeRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Recipe",
  default: null,
};

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStartDate: { type: Date, required: true },
  plan: {
    type: Map,
    of: {
      breakfast: recipeRef,
      lunch: recipeRef,
      dinner: recipeRef,
      snack: recipeRef,
    },
    required: true,
  },
  isShared: { type: Boolean, default: false },
  shareId: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);
