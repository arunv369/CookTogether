const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    ingredients: {
      type: [String],
      validate: [
        (arr) => arr.length > 0,
        "At least one ingredient is required",
      ],
    },
    steps: {
      type: [String],
      validate: [(arr) => arr.length > 0, "At least one step is required"],
    },
    cookingTime: {
      type: String,
      required: false,
    },
    servings: {
      type: Number,
      min: 1,
      max: 20,
      required: false,
    },
    image: { type: String },
    difficulty: { type: String },
    tags: {
      type: [String],
      validate: [(arr) => arr.length > 0, "At least one tags is required"],
    },
    video: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https:\/\/(www\.)?youtube\.com\/watch\?v=/.test(v);
        },
        message: "Only YouTube video links are allowed.",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    isShared: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
