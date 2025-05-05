import React, { useState } from "react";
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profilePic, name } = JSON.parse(localStorage.getItem("user"));
  console.log(profilePic);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <ChefHat className="h-8 w-8 text-red-600" strokeWidth={1.5} />
              <span className="ml-2 text-xl font-serif font-semibold text-gray-900">
                CookTogether
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/home"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/meal-planning"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Meal Planning
            </Link>
            <Link
              to="/community"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Community
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors">
              <span className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                {user.name}
              </span>
            </button>
            <Link to="/profile" className="flex items-center">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={name}
                  className="h-8 w-8 rounded-full object-cover border-2 border-red-600"
                />
              ) : (
                <div className="h-8 w-8 rounded-full border-2 border-red-600 flex items-center justify-center bg-gray-100">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Home
              </div>
            </Link>
            <Link
              to="/discover"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Discover
              </div>
            </Link>
            <Link
              to="/meal-planning"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Meal Planning
              </div>
            </Link>
            <Link
              to="/community"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Community
              </div>
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                My Profile
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
