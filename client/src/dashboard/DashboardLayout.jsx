import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 md:hidden text-2xl text-gray-900"
      >
        <HiMenu />
      </button>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <main className="flex-1 p-4 md:p-8 overflow-auto w-full md:ml-14">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
