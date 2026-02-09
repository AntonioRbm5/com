import api from "./api";

// User Role
export const createUserRole = (data) => api.post("/user-role/create", data);
export const getAllUserRoles = () => api.get("/user-role/all");
export const updateUserRole = (id, data) => api.put(`/user-role/update/${id}`, data);
export const searchUserRole = (name_role) => api.get(`/user-role/search?name=${name_role}`);
export const deleteUserRole = (id) => api.delete(`/user-role/delete/${id}`)
// Users
export const createUser = (data) => api.post("/users/create", data);
export const updateUser = (data, id_user) => api.put(`/users/update/${id_user}`, data);
export const deleteUser = (id_user) => api.delete(`/users/delete/${id_user}`);
export const getAllUsers = () => api.get("/users/all");
export const getUserById = (id_user) => api.get(`/users/${id_user}`);
export const loginUser = (data) => api.post("/user/authentication", data);
