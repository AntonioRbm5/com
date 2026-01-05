import api from "./api";

// Coordonnée Type
export const createCoordonneeType = (data) => api.post("/coordonnee-type/create", data);
export const getAllCoordonneeTypes = () => api.get("/coordonnee-type/all");
export const updateCoordonneeType = (id, data) => api.put(`/coordonnee-type/update/${id}`, data);

// Coordonnée
export const createCoordonnee = (data) => api.post("/coordonnees/create", data);
