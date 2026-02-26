import { getPlants } from "./plantService";

export function getSystemStatus() {
  const plants = getPlants();

  if (!plants.length) {
    return {
      label: "No Plants Connected",
      color: "gray",
    };
  }

  let lowMoisture = false;
  let criticalMoisture = false;
  let wateringActive = false;

  plants.forEach((plant) => {
    const moisture = plant.moisture || 0;

    if (moisture < 30) {
      criticalMoisture = true;
    } else if (moisture < 40) {
      lowMoisture = true;
    }

    if (plant.lastWateredAt) {
      const now = Date.now();
      const diff = now - plant.lastWateredAt;

      // if watered within last 5 seconds
      if (diff < 5000) {
        wateringActive = true;
      }
    }
  });

  if (wateringActive) {
    return {
      label: "Watering Active",
      color: "blue",
    };
  }

  if (criticalMoisture) {
    return {
      label: "Critical Condition",
      color: "red",
    };
  }

  if (lowMoisture) {
    return {
      label: "Attention Required",
      color: "yellow",
    };
  }

  return {
    label: "All Systems Operational",
    color: "green",
  };
}