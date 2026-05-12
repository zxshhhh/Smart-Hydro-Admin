import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(form.username, form.password);

      // redirect after login
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Smart Hydro Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-6 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-green-500 text-white py-2 w-full rounded hover:bg-green-600 cursor-pointer" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          {error && <span className="text-red-500">{error}</span>}
        </p>
      </form>
    </div>
  );
}
