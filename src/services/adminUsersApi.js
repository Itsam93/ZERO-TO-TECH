import API from "./api";

export const getUsers = () => API.get("/admin/users");

export const getUser = (id) => API.get(`/admin/users/${id}`);

export const updateUser = (id, data) =>
  API.patch(`/admin/users/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);


export const sendNotification = (data) =>
  API.post("/admin/notifications", data);