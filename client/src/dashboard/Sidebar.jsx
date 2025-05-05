import { NavLink } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

const Sidebar = ({ isOpen, onClose }) => {
  const navLinks = [
    { name: "Create Recipe", path: "/admin-dashboard/create" },
    { name: "Recipe List", path: "/admin-dashboard/recipelist" },
    { name: "Manage Users", path: "/admin-dashboard/users" },
    { name: "Settings", path: "/admin-dashboard/settings" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 space-y-6 transform transition-transform duration-300 z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-auto md:block`}
    >
      <div className="flex justify-between items-center md:hidden">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={onClose}>
          <AiOutlineClose className="text-white text-2xl" />
        </button>
      </div>
      <h2 className="text-2xl font-bold hidden md:block">Admin Panel</h2>
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
