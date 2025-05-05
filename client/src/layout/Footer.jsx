import React from "react";
import { Mail, Instagram, Twitter, Facebook, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-primary-600" strokeWidth={1.5} />
              <span className="ml-2 text-xl font-serif font-semibold text-gray-900">
                CookTogether
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Discover, plan, and share your culinary journey with a community
              of food enthusiasts.
            </p>
            <div className="flex space-x-4 mt-6 justify-center md:justify-start">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/discover"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/meal-planning"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Meal Plans
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              User
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/create-recipe-form"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Discover
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} CookTogether. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
