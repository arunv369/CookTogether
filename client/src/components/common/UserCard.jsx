import React, { useState, useEffect } from "react";
import { UserPlus, UserMinus, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const token = localStorage.getItem("token");

  console.log("user:", user);

  useEffect(() => {
    if (currentUser?.following?.includes(user._id)) {
      setIsFollowing(true);
    }
  }, [currentUser, user._id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.put(
          `https://cooktogether.onrender.com/users/unfollow/${user._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await axios.put(
          `https://cooktogether.onrender.com/users/follow/${user._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("You cannot follow yourself");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start">
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

        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {user.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{user.bio}</p>
          <div className="flex items-center text-xs text-gray-600 space-x-2">
            <span>{user.recipeCount} recipes</span>
            <span>{followersCount} followers</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={handleFollowToggle}
          className={`w-full py-1.5 px-3 ${
            isFollowing
              ? "bg-red-50 text-red-700 hover:bg-red-100"
              : "bg-primary-50 text-primary-700 hover:bg-primary-100"
          } transition-colors rounded flex items-center justify-center text-sm`}
        >
          {isFollowing ? (
            <UserMinus size={16} className="mr-1" />
          ) : (
            <UserPlus size={16} className="mr-1" />
          )}
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default UserCard;
