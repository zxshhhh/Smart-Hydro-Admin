import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Smart Hydro | Login";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login(username, password);

    if (success) {
      navigate("/");
    } else {
      alert("Invalid credentials!\nTry:\nUsername: Admin\nPassword: 1234");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Smart Hydro Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-6 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-500 text-white py-2 w-full rounded hover:bg-green-600 cursor-pointer">
          Login
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Demo: Admin / 1234
        </p>
      </form>
    </div>
  );
}
