const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  bio: String,
  profilePic: {
    type: String,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  savedRecipe: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
