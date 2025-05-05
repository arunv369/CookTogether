import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Settings;
