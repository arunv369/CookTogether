import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import UserCard from "../components/common/UserCard";
import axios from "axios";

const CommunityPage = () => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    try {
      const fetchuserdata = async () => {
        const response = await axios.get(
          "https://cooktogether.onrender.com/users",
          { withCredentials: true }
        );
        setUserData(response.data);
      };
      fetchuserdata();
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log("userData:", userData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          Featured Creators
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with talented chefs, home cooks, and food enthusiasts sharing
          their culinary journey
        </p>
      </div>

      {userData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userData.slice(1).map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-2">
            No creators found matching your search
          </p>
          <p className="text-sm text-gray-400">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
