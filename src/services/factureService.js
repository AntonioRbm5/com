import api from "./api";

// ============================================
// FACTURE
// ============================================

/**
 * Créer une nouvelle facture
 * @param {Object} data - Données de la facture
 */
export const createFacture = (data) => api.post("/facture/create", data);

/**
 * Récupérer toutes les factures
 */
export const getAllFactures = () => api.get("/facture/all");

/**
 * Récupérer une facture par ID
 * @param {number} id - ID de la facture
 */
export const getFactureById = (id) => api.get(`/facture/get/${id}`);

/**
 * Mettre à jour une facture
 * @param {number} id - ID de la facture
 * @param {Object} data - Nouvelles données
 */
export const updateFacture = (id, data) => api.put(`/facture/update/${id}`, data);

/**
 * Supprimer une facture
 * @param {number} id - ID de la facture
 */
export const deleteFacture = (id) => api.delete(`/facture/delete/${id}`);

/**
 * Rechercher des factures
 * @param {Object} filters - Critères de recherche
 */
export const searchFacture = (filters) => api.post("/facture/search", filters);

/**
 * Comptabiliser une facture
 * @param {number} id - ID de la facture
 */
export const comptabiliserFacture = (id) => api.post(`/facture/comptabiliser/${id}`);