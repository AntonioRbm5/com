import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getAllDepots,
  getAllMouvements,
  createMouvement,
  updateMouvement,
  deleteMouvement,
  transformDepotResponse,
  transformMouvementForAPI,
  transformMouvementFromAPI
} from '../services/stock';

const StockContext = createContext();

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock doit être utilisé dans un StockProvider');
  }
  return context;
};

export const StockProvider = ({ children }) => {
  const [depots, setDepots] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // DEPOT OPERATIONS
  // ============================================
  const fetchDepots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllDepots();
      const transformedDepots = transformDepotResponse(response);
      setDepots(transformedDepots);
      return transformedDepots;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des dépôts');
      console.error('Erreur fetchDepots:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // MOUVEMENT OPERATIONS
  // ============================================
  const fetchMouvements = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMouvements(filters);
      
      if (response?.data?.data) {
        const transformedMouvements = response.data.data.map(transformMouvementFromAPI);
        setMouvements(transformedMouvements);
        return transformedMouvements;
      }
      return [];
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des mouvements');
      console.error('Erreur fetchMouvements:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addMouvement = useCallback(async (mouvementData) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiData = transformMouvementForAPI(mouvementData);
      const response = await createMouvement(apiData);
      
      if (response?.data?.data) {
        const newMouvement = transformMouvementFromAPI(response.data.data);
        setMouvements(prev => [...prev, newMouvement]);
        return { success: true, data: newMouvement };
      }
      
      return { success: false, error: 'Pas de données retournées' };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la création du mouvement';
      setError(errorMessage);
      console.error('Erreur addMouvement:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMouvementData = useCallback(async (mouvementId, mouvementData) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiData = transformMouvementForAPI(mouvementData);
      const response = await updateMouvement(mouvementId, apiData);
      
      if (response?.data?.data) {
        const updatedMouvement = transformMouvementFromAPI(response.data.data);
        setMouvements(prev =>
          prev.map(m => m.id === mouvementId ? updatedMouvement : m)
        );
        return { success: true, data: updatedMouvement };
      }
      
      return { success: false, error: 'Pas de données retournées' };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la modification du mouvement';
      setError(errorMessage);
      console.error('Erreur updateMouvementData:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMouvement = useCallback(async (mouvementId) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteMouvement(mouvementId);
      setMouvements(prev => prev.filter(m => m.id !== mouvementId));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la suppression du mouvement';
      setError(errorMessage);
      console.error('Erreur removeMouvement:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // FILTER OPERATIONS
  // ============================================
  const filterMouvementsByType = useCallback((type) => {
    if (type === 'Tous les documents') {
      return mouvements;
    }
    return mouvements.filter(m => m.type === type);
  }, [mouvements]);

  const searchMouvements = useCallback((searchTerm) => {
    if (!searchTerm) return mouvements;
    
    const term = searchTerm.toLowerCase();
    return mouvements.filter(m =>
      m.numeroPiece.toLowerCase().includes(term) ||
      m.reference.toLowerCase().includes(term) ||
      m.depotOrigine.toLowerCase().includes(term) ||
      (m.depotDestination && m.depotDestination.toLowerCase().includes(term))
    );
  }, [mouvements]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    // State
    depots,
    mouvements,
    loading,
    error,
    
    // Depot operations
    fetchDepots,
    
    // Mouvement operations
    fetchMouvements,
    addMouvement,
    updateMouvementData,
    removeMouvement,
    
    // Filters
    filterMouvementsByType,
    searchMouvements,
    
    // Utilities
    clearError: () => setError(null)
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};