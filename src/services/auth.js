import { adminUser } from '../data/admin';

const MOCK_USER = {
  username: adminUser.username,
  password: adminUser.password,
};

export const login = (username, password) => {
  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    const fakeToken = "smart-hydro-token-123";
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", JSON.stringify({ username }));
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
