import { defaultUsers } from "../data/defaultUsers";

const STORAGE_KEY = "smart_hydro_users";

export const initializeUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

export const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    ...user,
    id: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...users, newUser]));
};

export const updateUser = (updatedUser) => {
  const users = getUsers().map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const deleteUser = (id) => {
  const users = getUsers().filter((user) => user.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};
