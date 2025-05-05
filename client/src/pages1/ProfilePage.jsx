import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit,
  GridIcon,
  Calendar,
  Bookmark,
  Settings,
  Plus,
  UserPlus,
  User,
  LogOut,
} from "lucide-react";
import RecipeCard from "../components/common/RecipeCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EditProfileModal from "../components/profile/EditProfileModal";
import axios from "axios";
import CreateRecipeForm from "../components/Recipe/CreateRecipeForm";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, logout } = useAuth();
  const user1 = JSON.parse(localStorage.getItem("user"));
  const { id: currentId } = user1;

  const [activeTab, setActiveTab] = useState("recipes");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [user, setUser] = useState(null);
  console.log(userRecipes);

  const isOwnProfile = id;

  const savedRecipes = recipes.filter((recipe) =>
    user1.savedRecipe.includes(recipe._id)
  );
  console.log("savedRecipes:", savedRecipes);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://cooktogether.onrender.com/users/${id}`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleRemoveFromFavorites = async (recipe) => {
    const { id } = recipe;
    const data = { userId: currentId };
    try {
      await axios.post(
        `https://cooktogether.onrender.com/users/${id}/unsave`,
        data,
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch user's recipes
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const res = await axios.get(
          `https://cooktogether.onrender.com/recipes/user/${id}`,
          { withCredentials: true }
        );
        setUserRecipes(res.data);
      } catch (err) {
        console.error("Error fetching user recipes:", err);
      }
    };

    fetchUserRecipes();
  }, [id]);

  // Handle editing the profile
  const handleEditProfile = async (updatedUserData) => {
    try {
      const res = await axios.put(
        `https://cooktogether.onrender.com/users/${id}`,
        updatedUserData,
        { withCredentials: true }
      );
      setUser(res.data);

      toast.success("profile Updated Successfully!");
      setShowEditProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-primary-700 h-40 relative"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  {user.profilePic ? (
                    <img
                      src={`https://cooktogether.onrender.com/${user.profilePic}`}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border-2 border-red-600"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-red-600 flex items-center justify-center bg-gray-100">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 text-center sm:text-left">
                  <h1 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="mt-2 text-sm text-gray-700">{user.bio}</p>
                </div>
              </div>
              <div className="mt-5 flex justify-center sm:mt-0">
                {isOwnProfile ? (
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-around sm:justify-start sm:space-x-12 text-center sm:text-left">
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {userRecipes.length}
                </p>
                <p className="text-sm text-gray-500">Recipes</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {user.followers?.length || 0}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {user.following?.length || 0}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("recipes")}
                className={`whitespace-nowrap py-4 px-1 mx-5 border-b-2 font-medium text-sm ${
                  activeTab === "recipes"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <GridIcon className="h-4 w-4 mr-2" />
                  Recipes
                </div>
              </button>
              {/* <button
                onClick={() => setActiveTab("mealplans")}
                className={`whitespace-nowrap py-4 px-1 mx-5 border-b-2 font-medium text-sm ${
                  activeTab === "mealplans"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Meal Plans
                </div>
              </button> */}
              <button
                onClick={() => setActiveTab("favorites")}
                className={`whitespace-nowrap py-4 px-1 mx-5 border-b-2 font-medium text-sm ${
                  activeTab === "favorites"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Favorites
                </div>
              </button>

              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`whitespace-nowrap py-4 px-1 mx-5 border-b-2 font-medium text-sm ${
                    activeTab === "settings"
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </div>
                </button>
              )}
            </nav>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === "recipes" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Recipes</h2>
                {isOwnProfile && (
                  <button
                    onClick={() => navigate("/create-recipe-form")}
                    className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Recipe
                  </button>
                )}
              </div>

              {userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      showActions={isOwnProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500 mb-4">No recipes yet</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate("/create-recipe-form")}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Recipe
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* {activeTab === "mealplans" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                  Meal Plans
                </h2>
                {isOwnProfile && (
                  <button className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Plan
                  </button>
                )}
              </div>

              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">No meal plans yet</p>
                {isOwnProfile && (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Meal Plan
                  </button>
                )}
              </div>
            </div>
          )} */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Favorite Recipes
              </h2>

              {savedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      showActions={false}
                      onDelete={() => handleRemoveFromFavorites(recipe)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No favorite recipes yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Save recipes you love to find them easily later
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && isOwnProfile && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Account Settings
              </h2>

              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Settings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Manage your account settings and preferences
                  </p>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Account Management
                  </h3>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={handleEditProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
