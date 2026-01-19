import api from "./api";

export const getAllDepots = () => api.get("/stockage-depot/search");
export const getDepotById = (depotId) => api.get(`/stockage-depot/depot/${depotId}`);
export const createDepot = (data) => api.post("/stockage-depot/create", data);
export const updateDepot = (depotId, data) => api.put(`/stockage-depot/update/${depotId}`, data);
export const deleteDepot = (depotId) => api.delete(`/stockage-depot/delete/${depotId}`);
