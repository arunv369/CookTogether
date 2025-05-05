const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");

dotenv.config();
const app = express();

app.set("trust proxy", 1);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/userimage", express.static(path.join(__dirname, "userimage")));

app.use(cookieParser());

app.use(
  cors({
    origin: "https://cooktogether-b20.netlify.app",
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);
app.use("/meal-plans", mealPlanRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5001, () => console.log("Server running"));
});
