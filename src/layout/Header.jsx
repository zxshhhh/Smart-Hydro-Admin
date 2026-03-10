import { getUser } from "../services/auth";
import { useEffect, useState } from "react";
import { getSystemStatus } from "../services/systemStatusService";

export default function Header({ setSidebarOpen }) {
  const user = getUser();
  const [status, setStatus] = useState({
    label: "Checking...",
    color: "gray",
  });

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getSystemStatus());
    };
    updateStatus();
    window.addEventListener("plantUpdated", updateStatus);
    return () =>
      window.removeEventListener("plantUpdated", updateStatus);
  }, []);

  const colorClasses = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    gray: "bg-gray-200 text-gray-600",
  };
  return (
    <header className="bg-white px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
      {/* Mobile Menu Button - Left Side */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        <div
          className={`px-4 py-2 rounded-full text-sm ${colorClasses[status.color]
            }`}
        >
          {status.label}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.username}
          </span>
        </div>
      </div>
    </header>
  );
}
