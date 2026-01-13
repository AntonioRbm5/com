import api from "./api";

export const createClientCategory = (data) => api.post("/client-category/create", data);
export const getAllClientCategory = () => api.get("/client-category/all");
export const getClientCategoryById = (id_cat_client) => api.get(`/client-category/search/${id_cat_client}`);
export const updateClientCategory = (id_cat_client, data) => api.put(`/client-category/update/${id_cat_client}`, data);
export const deleteClientCategory = (id_cat_client) => api.delete(`/client-category/delete/${id_cat_client}`);