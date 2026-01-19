import api from "./api";

// COMMANDE - En-tête
export const createCommande = (data) => api.post("/commande/create", data);
export const getCommandeById = (id) => api.get(`/commande/get/${id}`);
export const updateCommande = (id, data) => api.put(`/commande/update/${id}`, data);
export const deleteCommande = (id) => api.delete(`/commande/delete/${id}`);
export const searchCommande = (filters, page = 1, pageSize = 10) =>
    api.post(`/commande/search?page=${page}&page_size=${pageSize}`, filters);

// COMMANDE DETAIL - Lignes de commande
export const createCommandeDetail = (data) => api.post("/commande-detail/create", data);
export const getCommandeDetailById = (id) => api.get(`/commande-detail/get/${id}`);
export const updateCommandeDetail = (id, data) => api.put(`/commande-detail/update/${id}`, data);
export const deleteCommandeDetail = (id) => api.delete(`/commande-detail/delete/${id}`);
export const searchCommandeDetail = (filters) => api.post("/commande-detail/search", filters);