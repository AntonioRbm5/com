import api from "./api";
export const createStockageDepot = (data) => api.post(`/stockage-depot/create`, data)
export const searchStockageDepot = (name) => api.get(`/stockage-depot/search?name=${name}`)
export const getStockageDepotById = (depot_id) => api.get(`/stockage-depot/depot/${depot_id}`)
export const updateStockageDepot = (depot_id, data) => api.put(`/stockage-depot/update/${depot_id}`, data)
export const deleteStockageDepot = (depot_id) => api.delete(`/stockage-depot/delete/${depot_id}`)