import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [interval, setInterval] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    document.title = "Smart Hydro | Settings";
  }, []);

  useEffect(() => {
    setInterval(localStorage.getItem("interval") || "");
    setAmount(localStorage.getItem("amount") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("interval", interval);
    localStorage.setItem("amount", amount);
    alert("Settings Saved!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        System Configuration
      </h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Watering Interval (hours)"
          className="border p-2 rounded w-full"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />

        <input
          type="number"
          placeholder="Water Amount (ml)"
          className="border p-2 rounded w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
