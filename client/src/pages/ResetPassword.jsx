import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://cooktogether.onrender.com/auth/reset-password/${token}`,
        {
          password,
        }
      );
      toast.success("Password reset successful. You can now login.");
      setPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Reset Password
          </button>
        </form>
      </div>
      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ResetPassword;
