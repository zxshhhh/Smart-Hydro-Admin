import { getUser } from "../services/auth";
import { useEffect, useState } from "react";
import { getSystemStatus } from "../services/systemStatusService";

export default function Header() {
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
    <header className="bg-white px-8 py-4 flex justify-end items-center">
      {/* Right Side */}
      <div className="flex items-center gap-6">
        <div
          className={`px-4 py-2 rounded-full text-sm ${
            colorClasses[status.color]
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
