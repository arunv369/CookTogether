import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./dashboard/DashboardLayout";
import CreateRecipe from "./dashboard/CreateRecipe";
import RecipeList from "./dashboard/RecipeList";
import Settings from "./dashboard/Settings";
import UserLayout from "./layout/UserLayout";
import ProtectedRoute from "./pages1/ProtectedRoute";
import SharedMealPlan from "./pages1/SharedMealPlan";
import RecipeDetailShared from "./pages1/RecipeDetailShared";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import UserList from "./dashboard/UserList";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/detailshared/:shareId"
            element={<RecipeDetailShared />}
          />
          <Route path="/shared/:shareId" element={<SharedMealPlan />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="create" element={<CreateRecipe />} />
            <Route path="edit/:id" element={<CreateRecipe />} />
            <Route path="recipelist" element={<RecipeList />} />
            <Route path="users" element={<UserList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="/*"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
