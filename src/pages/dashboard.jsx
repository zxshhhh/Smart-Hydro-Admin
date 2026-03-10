import { useEffect, useState } from "react";
import { getPlants } from "../services/plantService";

export default function Dashboard() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    document.title = "Smart Hydro | Dashboard";
  }, []);

  useEffect(() => {
    loadPlants();
    const handleUpdate = () => loadPlants();
    // Refresh when returning to page
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

  const plantsNeedingWater = plants.filter(
    (plant) => plant.moisture <= 50
  ).length;

  const averageMoisture =
    plants.length > 0
      ? Math.round(
        plants.reduce((sum, plant) => sum + plant.moisture, 0) /
        plants.length
      )
      : 0;

  const getStatus = (moisture) => {
    if (moisture > 50) return "Healthy";
    if (moisture > 25) return "Needs Water";
    return "Critical";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Plants" value={plants.length} />
        <StatCard title="Need Water" value={plantsNeedingWater} />
        <StatCard title="Avg Moisture" value={`${averageMoisture}%`} />
        <StatCard title="Active Zones" value={[...new Set(plants.map(p => p.zone))].length} />
      </div>

      {/* Plant Overview */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-lg mb-4">Plant Status Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="bg-gray-50 shadow-lg rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold wrap-break-word pr-2">{plant.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${plant.moisture > 50
                      ? "bg-green-100 text-green-600"
                      : plant.moisture > 25
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                >
                  {getStatus(plant.moisture)}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                {plant.room} • {plant.zone}
              </div>

              <div className="text-sm">
                Moisture: {plant.moisture}%
              </div>

              {/* Simple Progress Bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-500 h-2 rounded-full max-w-full"
                  style={{ width: `${plant.moisture}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
