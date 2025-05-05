const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/save", authenticateUser, mealPlanController.saveMealPlan);
router.get("/", authenticateUser, mealPlanController.getMealPlan);
router.post("/share", authenticateUser, mealPlanController.shareMealPlan);
router.get("/shared/:shareId", mealPlanController.getSharedMealPlan);

module.exports = router;
