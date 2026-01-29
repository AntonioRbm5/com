import api from "./api";

// Coordonnée Type
export const createCoordonneeType = (data) => api.post("/coordonnee-type/create", data);
export const getAllCoordonneeTypes = () => api.get("/coordonnee-type/all");
export const searchCoordonneeType = (params) => api.get("/coordonnee-type/search", { params });
export const updateCoordonneeType = (id, data) => api.put(`/coordonnee-type/update/${id}`, data);
export const deleteCoordonneeType = (id) => api.delete(`/coordonnee-type/delete/${id}`);

// Coordonnée
export const createCoordonnee = (data) => api.post("/coordonnees/create", data);
export const getAllCoordonnees = () => api.get("/coordonnees/all");
export const getCoordonneeById = (coordonneeId) => api.get(`/coordonnees/${coordonneeId}`);
export const searchCoordonnee = (params) => api.get("/coordonnees/search", { params });
export const updateCoordonnee = (coordonneeId, data) => api.put(`/coordonnees/update/${coordonneeId}`, data);
export const deleteCoordonnee = (coordonneeId) => api.delete(`/coordonnees/delete/${coordonneeId}`);