import { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    username: "",
    email: "",
    role: "Operator",
  });

  useEffect(() => {
    document.title = "Smart Hydro | Users Management";
  }, []);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.id) {
      updateUser(form);
    } else {
      addUser(form);
    }

    setForm({ id: null, username: "", email: "", role: "Operator" });
    refreshUsers();
  };

  const handleEdit = (user) => {
    setForm(user);
  };

  const handleDelete = (id) => {
    deleteUser(id);
    refreshUsers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-6"
      >
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded transition hover:bg-green-100"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded transition hover:bg-green-100"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <select
            className="border p-2 rounded cursor-pointer transition hover:bg-green-100"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option>Administrator</option>
            <option>Operator</option>
          </select>
        </div>

        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded cursor-pointer transition hover:bg-green-700">
          {form.id ? "Update User" : "Add User"}
        </button>
      </form>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer transition hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
