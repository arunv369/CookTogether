import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const excludedRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password/:token",
      "/shared/:shareId",
      "/detailshared/:shareId",
    ];

    const isExcluded =
      excludedRoutes.includes(location.pathname) ||
      location.pathname.startsWith("/reset-password/") ||
      location.pathname.startsWith("/shared/") ||
      location.pathname.startsWith("/detailshared/");

    if (isExcluded) return;

    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://cooktogether.onrender.com/auth/verify-token",
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        navigate("/login", err);
      }
    };

    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(
          "https://cooktogether.onrender.com/recipes",
          { withCredentials: true }
        );
        setRecipes(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecipes();
  }, []);

  const signup = async (name, email, password) => {
    const res = await axios.post(
      "https://cooktogether.onrender.com/auth/signup",
      { name, email, password },
      { withCredentials: true }
    );
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(
      "https://cooktogether.onrender.com/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await axios.get("https://cooktogether.onrender.com/auth/logout", {
      withCredentials: true,
    });
    toast.success("Logout successful");
    localStorage.removeItem("user");
    setUser(null);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const value = { user, login, logout, setUser, signup, recipes };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
