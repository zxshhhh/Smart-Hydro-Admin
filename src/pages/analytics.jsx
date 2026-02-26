import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  YAxis,
} from "recharts";
import { RechartsDevtools } from '@recharts/devtools';
import { getPlants } from "../services/plantService";

export default function Analytics() {
  const [range, setRange] = useState("30");
  const [plants, setPlants] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  let moistureScore = 0;
  let waterScore = 100;

  useEffect(() => {
    document.title = "Smart Hydro | Analytics";
    loadPlants();

    window.addEventListener("plantUpdated", loadPlants);
    return () =>
      window.removeEventListener("plantUpdated", loadPlants);
  }, []);

  const loadPlants = () => {
    const list = getPlants();
    setPlants(list);

    const avgMoisture =
      list.reduce((acc, p) => acc + (p.moisture || 0), 0) /
      (list.length || 1);

    const avgTemp =
      list.reduce((acc, p) => acc + (p.temperature || 0), 0) /
      (list.length || 1);

    const avgHumidity =
      list.reduce((acc, p) => acc + (p.humidity || 0), 0) /
      (list.length || 1);

    setSensorData((prev) => [
      ...prev.slice(-9),
      {
        time: new Date().toLocaleTimeString(),
        moisture: Number(avgMoisture.toFixed(1)),
        temperature: Number(avgTemp.toFixed(1)),
        humidity: Number(avgHumidity.toFixed(1)),
      },
    ]);
  };

  const buildWaterData = () => {
    const plants = getPlants();
    const totals = {};

    plants.forEach((plant) => {
      if (!plant.usageHistory) return;

      Object.entries(plant.usageHistory).forEach(
        ([date, amount]) => {
          totals[date] =
            (totals[date] || 0) + amount;
        }
      );
    });

    const sorted = Object.keys(totals)
      .sort(
        (a, b) =>
          new Date(a) - new Date(b)
      )
      .map((date) => ({
        date,
        current: Number(totals[date].toFixed(2)),
        previous:
          Number((totals[date] * 0.8).toFixed(2)), // simulate previous period
      }));

    return sorted;
  };

  const data = buildWaterData();

  const totalWater = data.reduce(
    (acc, d) => acc + d.current,
    0
  );

  const avgMoisture =
    plants.reduce((acc, p) => acc + (p.moisture || 0), 0) /
    (plants.length || 1);

  const dailyUsage =
    plants.filter((p) => p.moisture > 60).length * 0.5;
  
  if (avgMoisture >= 40 && avgMoisture <= 70) {
      moistureScore = 100;
    } else if (avgMoisture < 40) {
      moistureScore = 60;
    } else {
      moistureScore = 70;
    }

    if (totalWater > 20) waterScore = 60;
    else if (totalWater > 10) waterScore = 75;
    else if (totalWater > 5) waterScore = 85;

    // 3️⃣ Automatic Mode Usage Bonus
    const automaticPlants = plants.filter(
      (p) => p.schedule?.mode === "automatic"
    ).length;

    const autoRatio =
      automaticPlants / (plants.length || 1);

    const automationScore = autoRatio * 100;

    // 🎯 FINAL CONSERVATION SCORE (weighted)
    const conservationScore = Math.round(
      moistureScore * 0.4 +
        waterScore * 0.3 +
        automationScore * 0.3
    );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Water Usage Analytics
          </h1>
          <p className="text-gray-500">
            Monitoring consumption patterns and IoT sensor data
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setRange("30")}
            className={`px-4 py-2 rounded-lg ${
              range === "30"
                ? "bg-green-600 text-white cursor-pointer"
                : "bg-gray-200 cursor-pointer"
            }`}
          >
            Last 30 Days
          </button>

          <button
            onClick={() => setRange("90")}
            className={`px-4 py-2 rounded-lg ${
              range === "90"
                ? "bg-green-600 text-white cursor-pointer"
                : "bg-gray-200 cursor-pointer"
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <SummaryCard
          title="Total Water Consumed"
          value={`${totalWater.toFixed(2)} L`}
          badge="Live IoT"
          color="green"
        />
        <SummaryCard
          title="Avg Soil Moisture"
          value={`${avgMoisture.toFixed(1)}%`}
          badge="Live IoT"
          color="green"
        />
        <SummaryCard
          title="Overall Pump Water Usage"
          value={`${dailyUsage.toFixed(1)} L`}
          badge="Live IoT"
          color="green"
        />
        <SummaryCard
          title="Conservation Score"
          value={`${conservationScore}%`}
          badge={
            conservationScore > 85
              ? "Excellent Efficiency"
              : conservationScore > 70
              ? "Good Optimization"
              : "Needs Improvement"
          }
          color={
            conservationScore > 85
              ? "green"
              : conservationScore > 70
              ? "green"
              : "red"
          }
        />
      </div>

      {/* EXISTING WATER CONSUMPTION CHART */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold mb-4">
          Water Consumption Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} responsive={true} onContextMenu={(_, e) => e.preventDefault()}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#94a3b8"
              fill="#cbd5e1"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* SENSOR TRENDS */}
      <div className="grid grid-cols-3 gap-6">
        <SensorChart
          title="Soil Moisture Trend"
          data={sensorData}
          dataKey="moisture"
          color="#16a34a"
        />

        <SensorChart
          title="Ambient Temperature Trend"
          data={sensorData}
          dataKey="temperature"
          color="#f97316"
        />

        <SensorChart
          title="Humidity Trend"
          data={sensorData}
          dataKey="humidity"
          color="#3b82f6"
        />
      </div>

      {/* AI SMART INSIGHTS */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">AI Smart Insights</h3>

        {avgMoisture < 40 && (
          <InsightCard
            title="Low Moisture Alert"
            text="Multiple plants are below optimal moisture levels."
            color="red"
          />
        )}

        {avgMoisture > 70 && (
          <InsightCard
            title="Overwatering Risk"
            text="Soil moisture levels are consistently high."
            color="gray"
          />
        )}

        {avgMoisture >= 40 && avgMoisture <= 70 && (
          <InsightCard
            title="System Stable"
            text="Moisture levels are within optimal range."
            color="green"
          />
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

function SensorChart({ title, data, dataKey, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} responsive={true} onContextMenu={(_, e) => e.preventDefault()}>
          <CartesianGrid strokeDasharray="8 8" />
          <XAxis dataKey="time" hide />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
          />
          <RechartsDevtools />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SummaryCard({ title, value, badge, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{title}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            color === "green"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="text-2xl font-bold mt-3">{value}</p>
    </div>
  );
}

function InsightCard({ title, text, color }) {
  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        color === "green"
          ? "border-green-500 bg-green-50"
          : color === "red"
          ? "border-red-500 bg-red-50"
          : "border-gray-400 bg-gray-50"
      }`}
    >
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
