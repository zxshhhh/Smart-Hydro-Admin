import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={`bg-white flex flex-col justify-between fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
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
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
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
            onClick={handleLinkClick}
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
