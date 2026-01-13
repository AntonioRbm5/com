import api from "./api";

// Gestion des lots
export const createLot = (data) => api.post(`/stock-management/lot/create`, data);
export const getLotById = (id) => api.get(`/stock-management/lot/${id}`);
export const updateLot = (id, data) => api.put(`/stock-management/lot/update/${id}`, data);
export const deleteLot = (id) => api.delete(`/stock-management/lot/delete/${id}`);
export const searchLots = (params) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/stock-management/lot/search?${queryParams}`);
};

// Gestion des mouvements
export const createMouvement = (data) => api.post(`/stock-management/mouvement/create`, data);

// État du stock
export const getStockState = () => api.get(`/stock-management/stock/state`);
export const getArticleState = () => api.get(`/stock-management/article-state`);