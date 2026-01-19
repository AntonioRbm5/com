// import api from "./api";

// // COMMANDE - En-tête
// export const createCommande = (data) => api.post("/commande/create", data);
// export const getCommandeById = (id) => api.get(`/commande/get/${id}`);
// export const updateCommande = (id, data) => api.put(`/commande/update/${id}`, data);
// export const deleteCommande = (id) => api.delete(`/commande/delete/${id}`);
// export const searchCommande = (filters, page = 1, pageSize = 10) => 
//     api.post(`/commande/search?page=${page}&page_size=${pageSize}`, filters);

// // COMMANDE DETAIL - Lignes de commande
// export const createCommandeDetail = (data) => api.post("/commande-detail/create", data);
// export const getCommandeDetailById = (id) => api.get(`/commande-detail/get/${id}`);
// export const updateCommandeDetail = (id, data) => api.put(`/commande-detail/update/${id}`, data);
// export const deleteCommandeDetail = (id) => api.delete(`/commande-detail/delete/${id}`);
// export const searchCommandeDetail = (filters) => api.post("/commande-detail/search", filters);

import api from "./api";

// ============================================
// COMMANDE - En-tête
// ============================================

/**
 * Créer une nouvelle commande
 * @param {Object} data - Données de la commande
 */
export const createCommande = (data) => api.post("/commande/create", data);

/**
 * Récupérer une commande par ID
 * @param {number} id - ID de la commande
 */
export const getCommandeById = (id) => api.get(`/commande/get/${id}`);

/**
 * Mettre à jour une commande
 * @param {number} id - ID de la commande
 * @param {Object} data - Nouvelles données
 */
export const updateCommande = (id, data) => api.put(`/commande/update/${id}`, data);

/**
 * Supprimer une commande
 * @param {number} id - ID de la commande
 */
export const deleteCommande = (id) => api.delete(`/commande/delete/${id}`);

/**
 * Rechercher des commandes avec filtres
 * @param {Object} filters - Critères de recherche
 * @param {number} page - Numéro de page
 * @param {number} pageSize - Taille de page
 */
export const searchCommande = (filters, page = 1, pageSize = 10) =>
    api.post(`/commande/search?page=${page}&page_size=${pageSize}`, filters);

// ============================================
// COMMANDE DETAIL - Lignes de commande
// ============================================

/**
 * Ajouter une ligne à une commande
 * @param {Object} data - Données de la ligne
 */
export const createCommandeDetail = (data) => api.post("/commande-detail/create", data);

/**
 * Récupérer un détail de commande par ID
 * @param {number} id - ID du détail
 */
export const getCommandeDetailById = (id) => api.get(`/commande-detail/get/${id}`);

/**
 * Mettre à jour une ligne de commande
 * @param {number} id - ID du détail
 * @param {Object} data - Nouvelles données
 */
export const updateCommandeDetail = (id, data) => api.put(`/commande-detail/update/${id}`, data);

/**
 * Supprimer une ligne de commande
 * @param {number} id - ID du détail
 */
export const deleteCommandeDetail = (id) => api.delete(`/commande-detail/delete/${id}`);

/**
 * Rechercher les détails d'une commande
 * @param {Object} filters - Filtres de recherche
 */
export const searchCommandeDetail = (filters) => api.post("/commande-detail/search", filters);