import { useEffect, useState } from "react";
import {
  getPlants,
  addPlant,
  updatePlant,
  deletePlant,
  togglePump,
} from "../services/plantService";

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const loadPlants = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/plants/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      setPlants(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load plants:", err);
      setPlants([]);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const handleAdd = async () => {
  if (!newName.trim()) return;

  try {
    await addPlant({ name: newName });

    setNewName("");
    loadPlants();
  } catch (err) {
    console.error("ADD PLANT ERROR:", err);
  }
};

  const handleEdit = (plant) => {
    setEditingId(plant.id);
    setEditName(plant.name);
  };

  const handleSave = async () => {
    await updatePlant(editingId, {
      name: editName,
    });

    setEditingId(null);
    setEditName("");
    loadPlants();
  };

  const handleDelete = async (id) => {
    await deletePlant(id);
    loadPlants();
  };

  const handlePump = async (plant) => {
    await togglePump(plant.id, !plant.pump_status);
    loadPlants();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Plant Management</h1>
      {/* ADD FORM */}
      <div className="bg-white p-5 rounded-xl shadow flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Plant name"
          className="flex-1 p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-green-600 transition-all ease-in-out duration-150"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-5 rounded-lg cursor-pointer hover:bg-green-700 transition-all ease-in-out duration-150"
        >
          Add
        </button>
      </div>
      {/* PLANT LIST */}
      <div className="grid grid-cols-2 gap-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white p-5 rounded-xl shadow space-y-4"
          >
            {editingId === plant.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  className="w-full p-2 bg-gray-100 rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 px-3 py-1 rounded cursor-pointer hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    {plant.name}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plant)}
                      className="text-blue-600 text-sm cursor-pointer hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plant.id)}
                      className="text-red-500 text-sm cursor-pointer hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Pump:{" "}
                  <span className="font-medium">
                    {plant.pump_status ? "ON" : "OFF"}
                  </span>
                </p>
                <button
                  onClick={() => handlePump(plant)}
                  className={`w-full py-2 rounded-lg text-white cursor-pointer transition-all ease-in-out duration-150 ${
                    plant.pump_status
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {plant.pump_status
                    ? "Stop Watering"
                    : "Start Watering"}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}