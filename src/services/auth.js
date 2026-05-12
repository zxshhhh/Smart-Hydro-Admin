const BASE_URL = "http://127.0.0.1:8000/api/v1";

export const loginUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  const data = await res.json();

  localStorage.setItem("token", data.access);
  localStorage.setItem("refresh", data.refresh);

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};