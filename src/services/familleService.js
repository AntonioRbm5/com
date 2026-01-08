import api from "./api";

export const getAllFamilles = () => api.get("/article_famille/list");
export const getFamilleById = (id) => api.get(`/article_famille/${id}`);
export const createFamille = (data) => api.post("/article_famille/create", data);
export const updateFamille = (id, data) => api.put(`/article_famille/update/${id}`, data);
export const deleteFamille = (id) => api.delete(`/article_famille/delete/${id}`);
