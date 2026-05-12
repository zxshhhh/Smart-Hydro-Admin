import { apiFetch } from "./api";

export const getPlants = () => {
  return apiFetch("/plants/");
};

export const addPlant = (data) => {
  return apiFetch("/plants/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updatePlant = (id, data) => {
  return apiFetch(`/plants/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deletePlant = (id) => {
  return apiFetch(`/plants/${id}/`, {
    method: "DELETE",
  });
};

export const togglePump = (plantId, status) => {
  return apiFetch(`/plants/${plantId}/pump/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const getLatestSensor = (plantId) => {
  return apiFetch(`/plants/${plantId}/sensor-data/latest/`);
};