import api from "./api";

export const getAllFamilles = () => api.get("/article-famille/all");
export const getFamilleById = (id) => api.get(`/article-famille/${id}`);
export const createFamille = (data) => api.post("/article-famille/create", data);
export const updateFamille = (id, data) => api.put(`/article-famille/update/${id}`, data);
export const deleteFamille = (id) => api.delete(`/article-famille/delete/${id}`);
