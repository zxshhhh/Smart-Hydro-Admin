import { useEffect, useState } from "react";
import {
  getPlants,
  addPlant,
  updatePlant,
  deletePlant,
} from "../services/plantService";
import { useSearch } from "../context/SearchContext";

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPlant, setEditedPlant] = useState(null);
  const { query } = useSearch();

  const defaultPlant = {
    name: "",
    room: "",
    zone: "",
    moisture: 60,
    schedule: {
      mode: "manual", // manual | scheduled | automatic
      time: "08:00",
      frequency: "daily",
    },
    sensors: {
      moistureSensor: "",
      temperatureSensor: "",
    },
  };

  const [newPlant, setNewPlant] = useState(defaultPlant);

  useEffect(() => {
    loadPlants();
    const handleUpdate = () => loadPlants();
    window.addEventListener("plantUpdated", handleUpdate);
    window.addEventListener("focus", loadPlants);

    return () => {
      window.removeEventListener("plantUpdated", handleUpdate);
      window.removeEventListener("focus", loadPlants);
    };
  }, []);

  const loadPlants = () => {
    setPlants(getPlants());
  };

  // SEARCH
  const filteredPlants = plants.filter((plant) =>
    `${plant.name} ${plant.room} ${plant.zone}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // ADD
  const handleAddPlant = () => {
    if (!newPlant.name.trim()) return;

    addPlant(newPlant);
    setNewPlant(defaultPlant);
    loadPlants();
    window.dispatchEvent(new Event("plantUpdated"));
  };

  // DELETE
  const handleDelete = (id) => {
    deletePlant(id);
    loadPlants();
    window.dispatchEvent(new Event("plantUpdated"));
  };

  // START EDIT
  const startEdit = (plant) => {
    setEditingId(plant.id);
    setEditedPlant({ ...plant });
  };

  // SAVE EDIT
  const saveEdit = () => {
    updatePlant(editedPlant);
    setEditingId(null);
    setEditedPlant(null);
    loadPlants();
    window.dispatchEvent(new Event("plantUpdated"));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Plant Management</h1>

      {/* ================= ADD FORM ================= */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm space-y-4 md:space-y-6">
        <h2 className="font-semibold text-lg">Add New Plant</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Plant Name"
            value={newPlant.name}
            onChange={(e) =>
              setNewPlant({ ...newPlant, name: e.target.value })
            }
            className="bg-gray-100 p-2 rounded-lg"
          />
          <input
            placeholder="Room"
            value={newPlant.room}
            onChange={(e) =>
              setNewPlant({ ...newPlant, room: e.target.value })
            }
            className="bg-gray-100 p-2 rounded-lg"
          />
          <input
            placeholder="Zone"
            value={newPlant.zone}
            onChange={(e) =>
              setNewPlant({ ...newPlant, zone: e.target.value })
            }
            className="bg-gray-100 p-2 rounded-lg"
          />
        </div>

        {/* Watering Mode */}
        <div>
          <label className="text-sm font-medium">Watering Mode</label>
          <select
            value={newPlant.schedule.mode}
            onChange={(e) =>
              setNewPlant({
                ...newPlant,
                schedule: {
                  ...newPlant.schedule,
                  mode: e.target.value,
                },
              })
            }
            className="w-full mt-1 bg-gray-100 p-2 rounded-lg"
          >
            <option value="manual">Manual</option>
            <option value="scheduled">Scheduled</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* Scheduled Settings */}
        {newPlant.schedule.mode === "scheduled" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="time"
              value={newPlant.schedule.time}
              onChange={(e) =>
                setNewPlant({
                  ...newPlant,
                  schedule: {
                    ...newPlant.schedule,
                    time: e.target.value,
                  },
                })
              }
              className="bg-gray-100 p-2 rounded-lg"
            />
            <select
              value={newPlant.schedule.frequency}
              onChange={(e) =>
                setNewPlant({
                  ...newPlant,
                  schedule: {
                    ...newPlant.schedule,
                    frequency: e.target.value,
                  },
                })
              }
              className="bg-gray-100 p-2 rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}

        {/* Sensors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Moisture Sensor"
            value={newPlant.sensors.moistureSensor}
            onChange={(e) =>
              setNewPlant({
                ...newPlant,
                sensors: {
                  ...newPlant.sensors,
                  moistureSensor: e.target.value,
                },
              })
            }
            className="bg-gray-100 p-2 rounded-lg"
          />
          <input
            placeholder="Temperature Sensor"
            value={newPlant.sensors.temperatureSensor}
            onChange={(e) =>
              setNewPlant({
                ...newPlant,
                sensors: {
                  ...newPlant.sensors,
                  temperatureSensor: e.target.value,
                },
              })
            }
            className="bg-gray-100 p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleAddPlant}
          className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer transition duration-200 hover:bg-green-700"
        >
          Add Plant
        </button>
      </div>

      {/* ================= PLANT LIST ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm space-y-4"
          >
            {editingId === plant.id ? (
              <>
                <input
                  value={editedPlant.name}
                  onChange={(e) =>
                    setEditedPlant({
                      ...editedPlant,
                      name: e.target.value,
                    })
                  }
                  className="bg-gray-100 p-2 rounded-lg w-full"
                />

                <input
                  value={editedPlant.room}
                  onChange={(e) =>
                    setEditedPlant({
                      ...editedPlant,
                      room: e.target.value,
                    })
                  }
                  className="bg-gray-100 p-2 rounded-lg w-full"
                />

                <input
                  value={editedPlant.zone}
                  onChange={(e) =>
                    setEditedPlant({
                      ...editedPlant,
                      zone: e.target.value,
                    })
                  }
                  className="bg-gray-100 p-2 rounded-lg w-full"
                />

                {/* Watering Mode */}
                <select
                  value={editedPlant.schedule.mode}
                  onChange={(e) =>
                    setEditedPlant({
                      ...editedPlant,
                      schedule: {
                        ...editedPlant.schedule,
                        mode: e.target.value,
                      },
                    })
                  }
                  className="bg-gray-100 p-2 rounded-lg w-full"
                >
                  <option value="manual">Manual</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="automatic">Automatic</option>
                </select>

                {editedPlant.schedule.mode === "scheduled" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="time"
                      value={editedPlant.schedule.time}
                      onChange={(e) =>
                        setEditedPlant({
                          ...editedPlant,
                          schedule: {
                            ...editedPlant.schedule,
                            time: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-100 p-2 rounded-lg"
                    />
                    <select
                      value={editedPlant.schedule.frequency}
                      onChange={(e) =>
                        setEditedPlant({
                          ...editedPlant,
                          schedule: {
                            ...editedPlant.schedule,
                            frequency: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-100 p-2 rounded-lg"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                )}

                {/* Sensors */}
                <input
                  value={editedPlant.sensors.moistureSensor}
                  onChange={(e) =>
                    setEditedPlant({
                      ...editedPlant,
                      sensors: {
                        ...editedPlant.sensors,
                        moistureSensor: e.target.value,
                      },
                    })
                  }
                  className="bg-gray-100 p-2 rounded-lg w-full"
                />

                <input
                  value={editedPlant.sensors.temperatureSensor}
                  onChange={(e) =>
                    setEditedPlant({
                      ...editedPlant,
                      sensors: {
                        ...editedPlant.sensors,
                        temperatureSensor: e.target.value,
                      },
                    })
                  }
                  className="bg-gray-100 p-2 rounded-lg w-full"
                />

                <div className="flex gap-3">
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="font-semibold text-lg">{plant.name}</h2>
                    <p className="text-sm text-gray-500">
                      {plant.room} • {plant.zone}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(plant)}
                      className="text-blue-600 text-sm cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plant.id)}
                      className="text-red-500 text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p>Moisture: {plant.moisture}%</p>
                <p className="text-sm text-gray-500">
                  Mode: {plant.schedule.mode}
                </p>
                <p className="text-sm text-gray-500">
                  Sensors: {plant.sensors.moistureSensor} /{" "}
                  {plant.sensors.temperatureSensor}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
