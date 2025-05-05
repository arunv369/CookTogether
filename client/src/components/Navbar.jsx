import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          RecipeShare
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-emerald-500">
            Home
          </Link>
          <Link to="/submit" className="hover:text-emerald-500">
            Share Recipe
          </Link>
          <Link to="/meal-planner" className="hover:text-emerald-500">
            Meal Planner
          </Link>
          <Link to="/profile" className="hover:text-emerald-500">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
