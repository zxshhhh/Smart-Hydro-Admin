import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 p-6">
          <div className="bg-green-500 text-white p-2 rounded-lg">
            🌱
          </div>
          <h1 className="font-bold text-lg">Smart Hydro</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${isActive
                ? "bg-green-100 text-green-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${isActive
                ? "bg-green-100 text-green-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Analytics
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${isActive
                ? "bg-green-100 text-green-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/plants"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${isActive
                ? "bg-green-100 text-green-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Plants
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${isActive
                ? "bg-green-100 text-green-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
