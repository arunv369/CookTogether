import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  console.log("users:", users);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("https://cooktogether.onrender.com/users", {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to load users", err);
      }
    };

    fetchAllUsers();
  }, []);

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://cooktogether.onrender.com/users/${selectedUserId}`,
        {
          withCredentials: true,
        }
      );

      setUsers(users.filter((user) => user._id !== selectedUserId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedUserId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.slice(1).map((user) => (
          <div
            key={user._id}
            className="bg-white rounded shadow p-4 border hover:shadow-md transition"
          >
            {user.profilePic ? (
              <img
                src={`https://cooktogether.onrender.com/${user.profilePic}`}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border-2 border-red-600"
              />
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-red-600 flex items-center justify-center bg-gray-100">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            )}
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
            <div className="flex justify-between text-sm mt-2">
              <p>
                Recipes:{" "}
                <span className="font-bold">{user.recipeCount || 0}</span>
              </p>
              <p>
                Following:{" "}
                <span className="font-bold">{user.following?.length || 0}</span>
              </p>
              <p>
                Followers:{" "}
                <span className="font-bold">{user.followers?.length || 0}</span>
              </p>
            </div>
            <button
              onClick={() => handleDeleteClick(user._id)}
              className="mt-4 text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default UserList;
