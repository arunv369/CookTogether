import React from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User,
  BookOpen,
  Calendar,
  Users,
  ChefHat,
} from "lucide-react";

const Nav = () => {
  return (
    <nav className="bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/login" className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600" strokeWidth={1.5} />
              <span className="ml-2 text-xl font-serif font-semibold text-gray-900">
                CookTogether
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
