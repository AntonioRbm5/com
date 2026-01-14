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
export const getAllStockMouvement = () => api.get("/stock-mouvement/search");
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
 * Format API: { depot_id, depot_name, depot_code, depot_responsable_id, responsable: {...} }
 * Format UI: { id, name, code, responsable }
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
 * Format UI -> Format API
 */
export const transformMouvementForAPI = (mouvementData) => {
    // Format attendu par l'API selon la doc Postman
    return {
        mouvement_type: mouvementData.header.type || 'ENTREE',
        mouvement_reference: mouvementData.header.numeroDocument,
        mouvement_date: formatDateForAPI(mouvementData.header.date),
        depot_source_id: mouvementData.header.depotId,
        depot_destination_id: mouvementData.header.depotDestinationId || null,
        article_id: mouvementData.header.articleId || null,
        mouvement_quantity: mouvementData.totaux?.poidsNet || 0,
        mouvement_valeur: mouvementData.totaux?.totalHT || 0,
        unite_id: mouvementData.header.uniteId || 1,
        lot_id: mouvementData.header.lotId || null,
        // Informations supplémentaires (si l'API les accepte)
        affaire: mouvementData.header.affaire,
        info1: mouvementData.header.info1,
        info2: mouvementData.header.info2,
        lignes: mouvementData.lignes || []
    };
};

/**
 * Transforme la réponse API des mouvements pour l'UI
 * Format API -> Format UI
 */
export const transformMouvementFromAPI = (apiMouvement) => {
    return {
        id: apiMouvement.mouvement_id,
        type: translateMouvementType(apiMouvement.mouvement_type),
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
            type: translateMouvementType(apiMouvement.mouvement_type)
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
 * Traduit le type de mouvement de l'API vers l'UI
 */
const translateMouvementType = (apiType) => {
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
 * Formate une date pour l'API (DDMMYY -> ISO)
 */
const formatDateForAPI = (dateStr) => {
    if (!dateStr) return new Date().toISOString();

    // Si format DDMMYY (6 chiffres)
    if (dateStr.length === 6 && /^\d+$/.test(dateStr)) {
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = '20' + dateStr.substring(4, 6);
        return new Date(`${year}-${month}-${day}`).toISOString();
    }

    // Si déjà au format ISO ou autre
    return new Date(dateStr).toISOString();
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