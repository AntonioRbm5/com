import api from "./api";

export const getAllUnites = () => api.get("/unite-achat-vente/all");
export const getUniteById = (id) => api.get(`/unite-achat-vente/${id}`);
