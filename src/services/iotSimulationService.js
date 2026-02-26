import { getPlants, updatePlant } from "./plantService";

let interval = null;

export function startIoTSimulation() {
  if (interval) return;

  interval = setInterval(() => {
    const plants = getPlants();
    const today = new Date().toLocaleDateString();

    plants.forEach((plant) => {
      let newMoisture = plant.moisture;
      let waterUsed = 0;

      // Environment simulation
      const temperature = 20 + Math.random() * 10;
      const humidity = 40 + Math.random() * 30;

      // Soil drying
      newMoisture -= Math.random() * 4;

      // Automatic watering
      if (
        plant.schedule?.mode === "automatic" &&
        newMoisture < 40
      ) {
        newMoisture += 25;
        waterUsed = 0.5; // liters per watering cycle
      }

      newMoisture = Math.max(0, Math.min(100, newMoisture));

      // Track daily water usage
      const usageHistory = plant.usageHistory || {};

      usageHistory[today] =
        (usageHistory[today] || 0) + waterUsed;

      updatePlant({
        ...plant,
        moisture: Number(newMoisture.toFixed(1)),
        temperature: Number(temperature.toFixed(1)),
        humidity: Number(humidity.toFixed(1)),
        usageHistory,
      });
    });

    window.dispatchEvent(new Event("plantUpdated"));
  }, 3000);
}
