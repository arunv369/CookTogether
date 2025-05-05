const Recipe = require("../models/Recipe.js");
const { v4: uuidv4 } = require("uuid");

exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      video,
      cookingTime,
      servings,
      difficulty,
      tags,
    } = req.body;
    const image = req.file?.path;

    if (video && !/^https:\/\/(www\.)?youtube\.com\/watch\?v=/.test(video)) {
      return res
        .status(400)
        .json({ msg: "Only YouTube video links are allowed." });
    }

    if (
      !title ||
      !description ||
      !ingredients ||
      !steps ||
      !video ||
      !cookingTime ||
      !servings ||
      !image ||
      !difficulty ||
      !tags
    ) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const parsedIngredients = JSON.parse(ingredients);
    const parsedSteps = JSON.parse(steps);
    const parsedTags = JSON.parse(tags);

    const recipe = new Recipe({
      title,
      description,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      image,
      video,
      author: req.user.id,
      cookingTime,
      servings,
      difficulty,
      tags: parsedTags,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("author", [
      "name",
      "profilePic",
    ]);
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "name")
      .populate("comments.user", "name profilePic");

    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    const avgRating = recipe.ratings.length
      ? recipe.ratings.reduce((acc, r) => acc + r.value, 0) /
        recipe.ratings.length
      : 0;

    res.json({ ...recipe._doc, averageRating: avgRating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.commentRecipe = async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    recipe.comments.push({
      user: userId,
      text,
      createdAt: new Date(),
    });

    await recipe.save();

    const updatedRecipe = await Recipe.findById(recipe._id)
      .populate("comments.user", "name profilePic")
      .populate("author", "name");

    res.status(201).json({ comments: updatedRecipe.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Comment server error" });
  }
};

exports.rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    const existingRating = recipe.ratings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingRating) {
      existingRating.value = rating;
    } else {
      recipe.ratings.push({ user: req.user.id, value: rating });
    }

    await recipe.save();

    const avgRating =
      recipe.ratings.reduce((sum, r) => sum + r.value, 0) /
      recipe.ratings.length;

    res.json({
      msg: "Rating submitted successfully",
      averageRating: avgRating.toFixed(1),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.searchRecipes = async (req, res) => {
  try {
    const {
      searchQuery,
      ingredients = [],
      diet,
      mealType,
      cuisine,
      minRating = 0,
    } = req.query;

    const filter = {};

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (Array.isArray(ingredients) && ingredients.length > 0) {
      filter.ingredients = {
        $all: ingredients.map((i) => new RegExp(i, "i")),
      };
    }

    const tagFilters = [];
    if (diet) tagFilters.push(diet);
    if (mealType) tagFilters.push(mealType);
    if (cuisine) tagFilters.push(cuisine);
    if (tagFilters.length > 0) {
      filter.tags = { $all: tagFilters };
    }

    const recipes = await Recipe.find(filter).populate("author", [
      "name",
      "profilePic",
    ]);

    const filteredByRating = recipes.filter((recipe) => {
      const values = recipe.ratings?.map((r) => r.value) || [];
      const average =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0;
      return average >= Number(minRating);
    });

    res.json(filteredByRating);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error during search" });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      cookingTime,
      servings,
      video,
      difficulty,
      tags,
    } = req.body;
    const image = req.file?.path;

    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(ingredients && { ingredients: JSON.parse(ingredients) }),
      ...(steps && { steps: JSON.parse(steps) }),
      ...(cookingTime && { cookingTime }),
      ...(servings && { servings }),
      ...(video && { video }),
      ...(image && { image }),
      ...(difficulty && { difficulty }),
      ...(tags && { tags: JSON.parse(tags) }),
    };

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ msg: "Update failed", error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    res.json({ msg: "Recipe Deleted Successfully", recipe });
  } catch (err) {
    res.status(400).json({ msg: "Delete failed", error: err.message });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userRecipes = await Recipe.find({ author: userId }).populate(
      "author",
      ["name", "profilePic"]
    );

    res.json(userRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { userId } = req.body;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    recipe.likes.push(userId);

    await recipe.save();

    res.json({
      msg: "Recipe liked successfully.",
      likesCount: recipe.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.unlikeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { userId } = req.body;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    if (!recipe.likes.includes(userId)) {
      return res.status(400).json({ msg: "You have not liked this recipe." });
    }

    recipe.likes = recipe.likes.filter((id) => id.toString() !== userId);
    await recipe.save();

    res.json({
      msg: "Recipe unliked successfully.",
      likesCount: recipe.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getRecipesByIds = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",") || [];

    if (!ids.length) {
      return res.status(400).json({ message: "No recipe IDs provided" });
    }

    const recipes = await Recipe.find({ _id: { $in: ids } });
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes by IDs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.shareRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const shareId = uuidv4();
    recipe.shareId = shareId;
    recipe.sharedAt = new Date();

    await recipe.save();

    res.status(200).json({ shareId });
  } catch (err) {
    console.error("Error sharing recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSharedRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      shareId: req.params.shareId,
    }).populate("author", "name");

    if (!recipe)
      return res.status(404).json({ message: "Shared recipe not found" });

    res.json(recipe);
  } catch (err) {
    console.error("Fetch shared recipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
