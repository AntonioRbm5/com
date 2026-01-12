import api from "./api";
export const createStockMouvement = (data) => api.post(`/stock-mouvement/create`, data)
// export const 