const express = require("express");
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  commentRecipe,
  rateRecipe,
  searchRecipes,
  updateRecipe,
  deleteRecipe,
  getUserRecipes,
  likeRecipe,
  unlikeRecipe,
  getRecipesByIds,
  shareRecipe,
  getSharedRecipe,
} = require("../controllers/recipeController");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const {
  protect,
  isAdmin,
  authenticateUser,
} = require("../middleware/authMiddleware");

const upload = multer({ storage });

const router = express.Router();

router.get("/", getRecipes);
router.get("/bulk", getRecipesByIds);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);
router.get("/user/:userId", getUserRecipes);

router.post("/createRecipe", protect, upload.single("image"), createRecipe);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);

router.post("/:id/comment", commentRecipe);
router.post("/:id/rate", authenticateUser, rateRecipe);

router.post("/:id/like", likeRecipe);
router.post("/:id/unlike", unlikeRecipe);

router.post("/share/:id", protect, shareRecipe);
router.get("/shared/:shareId", getSharedRecipe);

module.exports = router;
