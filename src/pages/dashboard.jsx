import { useEffect, useState } from "react";
import { togglePump } from "../services/plantService";
import Card from "../components/PlantCard";
import Sensor from "../components/PlantSensor";
import Status from "../components/PlantStatus";

export default function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://127.0.0.1:8000/api/v1";

  const fetchPlants = async () => {
    try {
      const res = await fetch(`${API}/plants/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch plants");
        setPlants([]);
        return;
      }

      const data = await res.json();
      const plantList = Array.isArray(data) ? data : data.results || [];

      const plantsWithSensors = await Promise.all(
        plantList.map(async (plant) => {
          try {
            const sensorRes = await fetch(
              `${API}/plants/${plant.id}/sensor-data/latest/`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            // 🚫 No sensor yet (very normal in IoT)
            if (!sensorRes.ok) {
              return {
                ...plant,
                moisture: null,
                temperature: null,
                humidity: null,
              };
            }

            const sensorData = await sensorRes.json();

            return {
              ...plant,
              moisture: Number(sensorData.soil_moisture),
              temperature: Number(sensorData.temperature),
              humidity: Number(sensorData.humidity),
            };
          } catch (err) {
            console.warn("Sensor fetch failed:", err);
            return {
              ...plant,
              moisture: null,
              temperature: null,
              humidity: null,
            };
          }
        })
      );

      setPlants(plantsWithSensors);
    } catch (err) {
      console.error("FETCH FAILED:", err);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
    const interval = setInterval(fetchPlants, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePumpToggle = async (plant) => {
    await togglePump(plant.id, !plant.pump_status);
    fetchPlants();
  };

  const validMoisture = plants
    .map((p) => p.moisture)
    .filter((m) => typeof m === "number");

  const avgMoisture =
    validMoisture.reduce((a, b) => a + b, 0) /
    (validMoisture.length || 1);

  const systemStatus =
    validMoisture.length === 0
      ? "No Sensor Data"
      : avgMoisture < 40
      ? "Dry - Needs Water"
      : avgMoisture > 70
      ? "Overwater Risk"
      : "Optimal";

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Smart Hydro Dashboard</h1>

        <div className="text-sm text-gray-500">
          System Status:{" "}
          <span className="font-semibold">{systemStatus}</span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="Plants" value={plants.length} />

        <Card
          title="Avg Moisture"
          value={
            validMoisture.length
              ? `${avgMoisture.toFixed(1)}%`
              : "--"
          }
        />

        <Card
          title="Active Pumps"
          value={plants.filter((p) => p.pump_status).length}
        />
      </div>

      {/* PLANT CARDS */}
      <div className="grid grid-cols-2 gap-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white p-5 rounded-xl shadow space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">
                  {plant.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Owner: {plant.user_username}
                </p>
              </div>

              <button
                onClick={() => handlePumpToggle(plant)}
                className={`px-3 py-1 rounded-lg text-sm cursor-pointer ${
                  plant.pump_status
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {plant.pump_status ? "Stop" : "Water"}
              </button>
            </div>

            {/* SENSOR DISPLAY */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Sensor
                label="Moisture"
                value={plant.moisture}
                unit="%"
              />
              <Sensor
                label="Temp"
                value={plant.temperature}
                unit="°C"
              />
              <Sensor
                label="Humidity"
                value={plant.humidity}
                unit="%"
              />
            </div>

            <Status moisture={plant.moisture} />
          </div>
        ))}
      </div>
    </div>
  );
}