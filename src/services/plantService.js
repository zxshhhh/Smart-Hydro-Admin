const STORAGE_KEY = "plants";

const defaultPlants = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    room: "Living Room",
    zone: "Zone A",
    moisture: 65,
    temperature: 22,
    humidity: 55,
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32a6c7b",
  },
  {
    id: 2,
    name: "Fiddle Leaf Fig",
    room: "Office",
    zone: "Zone B",
    moisture: 28,
    temperature: 24,
    humidity: 40,
    image: "https://images.unsplash.com/photo-1616628182507-4d0e6c3e3c80",
  },
];

export const initializePlants = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlants));
  }
};

export function getPlants() {
  const plants = JSON.parse(localStorage.getItem("plants")) || [];

  // Ensure new fields exist without breaking old data
  return plants.map((plant) => ({
    ...plant,
    schedule: plant.schedule || {
      mode: "manual",
      time: "08:00",
      frequency: "daily",
    },
    sensors: plant.sensors || {
      moistureSensor: "",
      temperatureSensor: "",
    },
  }));
}

export function savePlants(plants) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

export function addPlant(plant) {
  const plants = getPlants();
  plants.push(plant);
  savePlants(plants);
}

export function updatePlant(updatedPlant) {
  const plants = getPlants().map((plant) =>
    plant.id === updatedPlant.id ? updatedPlant : plant
  );
  savePlants(plants);
}

export function deletePlant(id) {
  const plants = getPlants().filter((plant) => plant.id !== id);
  savePlants(plants);
}
