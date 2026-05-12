const API_URL = "http://127.0.0.1:8000/api/v1";

const getToken = () => localStorage.getItem("token");

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  });

  // Handle non-JSON errors (your favorite problem)
  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", text);
    throw new Error(text);
  }

  return res.json();
}

export const getUsers = () => apiFetch("/users/");

export const updateUser = (id, data) =>
  apiFetch(`/users/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteUser = (id) =>
  apiFetch(`/users/${id}/`, {
    method: "DELETE",
  });

export const changePassword = (id, password) =>
  apiFetch(`/users/${id}/change-password/`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });

