import { useEffect, useState } from "react";

export default function Header({ setSidebarOpen }) {
  const [status, setStatus] = useState({
    label: "Online",
    color: "green",
  });

  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");

    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const colorClasses = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    gray: "bg-gray-200 text-gray-600",
  };

  const profileLetter = username.charAt(0).toUpperCase();

  return (
    <header className="bg-white px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        {/* SYSTEM STATUS */}
        <div
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            colorClasses[status.color]
          }`}
        >
          {status.label}
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shadow">
            {profileLetter}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              {username}
            </span>

            <span className="text-xs text-gray-500">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}