import api from "./api";

export const getAllCategories = () => api.get("/article_categorie/list");
export const getCategorieById = (id) => api.get(`/article_categorie/${id}`);
export const createCategorie = (data) => api.post("/article_categorie/create", data);
export const updateCategorie = (id, data) => api.put(`/article_categorie/update/${id}`, data);
export const deleteCategorie = (id) => api.delete(`/article_categorie/delete/${id}`);
