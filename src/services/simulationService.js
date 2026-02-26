import { getPlants, updatePlant } from "./plantService";

let interval = null;

export const startSimulation = () => {
  if (interval) return;

  interval = setInterval(() => {
    const plants = getPlants();

    plants.forEach((plant) => {
      let updatedPlant = { ...plant };

      // 🌡 Soil dries naturally
      updatedPlant.moisture = Math.max(
        0,
        Math.round(plant.moisture - Math.random() * 2)
      );

      // =============================
      // 💧 AUTOMATIC MODE
      // =============================
      if (
        plant.schedule.mode === "automatic" &&
        updatedPlant.moisture < 30
      ) {
        updatedPlant.moisture = Math.min(
          100,
          updatedPlant.moisture + 25
        );
      }

      // =============================
      // ⏰ SCHEDULED MODE
      // =============================
      if (plant.schedule.mode === "scheduled") {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        if (currentTime === plant.schedule.time) {
          updatedPlant.moisture = Math.min(
            100,
            updatedPlant.moisture + 20
          );
        }
      }

      updatePlant(updatedPlant);
    });

    // notify UI
    window.dispatchEvent(new Event("plantUpdated"));
  }, 5000); // every 5 seconds
};

export const stopSimulation = () => {
  clearInterval(interval);
  interval = null;
};
