import api from "./api";

export const getAllCategories = () => api.get("/article-categorie/all");
export const getCategorieById = (id) => api.get(`/article-categorie/${id}`);
export const createCategorie = (data) => api.post("/article-categorie/create", data);
export const updateCategorie = (id, data) => api.put(`/article-categorie/update/${id}`, data);
export const deleteCategorie = (id) => api.delete(`/article-categorie/delete/${id}`);
