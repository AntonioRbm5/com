import api from "./api";

export const createEntreprise = (data) => api.post("/entreprises/create", data);
export const getAllEntreprises = () => api.get("/entreprises/all");
export const getEntrepriseById = (id) => api.get(`/entreprises/get/${id}`);
export const updateEntreprise = (id, data) => api.put(`/entreprises/${id}`, data);