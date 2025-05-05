import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HomePage from "../pages1/HomePage";
import RecipeDetail from "../pages1/RecipeDetail";
import ProfilePage from "../pages1/ProfilePage";
import DiscoverPage from "../pages1/DiscoverPage";
import MealPlanningPage from "../pages1/MealPlanningPage";
import CreateRecipeForm from "../components/Recipe/CreateRecipeForm";
import CommunityPage from "../pages1/CommunityPage";

function UserLayout() {
  const { id } = JSON.parse(localStorage.getItem("user"));
  console.log(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/profile/:id" element={<ProfilePage />} />

          <Route
            path="/profile"
            element={
              id ? (
                <Navigate to={`/profile/${id}`} replace />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route path="/Community" element={<CommunityPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/meal-planning" element={<MealPlanningPage />} />
          <Route path="/create-recipe-form" element={<CreateRecipeForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default UserLayout;
