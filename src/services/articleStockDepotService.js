import api from "./api";

export const createArticleStockDepot = (data) => api.post("/article-stock-depot/create", data);
export const getAllArticleStockDepot = () => api.get("/article-stock-depot/search");
export const getArticleStockDepotById = (id) => api.get(`/article-stock-depot/get/${id}`);
export const updateArticleStockDepot = (id, data) => api.put(`/article-stock-depot/update/${id}`, data);
export const deleteArticleStockDepot = (id) => api.delete(`/article-stock-depot/delete/${id}`);