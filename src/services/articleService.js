// articleService.js
import api from "./api";

export const getAllArticles = () => api.get("/article/all");
export const getArticleById = (id) => api.get(`/article/${id}`);
export const createArticle = (data) => api.post("/article/create", data);
export const searchArticle = (name) => api.get(`/article/search?article_name=${name}`);
export const updateArticle = (id, data) => api.put(`/article/update/${id}`, data);
export const deleteArticle = (id) => api.delete(`/article/delete/${id}`);
