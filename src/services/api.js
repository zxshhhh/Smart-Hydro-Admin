const BASE_URL = 'http://127.0.0.1:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }

  return res.status !== 204 ? res.json() : null;
};