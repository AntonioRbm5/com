import api from "./api"; // axios instance

export const createModePaiement = (data) =>
    api.post("/mode-paiement/create", data);

export const getModePaiementById = (id) =>
    api.get(`/mode-paiement/${id}`);

export const updateModePaiement = (data, id) =>
    api.put(`/mode-paiement/update/${id}`, data);
export const getAllModePaiement = () => api.get("/mode-paiement/all");
