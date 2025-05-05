import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import UserCard from "../common/UserCard";
import { Link } from "react-router-dom";
import axios from "axios";

const CommunitySection = () => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    try {
      const fetchuserdata = async () => {
        const response = await axios.get("http://localhost:5001/users");
        setUserData(response.data);
      };
      fetchuserdata();
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log("userData:", userData);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Featured Creators
          </h2>
          <Link
            to="/community"
            className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {userData.slice(1).map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
