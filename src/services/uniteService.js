import api from "./api";

export const getAllUnites = () => api.get("/unite-achat-vente/all");
export const createUnites = (data) => api.get("/unite-achat-vente/create", data)
export const updateUnites = (data, id_unite) => api.put(`/unite-achat-vente/update/${id_unite}`, data)
export const deleteUnites = (id_unite) => api.delete(`/unite-achat-vente/delete/${id_unite}`)
export const searchUnitesCode = (code) => api.get(`/unite-achat-vente/search?unite_code=${code}`)
export const searchUnitesType = (type) => api.get(`/unite-achat-vente/search?unite_type=${type}`)