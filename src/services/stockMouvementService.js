import api from "./api";
export const createStockMouvement = (data) => api.post(`/stock-mouvement/create`, data)
export const getStockMouvementById = (id) => api.get(`/stock-mouvement/get/${id}`)
export const getAllStockMouvement = () => api.get("/stock-mouvement/search")
export const getStockMouvementByArticleId = (article_id) => api.get(`/stock-mouvement/search?article_id=${article_id}`) 
export const getStockMouvementByReference = (mouvement_reference) => api.get(`/stock-mouvement/search?mouvement_reference=${mouvement_reference}`)
export const updateStockMouvement = (data, id) => api.put(`/stock-mouvement/update/${id}`, data)
export const deleteStockMouvement = (id) => api.delete(`/stock-mouvement/delete/${id}`)