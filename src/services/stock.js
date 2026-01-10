import api from "./api";

// ============================================
// DEPOT API CALLS
// ============================================
export const getAllDepots = () => api.get("/stockage-depot/search");
export const createDepot = (data) => api.post("/stockage-depot/create", data);
export const updateDepot = (id, data) => api.put(`/stockage-depot/${id}`, data);
export const deleteDepot = (id) => api.delete(`/stockage-depot/${id}`);

// ============================================
// MOUVEMENT API CALLS
// ============================================
export const getAllMouvements = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/stock-mouvement/search${queryString ? `?${queryString}` : ''}`);
};

export const getMouvementById = (id) => api.get(`/stock-mouvement/${id}`);

export const createMouvement = (data) => api.post("/stock-mouvement/create", data);

export const updateMouvement = (id, data) => api.put(`/stock-mouvement/${id}`, data);

export const deleteMouvement = (id) => api.delete(`/stock-mouvement/${id}`);

// ============================================
// MOUVEMENT LINES (LIGNES) API CALLS
// ============================================
export const getMouvementLines = (mouvementId) => 
  api.get(`/mouvements/${mouvementId}/lignes`);

export const createMouvementLine = (mouvementId, data) => 
  api.post(`/mouvements/${mouvementId}/lignes`, data);

export const updateMouvementLine = (mouvementId, lineId, data) => 
  api.put(`/mouvements/${mouvementId}/lignes/${lineId}`, data);

export const deleteMouvementLine = (mouvementId, lineId) => 
  api.delete(`/mouvements/${mouvementId}/lignes/${lineId}`);

// ============================================
// ARTICLES API CALLS
// ============================================
export const getAllArticles = () => api.get("/articles/all");
export const getArticleById = (id) => api.get(`/articles/${id}`);
export const searchArticles = (query) => api.get(`/articles/search?q=${query}`);

// ============================================
// STOCK REPORTS API CALLS
// ============================================
export const getStockReport = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/stock/report?${queryString}`);
};

export const getStockMovementsReport = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/stock/mouvements-report?${queryString}`);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Transforme la réponse API des dépôts en format utilisable par l'UI
 */
export const transformDepotResponse = (apiResponse) => {
  if (!apiResponse?.data?.data) return [];
  
  return apiResponse.data.data.map(depot => ({
    id: depot.depot_id,
    name: depot.depot_name,
    code: depot.depot_code,
    responsable: depot.responsable?.username || 'N/A',
    addedDate: depot.depot_added_date,
    updatedDate: depot.depot_updated_date
  }));
};

/**
 * Transforme les données de mouvement pour l'API
 */
export const transformMouvementForAPI = (mouvementData) => {
  return {
    type: mouvementData.header.type || 'Mouvement d\'entrée',
    numero_document: mouvementData.header.numeroDocument,
    reference: mouvementData.header.reference,
    date: mouvementData.header.date,
    depot_origine_id: mouvementData.header.depotId,
    depot_destination_id: mouvementData.header.depotDestinationId || null,
    affaire: mouvementData.header.affaire,
    info1: mouvementData.header.info1,
    info2: mouvementData.header.info2,
    poids_net: mouvementData.totaux.poidsNet,
    poids_brut: mouvementData.totaux.poidsBrut,
    total_ht: mouvementData.totaux.totalHT,
    lignes: mouvementData.lignes.map(ligne => ({
      reference: ligne.reference,
      designation: ligne.designation,
      quantite: parseFloat(ligne.quantite),
      pu_ht: parseFloat(ligne.puHT),
      conditionnement: ligne.conditionnement,
      montant_ht: parseFloat(ligne.montantHT)
    }))
  };
};

/**
 * Transforme la réponse API des mouvements pour l'UI
 */
export const transformMouvementFromAPI = (apiMouvement) => {
  return {
    id: apiMouvement.id,
    type: apiMouvement.type,
    numeroPiece: apiMouvement.numero_document,
    reference: apiMouvement.reference,
    date: apiMouvement.date,
    depotOrigine: apiMouvement.depot_origine?.depot_name || '',
    depotDestination: apiMouvement.depot_destination?.depot_name || '',
    header: {
      date: apiMouvement.date,
      numeroDocument: apiMouvement.numero_document,
      depot: apiMouvement.depot_origine?.depot_name || '',
      depotId: apiMouvement.depot_origine_id,
      depotDestinationId: apiMouvement.depot_destination_id,
      reference: apiMouvement.reference,
      affaire: apiMouvement.affaire,
      info1: apiMouvement.info1,
      info2: apiMouvement.info2
    },
    lignes: (apiMouvement.lignes || []).map(ligne => ({
      id: ligne.id,
      reference: ligne.reference,
      designation: ligne.designation,
      puHT: ligne.pu_ht.toString(),
      quantite: ligne.quantite.toString(),
      conditionnement: ligne.conditionnement,
      montantHT: ligne.montant_ht.toString()
    })),
    totaux: {
      poidsNet: apiMouvement.poids_net || 0,
      poidsBrut: apiMouvement.poids_brut || 0,
      totalHT: apiMouvement.total_ht || 0
    }
  };
};