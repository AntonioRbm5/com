import api from "./api";

export const getAllFournisseurs = () => api.get("/fournisseur/all");
export const createFournisseur = (data) => api.post("/fournisseur/create", data);
export const searchFournisseur = (name) => api.get(`/fournisseur/search?fournisseur_name=${name}`)
export const updateFournisseur = (data, fournisseur_id) => api.put(`/fournisseur/update/${fournisseur_id}`, data)
export const getFournisseurById = (id) => api.get(`/fournisseur/${id}`);
export const deleteFournisseur = (id) => api.delete(`/fournisseur/delete/${id}`)