import api from "./api";

// ============================================
// DEPOT API CALLS
// ============================================
export const createStockageDepot = (data) => api.post(`/stockage-depot/create`, data);
export const searchStockageDepot = (name = '') => api.get(`/stockage-depot/search${name ? `?name=${name}` : ''}`);
export const getStockageDepotById = (depot_id) => api.get(`/stockage-depot/depot/${depot_id}`);
export const updateStockageDepot = (depot_id, data) => api.put(`/stockage-depot/update/${depot_id}`, data);
export const deleteStockageDepot = (depot_id) => api.delete(`/stockage-depot/delete/${depot_id}`);

// ============================================
// MOUVEMENT API CALLS
// ============================================
export const createStockMouvement = (data) => api.post(`/stock-mouvement/create`, data);
export const getStockMouvementById = (id) => api.get(`/stock-mouvement/get/${id}`);
export const getAllStockMouvement = () => api.get("/stock-mouvement/all");
export const getStockMouvementByArticleId = (article_id) => api.get(`/stock-mouvement/search?article_id=${article_id}`);
export const getStockMouvementByReference = (mouvement_reference) => api.get(`/stock-mouvement/search?mouvement_reference=${mouvement_reference}`);
export const updateStockMouvement = (data, id) => api.put(`/stock-mouvement/update/${id}`, data);
export const deleteStockMouvement = (id) => api.delete(`/stock-mouvement/delete/${id}`);

// ============================================
// ÉTAT DU STOCK
// ============================================
export const getStockState = () => api.get("/stock-management/stock/state");
export const getArticleState = () => api.get("/stock-management/article-state");

// ============================================
// UTILITY FUNCTIONS - TRANSFORMATION DES DONNÉES
// ============================================

/**
 * Transforme la réponse API des dépôts en format utilisable par l'UI
 */
export const transformDepotResponse = (apiResponse) => {
  if (!apiResponse?.data?.data) return [];

  const depots = Array.isArray(apiResponse.data.data)
    ? apiResponse.data.data
    : [apiResponse.data.data];

  return depots.map(depot => ({
    id: depot.depot_id,
    name: depot.depot_name,
    code: depot.depot_code,
    responsable: depot.responsable?.username || 'N/A',
    responsableId: depot.depot_responsable_id,
    addedDate: depot.depot_added_date,
    updatedDate: depot.depot_updated_date
  }));
};

/**
 * Transforme les données de mouvement pour l'API
 * CORRECTION: Utilise le format exact attendu par l'API
 */
export const transformMouvementForAPI = (mouvementData) => {
  console.log('🔵 Données reçues du formulaire:', JSON.stringify(mouvementData, null, 2));

  // Validation des données obligatoires
  if (!mouvementData?.header) {
    throw new Error('Header manquant dans les données du mouvement');
  }

  if (!mouvementData.header.date) {
    throw new Error('Date manquante dans le header');
  }

  if (!mouvementData.header.depotId) {
    throw new Error('Dépôt manquant dans le header');
  }

  if (!mouvementData.header.articleId) {
    throw new Error('Article manquant dans le header');
  }

  console.log('📅 Date brute reçue:', mouvementData.header.date, 'Type:', typeof mouvementData.header.date);

  // Format attendu selon la doc Postman:
  const apiData = {
    mouvement_type: translateMouvementTypeToAPI(mouvementData.header.type),
    mouvement_reference: mouvementData.header.numeroDocument,
    mouvement_date: formatDateForAPI(mouvementData.header.date),
    depot_source_id: parseInt(mouvementData.header.depotId),
    depot_destination_id: mouvementData.header.depotDestinationId ? parseInt(mouvementData.header.depotDestinationId) : null,
    article_id: parseInt(mouvementData.header.articleId),
    mouvement_quantity: parseFloat(mouvementData.totaux.poidsNet) || 0,
    mouvement_valeur: parseFloat(mouvementData.totaux.totalHT) || 0,
    unite_id: parseInt(mouvementData.header.uniteId) || 1,
    lot_id: mouvementData.header.lotId ? parseInt(mouvementData.header.lotId) : null
  };

  console.log('🟢 Données transformées pour API:', JSON.stringify(apiData, null, 2));
  return apiData;
};

/**
 * Transforme la réponse API des mouvements pour l'UI
 */
export const transformMouvementFromAPI = (apiMouvement) => {
  console.log('🔵 Données reçues de l\'API:', apiMouvement);

  return {
    id: apiMouvement.mouvement_id,
    type: translateMouvementTypeFromAPI(apiMouvement.mouvement_type),
    numeroPiece: apiMouvement.mouvement_reference,
    reference: apiMouvement.mouvement_reference,
    date: formatDateFromAPI(apiMouvement.mouvement_date),
    depotOrigine: apiMouvement.depot_source?.depot_name || '',
    depotDestination: apiMouvement.depot_destination?.depot_name || '',

    header: {
      date: formatDateFromAPI(apiMouvement.mouvement_date),
      numeroDocument: apiMouvement.mouvement_reference,
      depot: apiMouvement.depot_source?.depot_name || '',
      depotId: apiMouvement.depot_source_id,
      depotDestinationId: apiMouvement.depot_destination_id,
      reference: apiMouvement.mouvement_reference,
      articleId: apiMouvement.article_id,
      uniteId: apiMouvement.unite_id,
      lotId: apiMouvement.lot_id,
      type: translateMouvementTypeFromAPI(apiMouvement.mouvement_type)
    },

    lignes: apiMouvement.lignes || [],

    totaux: {
      poidsNet: apiMouvement.mouvement_quantity || 0,
      poidsBrut: 0,
      totalHT: apiMouvement.mouvement_valeur || 0
    }
  };
};

/**
 * Traduit le type de mouvement de l'UI vers l'API
 */
const translateMouvementTypeToAPI = (uiType) => {
  const typeMap = {
    'Mouvement d\'entrée': 'ENTREE',
    'Mouvement de sortie': 'SORTIE',
    'Mouvement de transfert': 'TRANSFERT',
    'Dépréciation du stock': 'DEPRECIATION',
    'Bon de fabrication': 'FABRICATION',
    'Préparation de fabrication': 'PREPARATION_FABRICATION'
  };
  return typeMap[uiType] || 'ENTREE';
};

/**
 * Traduit le type de mouvement de l'API vers l'UI
 */
const translateMouvementTypeFromAPI = (apiType) => {
  const typeMap = {
    'ENTREE': 'Mouvement d\'entrée',
    'SORTIE': 'Mouvement de sortie',
    'TRANSFERT': 'Mouvement de transfert',
    'DEPRECIATION': 'Dépréciation du stock',
    'FABRICATION': 'Bon de fabrication',
    'PREPARATION_FABRICATION': 'Préparation de fabrication'
  };
  return typeMap[apiType] || apiType;
};

/**
 * Formate une date pour l'API (DDMMYY -> ISO)
 */
const formatDateForAPI = (dateStr) => {
  console.log('📅 formatDateForAPI - Input:', dateStr, 'Type:', typeof dateStr);

  if (!dateStr) {
    console.log('⚠️ Date vide, utilisation de la date actuelle');
    return new Date().toISOString();
  }

  // Convertir en string si ce n'est pas déjà le cas
  const dateString = String(dateStr).trim();
  console.log('📅 Date après conversion string:', dateString, 'Length:', dateString.length);

  try {
    // Si format DDMMYY (6 chiffres)
    if (dateString.length === 6 && /^\d{6}$/.test(dateString)) {
      const day = dateString.substring(0, 2);
      const month = dateString.substring(2, 4);
      const year = '20' + dateString.substring(4, 6);

      // Validation des valeurs
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
        throw new Error(`Date invalide: jour=${day}, mois=${month}`);
      }

      const dateObj = new Date(`${year}-${month}-${day}T00:00:00Z`);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Date invalide après parsing: ${year}-${month}-${day}`);
      }

      const isoDate = dateObj.toISOString();
      console.log('✅ Format DDMMYY -> ISO:', isoDate);
      return isoDate;
    }

    // Si format YYYYMMDD (8 chiffres)
    if (dateString.length === 8 && /^\d{8}$/.test(dateString)) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);

      const dateObj = new Date(`${year}-${month}-${day}T00:00:00Z`);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Date invalide après parsing: ${year}-${month}-${day}`);
      }

      const isoDate = dateObj.toISOString();
      console.log('✅ Format YYYYMMDD -> ISO:', isoDate);
      return isoDate;
    }

    // Si format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const dateObj = new Date(dateString + 'T00:00:00Z');
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Date invalide: ${dateString}`);
      }

      const isoDate = dateObj.toISOString();
      console.log('✅ Format YYYY-MM-DD -> ISO:', isoDate);
      return isoDate;
    }

    // Dernière tentative: parsing direct
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Impossible de parser la date: ${dateString}`);
    }

    const isoDate = dateObj.toISOString();
    console.log('✅ Format direct -> ISO:', isoDate);
    return isoDate;

  } catch (err) {
    console.error('❌ Erreur formatage date:', err);
    console.error('❌ Date problématique:', dateStr);

    // Fallback: date actuelle
    const fallbackDate = new Date().toISOString();
    console.log('⚠️ Utilisation date actuelle comme fallback:', fallbackDate);
    return fallbackDate;
  }
};

/**
 * Formate une date de l'API vers l'UI (ISO -> DDMMYY)
 */
const formatDateFromAPI = (dateStr) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).substring(2);

  return `${day}${month}${year}`;
};

/**
 * Transforme l'état du stock de l'API vers l'UI
 */
export const transformStockStateFromAPI = (apiResponse) => {
  if (!apiResponse?.data?.data?.depots) return [];

  return apiResponse.data.data.depots.map(depot => ({
    depot_id: depot.depot_id,
    depot_name: depot.depot_name,
    depot_code: depot.depot_code,
    articles: depot.articles.map(article => ({
      article_id: article.article_id,
      article_name: article.article_name,
      article_reference: article.article_reference,
      total_quantity: article.total_quantity,
      total_value: article.total_value,
      lots: article.lots || []
    }))
  }));
};

/**
 * Prépare les données pour créer un nouveau dépôt
 */
export const prepareDepotData = (formData) => {
  return {
    depot_name: formData.name,
    depot_code: formData.code,
    depot_responsable_id: formData.responsableId || 1,
    depot_coordonnees_id: formData.coordonneesId || null,
    depot_telecommunication_id: formData.telecommunicationId || null
  };
};