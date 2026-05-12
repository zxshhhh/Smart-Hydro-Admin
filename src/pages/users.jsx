import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/v1";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPlants, setUserPlants] = useState([]);
  const [loading, setLoading] = useState(false);

  /* MODAL STATE */
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH HELPERS ================= */

  const safeFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    const text = await res.text();

    if (!res.ok) {
      const text = await res.text();
      console.error("API ERROR:", text);
      throw new Error(text);
    }

    return text ? JSON.parse(text) : null;
  };

  /* ================= DATA LOAD ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await safeFetch(`${API}/users/`);

      setUsers(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlants = async (userId) => {
    try {
      const data = await safeFetch(
        `${API}/users/${userId}/plants/`
      );

      setUserPlants(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch {
      setUserPlants([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ACTIONS ================= */

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      alert("Username and password are required");
      return;
    }

    try {
      await safeFetch(`http://127.0.0.1:8000/register/`, {
        method: "POST",
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
        }),
      });

      setNewUsername("");
      setNewPassword("");
      setShowAddModal(false);

      fetchUsers();
    } catch (err) {
      console.error("Failed to add user");
      alert("Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await safeFetch(`${API}/users/${id}/`, {
        method: "DELETE",
      });

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );
    } catch {
      console.error("Delete failed");
    }
  };

  const handleUpdate = async (user) => {
    const username = prompt(
      "New Username:",
      user.username
    );

    if (!username) return;

    try {
      await safeFetch(`${API}/users/${user.id}/`, {
        method: "PUT",
        body: JSON.stringify({ username }),
      });

      fetchUsers();
    } catch {
      console.error("Update failed");
    }
  };

  const handleChangePassword = async (user) => {
    const password = prompt("New Password:");

    if (!password) return;

    try {
      await safeFetch(
        `${API}/users/${user.id}/change-password/`,
        {
          method: "PATCH",
          body: JSON.stringify({ password }),
        }
      );

      alert("Password updated");
    } catch {
      console.error("Password change failed");
    }
  };

  /* ================= FILTER ================= */

  const filtered = users.filter((u) =>
    u.username
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  /* ================= UI ================= */

  if (loading) {
    return (
      <p className="p-6">
        Loading users... because apparently databases
        enjoy dramatic entrances.
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Users Management
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Add User
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search users..."
        className="border p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-green-600"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* USERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-xl shadow space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold uppercase">
                {user.username?.charAt(0)}
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {user.username}
                </h2>

                <p className="text-xs text-gray-500">
                  User ID: {user.id}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap text-sm">
              <button
                onClick={() => handleUpdate(user)}
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                Delete
              </button>

              <button
                onClick={() =>
                  handleChangePassword(user)
                }
                className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
              >
                Change Password
              </button>

              <button
                onClick={() => {
                  setSelectedUser(user);
                  fetchUserPlants(user.id);
                }}
                className="text-green-600 hover:text-green-700 cursor-pointer"
              >
                View Plants
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* USER PLANTS */}
      {selectedUser && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-lg">
            Plants of {selectedUser.username}
          </h2>

          {userPlants.length === 0 ? (
            <p className="text-gray-500">
              No plants assigned. A hydroponics system
              without plants. Revolutionary agriculture.
            </p>
          ) : (
            <ul className="space-y-2">
              {userPlants.map((p) => (
                <li
                  key={p.id}
                  className="bg-gray-100 px-4 py-2 rounded-lg"
                >
                  🌱 {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Create User
              </h2>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-black text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) =>
                  setNewUsername(e.target.value)
                }
                className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}