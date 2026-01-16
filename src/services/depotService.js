// import api from "./api";

// // Gestion des dépôts
// export const getAllDepots = () => api.get('/depots');
// export const getDepotById = (id) => api.get(`/depots/${id}`);
// export const createDepot = (data) => api.post('/depots/create', data);
// export const updateDepot = (id, data) => api.put(`/depots/update/${id}`, data);
// export const deleteDepot = (id) => api.delete(`/depots/delete/${id}`);

import api from "./api";

// ============================================
// GESTION DES DÉPÔTS (Version simplifiée)
// ============================================

/**
 * Récupérer tous les dépôts
 */
export const getAllDepots = () => api.get('/depots');

/**
 * Récupérer un dépôt par ID
 * @param {number} id - ID du dépôt
 */
export const getDepotById = (id) => api.get(`/depots/${id}`);

/**
 * Créer un nouveau dépôt
 * @param {Object} data - Données du dépôt
 */
export const createDepot = (data) => api.post('/depots/create', data);

/**
 * Mettre à jour un dépôt
 * @param {number} id - ID du dépôt
 * @param {Object} data - Nouvelles données
 */
export const updateDepot = (id, data) => api.put(`/depots/update/${id}`, data);

/**
 * Supprimer un dépôt
 * @param {number} id - ID du dépôt
 */
export const deleteDepot = (id) => api.delete(`/depots/delete/${id}`);