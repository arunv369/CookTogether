import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  ShoppingCart,
  Check,
  X,
  ChevronDown,
  Clock,
  Users,
  User,
  ChefHat,
  Heart,
  BookmarkPlus,
  MessageSquare,
  Send,
  Star,
  Search,
  Copy,
  Link,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const RecipeDetail = () => {
  const { id } = useParams();
  // const [isLiked, setIsLiked] = useState(false);
  // const [isSaved, setIsSaved] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(4.2); // Example initial value
  const [totalRatings, setTotalRatings] = useState(128); // Example initial value
  const [hoveredStar, setHoveredStar] = useState(0);

  const [selectedTab, setSelectedTab] = useState("");
  const { recipes } = useAuth();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  console.log(recipes);

  const recipe = recipes?.find((r) => r._id === id);
  const recipeId = recipe?._id;

  useEffect(() => {
    if (!recipeId) return;
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(
          `hhttps://cooktogether.onrender.com/recipes/${recipeId}`,
          { withCredentials: true }
        );
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const res = await axios.get(
          `https://cooktogether.onrender.com/recipes/${id}`,
          { withCredentials: true }
        );
        const recipeData = res.data;

        setComments(recipeData.comments || []);

        const total = recipeData.ratings?.length || 0;
        const avg =
          total > 0
            ? recipeData.ratings.reduce((sum, r) => sum + r.value, 0) / total
            : 0;

        setAverageRating(avg.toFixed(1));
        setTotalRatings(total);

        const loggedUser = JSON.parse(localStorage.getItem("user"));
        const userRateObj = recipeData.ratings.find(
          (r) => r.user === loggedUser?.id
        );

        if (userRateObj) {
          setUserRating(userRateObj.value);
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // ✅ Safe conditional render, does not affect hooks
  if (!recipe) {
    return <div>Loading recipe...</div>;
  }
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  console.log("comments:", comments);

  console.log("recipe:", recipe);

  const {
    title,
    description,
    image,
    cookingTime,
    servings,
    difficulty,
    ingredients,
    steps,
    author,
    tags,
  } = recipe;

  const totalTime = cookingTime;

  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const handleComment = async () => {
    try {
      const { _id: id } = recipe;
      const { id: userId } = loggedUser;
      const data = { text: commentText, userId };

      const response = await axios.post(
        `https://cooktogether.onrender.com/recipes/${id}/comment`,
        data,
        { withCredentials: true }
      );

      setComments(response.data.comments);
      setCommentText("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-700">Recipe not found.</p>
      </div>
    );
  }

  const videoUrl = recipe.video;

  const handleRating = async (rating) => {
    setUserRating(rating); // Optimistic UI update

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://cooktogether.onrender.com/recipes/${id}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const { averageRating } = response.data;
      setAverageRating(Number(averageRating));
      setTotalRatings((prev) => (userRating === 0 ? prev + 1 : prev)); // Add only if first time
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={`${interactive ? "cursor-pointer" : ""} p-1 first:pl-0`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoveredStar || rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const shareRecipe = async () => {
    try {
      const { data } = await axios.post(
        `https://cooktogether.onrender.com/recipes/share/${id}`,
        {},
        { withCredentials: true }
      );

      const shareUrl1 = `https://cooktogether-b20.netlify.app/detailshared/${data.shareId}`;
      setShareUrl(shareUrl1);
      setShowShareModal(true);
    } catch (err) {
      console.error("Failed to share", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-[300px] md:h-[400px] bg-gray-900">
        <img
          src={`https://cooktogether.onrender.com/${image}`}
          alt="Recipe"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              {title}
            </h1>
            <p className="text-white text-lg opacity-90 mb-4">{description}</p>
            <div className="flex items-center">
              <img
                src={`https://cooktogether.onrender.com/${author.profilePic}`}
                alt={author.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="ml-2 text-white">{author.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 md:gap-8 mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Total Time</p>
                  <p className="font-medium">{totalTime} mins</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{servings}</p>
                </div>
              </div>
              <div className="flex items-center">
                <ChefHat className="h-5 w-5 text-primary-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${difficultyColor[difficulty]}`}
                  >
                    {difficulty}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Recipe Rating
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {renderStars(averageRating)}
                      <span className="ml-2 text-lg font-semibold text-gray-900">
                        {averageRating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({totalRatings} ratings)
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    Rate this recipe:
                  </p>
                  {renderStars(userRating, true)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium ${
                  selectedTab === "ingredients"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-primary-600"
                }`}
                onClick={() => setSelectedTab("ingredients")}
              >
                Ingredients
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  selectedTab === "steps"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-primary-600"
                }`}
                onClick={() => setSelectedTab("steps")}
              >
                steps
              </button>
            </div>

            <div className="py-6">
              {selectedTab === "ingredients" ? (
                <div>
                  <ul className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-600 mt-2"></span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <ol className="space-y-6">
                    {steps.map((instruction, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mr-3">
                          {index + 1}
                        </span>
                        <p className="text-gray-700">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
              {/* <button
                className={`flex items-center px-4 py-2 rounded-full ${
                  isLiked
                    ? "bg-accent-100 text-accent-600"
                    : "bg-gray-100 text-gray-700"
                } hover:bg-accent-50 hover:text-accent-600 transition-colors`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-5 w-5 mr-1 ${isLiked ? "fill-current" : ""}`}
                />
                {isLiked ? "Liked" : "Like"}
              </button> */}
              {/* <button
                className={`flex items-center px-4 py-2 rounded-full ${
                  isSaved
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-700"
                } hover:bg-primary-50 hover:text-primary-600 transition-colors`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <BookmarkPlus className="h-5 w-5 mr-1" />
                {isSaved ? "Saved" : "Save"}
              </button> */}
              <button
                onClick={shareRecipe}
                className="flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-1" />
                Share
              </button>

              <button className="flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <MessageSquare className="h-5 w-5 mr-1" />
                Comments ({comments.length})
              </button>
            </div>

            {showShareModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto sm:mx-4">
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Share Meal Plan
                      </h2>
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Share your meal plan with friends and family using this
                        link:
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-x-auto">
                          <div className="flex items-center">
                            <Link className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600 break-all">
                              {shareUrl}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleCopyLink}
                          className={`px-4 py-2 rounded-md transition-colors flex-shrink-0 ${
                            showCopySuccess
                              ? "bg-green-100 text-green-700"
                              : "bg-primary-600 text-white hover:bg-primary-700"
                          }`}
                        >
                          {showCopySuccess ? (
                            <span className="flex items-center">
                              <Check className="h-5 w-5 mr-1" />
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Copy className="h-5 w-5 mr-1" />
                              Copy
                            </span>
                          )}
                        </button>
                      </div>
                      {/* ✅ Social Share Icons */}
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Or share via social platforms:
                        </p>
                        <div className="flex flex-wrap justify-start gap-4 sm:gap-6">
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              shareUrl
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
                          </a>
                          <a
                            href={`https://www.instagram.com/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-500 hover:text-pink-600 transition-colors"
                          >
                            <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                              shareUrl
                            )}&text=Check+this+meal+plan!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                          >
                            <Twitter className="w-6 h-6 sm:w-7 sm:h-7" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comments
              </h3>

              <div className="flex items-start space-x-4 mb-6">
                {loggedUser.profilePic ? (
                  <img
                    src={`https://cooktogether.onrender.com/${loggedUser.profilePic}`}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-red-600"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-red-600 flex items-center justify-center bg-gray-100">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className="absolute bottom-2 right-2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-4">
                    {comment.user.profilePic ? (
                      <img
                        src={`https://cooktogether.onrender.com/${comment.user.profilePic}`}
                        alt={comment.user.profilePic}
                        className="h-8 w-8 rounded-full object-cover border-2 border-red-600"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border-2 border-red-600 flex items-center justify-center bg-gray-100">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {videoUrl && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recipe Video
                </h3>
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={getYouTubeEmbedUrl(videoUrl)}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
