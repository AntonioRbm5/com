
import api from "./api";

export const createArticleStockDepot = (data) =>
    api.post(`/article-stock-depot/create`, data);

export const searchArticleStockDepot = (article_id, depot_id) => {
    const params = new URLSearchParams();
    if (article_id) params.append('article_id', article_id);
    if (depot_id) params.append('depot_id', depot_id);
    const query = params.toString();
    return api.get(`/article-stock-depot/search${query ? `?${query}` : ''}`);
};

export const getArticleStockDepotById = (stock_id) =>
    api.get(`/article-stock-depot/get/${stock_id}`);

export const updateArticleStockDepot = (stock_id, data) =>
    api.put(`/article-stock-depot/update/${stock_id}`, data);

export const deleteArticleStockDepot = (stock_id) =>
    api.delete(`/article-stock-depot/delete/${stock_id}`);