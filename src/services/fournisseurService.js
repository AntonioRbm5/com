import api from "./api";

export const getAllFournisseurs = () => api.get("/fournisseur/all");
export const getFournisseurById = (id) => api.get(`/fournisseur/${id}`);