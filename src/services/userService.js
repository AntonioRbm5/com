import api from "./api";

// User Role
export const createUserRole = (data) => api.post("/user-role/create", data);
export const getAllUserRoles = () => api.get("/user-role/all");
export const updateUserRole = (id, data) => api.put(`/user-role/update/${id}`, data);

// Users
export const createUser = (data) => api.post("/users/create", data);
export const getAllUsers = () => api.get("/users/all");
export const loginUser = (data) => api.post("/users/login", data);
