import api from "./api";

export const createClient = (data) => api.post("/client/create", data);
export const getAllClient = () => api.get("/client/all");
export const getClientById = (id_client) => api.get(`/client/get/${id_client}`);
export const updateClient = (id_client, data) => api.put(`/client/update/${id_client}`, data)
export const deleteClient = (id_client) => api.delete(`/client/delete/${id_client}`);
