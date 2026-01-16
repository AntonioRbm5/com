// import api from "./api";

// export const createArticleStockDepot = (data) => api.post("/article-stock-depot/create", data);
// export const getAllArticleStockDepot = () => api.get("/article-stock-depot/search");
// export const getArticleStockDepotById = (id) => api.get(`/article-stock-depot/get/${id}`);
// export const updateArticleStockDepot = (id, data) => api.put(`/article-stock-depot/update/${id}`, data);
// export const deleteArticleStockDepot = (id) => api.delete(`/article-stock-depot/delete/${id}`);

import api from "./api";

// ============================================
// ARTICLE STOCK DEPOT API CALLS
// ============================================

/**
 * Créer un nouveau stock pour un article dans un dépôt
 * @param {Object} data - { stock_article_id, stock_depot_id, stock_quantity }
 */
export const createArticleStockDepot = (data) => {
    // Transformer les données pour correspondre au format API attendu
    const apiData = {
        stock_article_id: data.article_id || data.stock_article_id,
        stock_depot_id: data.depot_id || data.stock_depot_id,
        stock_quantity: parseFloat(data.quantity || data.stock_quantity)
    };

    return api.post("/article-stock-depot/create", apiData);
};

/**
 * Récupérer tous les stocks
 */
export const getAllArticleStockDepot = () => api.get("/article-stock-depot/search");

/**
 * Récupérer un stock spécifique par ID
 * @param {number} id - ID du stock
 */
export const getArticleStockDepotById = (id) => api.get(`/article-stock-depot/get/${id}`);

/**
 * Mettre à jour un stock existant
 * @param {number} id - ID du stock à mettre à jour
 * @param {Object} data - { stock_quantity }
 */
export const updateArticleStockDepot = (id, data) => {
    // Transformer les données pour l'API
    const apiData = {
        stock_quantity: parseFloat(data.quantity || data.stock_quantity)
    };

    return api.put(`/article-stock-depot/update/${id}`, apiData);
};

/**
 * Supprimer un stock
 * @param {number} id - ID du stock à supprimer
 */
export const deleteArticleStockDepot = (id) => api.delete(`/article-stock-depot/delete/${id}`);

/**
 * Récupérer les stocks d'un article spécifique
 * @param {number} articleId - ID de l'article
 */
export const getStocksByArticleId = (articleId) =>
    api.get(`/article-stock-depot/search?article_id=${articleId}`);

/**
 * Récupérer les stocks d'un dépôt spécifique
 * @param {number} depotId - ID du dépôt
 */
export const getStocksByDepotId = (depotId) =>
    api.get(`/article-stock-depot/search?depot_id=${depotId}`);