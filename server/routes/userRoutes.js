// routes/userRoutes.js
const express = require("express");
const {
  followUser,
  unfollowUser,
  addFavorite,
  removeFavorite,
  getUserStats,
  getUserProfile,
  updateUserProfile,
  saveRecipe,
  unsaveRecipe,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, authenticateUser } = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-profiles", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const router = express.Router();

const upload = multer({ storage });

router.get("/:id", getUserProfile);
router.get("/", getUsers);

router.put("/:id", upload.single("profilePic"), updateUserProfile);
router.put("/follow/:id", authenticateUser, followUser);
router.put("/unfollow/:id", authenticateUser, unfollowUser);

router.get("/stats/:id", protect, getUserStats);

router.post("/:id/save", saveRecipe);

router.post("/:id/unsave", unsaveRecipe);

router.delete("/:id", protect, deleteUser);

module.exports = router;
