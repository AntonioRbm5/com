import api from "./api";

// Gestion des dépôts
export const getAllDepots = () => api.get('/depots');
export const getDepotById = (id) => api.get(`/depots/${id}`);
export const createDepot = (data) => api.post('/depots/create', data);
export const updateDepot = (id, data) => api.put(`/depots/update/${id}`, data);
export const deleteDepot = (id) => api.delete(`/depots/delete/${id}`);