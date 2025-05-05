const mongoose = require("mongoose");
const MealPlan = require("../models/MealPlan");
const { v4: uuidv4 } = require("uuid");

exports.saveMealPlan = async (req, res) => {
  const { weekStartDate, plan } = req.body;
  const userId = req.user.id;

  try {
    const normalizedDate = new Date(weekStartDate);
    normalizedDate.setHours(0, 0, 0, 0);

    const mealPlan = await MealPlan.findOne({
      user: new mongoose.Types.ObjectId(userId),
      weekStartDate: normalizedDate,
    });

    let updatedMealPlan;
    if (mealPlan) {
      mealPlan.plan = plan;
      updatedMealPlan = mealPlan;
    } else {
      updatedMealPlan = new MealPlan({
        user: new mongoose.Types.ObjectId(userId),
        weekStartDate: normalizedDate,
        plan,
      });
    }

    await updatedMealPlan.save();
    res.status(200).json({ message: "Meal plan saved successfully" });
  } catch (error) {
    console.error("Error saving meal plan:", error);
    res.status(500).json({ error: "Failed to save meal plan" });
  }
};

exports.getMealPlan = async (req, res) => {
  const { weekStartDate } = req.query;
  const userId = req.user.id;

  try {
    const normalizedDate = new Date(weekStartDate);
    normalizedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(normalizedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const mealPlan = await MealPlan.findOne({
      user: new mongoose.Types.ObjectId(userId),
      weekStartDate: {
        $gte: normalizedDate,
        $lt: nextDay,
      },
    }).populate({
      path: "plan",
      populate: { path: "breakfast lunch dinner snack" },
    });

    if (!mealPlan) {
      return res.status(404).json({ message: "No meal plan found" });
    }

    res.status(200).json(mealPlan);
  } catch (error) {
    console.error("Error in getMealPlan:", error);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
};

exports.shareMealPlan = async (req, res) => {
  const { weekStartDate } = req.body;
  const userId = req.user.id;

  try {
    const normalizedDate = new Date(weekStartDate);
    normalizedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(normalizedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const mealPlan = await MealPlan.findOne({
      user: new mongoose.Types.ObjectId(userId),
      weekStartDate: {
        $gte: normalizedDate,
        $lt: nextDay,
      },
    });

    if (!mealPlan)
      return res.status(404).json({ message: "Meal plan not found" });

    if (!mealPlan.shareId) {
      mealPlan.shareId = uuidv4();
      mealPlan.isShared = true;
      await mealPlan.save();
    }

    res.status(200).json({ shareId: mealPlan.shareId });
  } catch (error) {
    res.status(500).json({ error: "Failed to share meal plan" });
  }
};

exports.getSharedMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ shareId: req.params.shareId })
      .populate("plan.$*.breakfast", "title")
      .populate("plan.$*.lunch", "title")
      .populate("plan.$*.dinner", "title")
      .populate("plan.$*.snack", "title");

    if (!mealPlan) return res.status(404).json({ message: "Not found" });

    res.json(mealPlan);
  } catch (err) {
    console.error("Error fetching shared meal plan", err);
    res.status(500).json({ message: "Server error" });
  }
};
