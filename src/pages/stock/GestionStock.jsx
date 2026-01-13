import React, { useState, useEffect } from 'react';
import DocumentsStockListe from './DocumentsStockListe';
import MouvementEntreeModal from './MouvementEntreeModal';
import FiltresMouvementModal from './FiltresMouvementModal';
import ImpressionModal from './ImpressionModal';
import ApercuImpressionModal from './ApercuImpressionModal';
import {
    getAllStockMouvement,
    searchStockageDepot,
    createStockMouvement,
    updateStockMouvement,
    deleteStockMouvement,
    getStockState,
    transformDepotResponse,
    transformMouvementForAPI,
    transformMouvementFromAPI,
    transformStockStateFromAPI
} from '../../services/stockService';
import "./stock.css";

const GestionStock = () => {
    // États pour les données
    const [documents, setDocuments] = useState([]);
    const [depots, setDepots] = useState([]);
    const [stockState, setStockState] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // États pour les modales
    const [showMouvementModal, setShowMouvementModal] = useState(false);
    const [showFiltresModal, setShowFiltresModal] = useState(false);
    const [showImpressionModal, setShowImpressionModal] = useState(false);
    const [showApercuModal, setShowApercuModal] = useState(false);

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [dataForPreview, setDataForPreview] = useState(null);

    // Chargement initial des données
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Charger les dépôts
            const depotsResponse = await searchStockageDepot();
            if (depotsResponse?.data?.status === 'success') {
                const transformedDepots = transformDepotResponse(depotsResponse);
                setDepots(transformedDepots);
            }

            // Charger les mouvements de stock
            const mouvementsResponse = await getAllStockMouvement();
            if (mouvementsResponse?.data?.status === 'success') {
                const mouvements = mouvementsResponse.data.data || [];
                const transformedMouvements = mouvements.map(transformMouvementFromAPI);
                setDocuments(transformedMouvements);
            }

            // Charger l'état du stock
            const stockStateResponse = await getStockState();
            if (stockStateResponse?.data?.status === 'success') {
                const stockData = transformStockStateFromAPI(stockStateResponse);
                setStockState(stockData);
            }
        } catch (err) {
            console.error('Erreur chargement initial:', err);
            setError(err.response?.data?.message || 'Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Gestionnaires pour les documents
    const handleNewDocument = () => {
        setSelectedDocument(null);
        setShowMouvementModal(true);
    };

    const handleSelectDocument = (doc) => {
        setSelectedDocument(doc);
        setShowMouvementModal(true);
    };

    const handleSaveDocument = async (documentData) => {
        try {
            setLoading(true);
            
            // Validation des données avant transformation
            console.log('📥 Données reçues du modal:', documentData);
            
            if (!documentData?.header) {
                throw new Error('Données du formulaire incomplètes: header manquant');
            }
            
            if (!documentData.header.date) {
                throw new Error('Date manquante dans le formulaire');
            }
            
            if (!documentData.header.depotId) {
                throw new Error('Dépôt non sélectionné');
            }
            
            if (!documentData.header.articleId) {
                throw new Error('Article non sélectionné');
            }
            
            if (!documentData.totaux) {
                throw new Error('Totaux manquants');
            }
            
            console.log('✅ Validation des données réussie');
            
            // Transformation des données pour l'API
            const apiData = transformMouvementForAPI(documentData);
            console.log('🔄 Transformation terminée:', apiData);

            let response;
            if (selectedDocument && selectedDocument.id) {
                // Modification d'un mouvement existant
                console.log('🔄 Mode UPDATE - ID:', selectedDocument.id);
                response = await updateStockMouvement(apiData, selectedDocument.id);
            } else {
                // Création d'un nouveau mouvement
                console.log('✨ Mode CREATE');
                response = await createStockMouvement(apiData);
            }

            console.log('📨 Réponse API:', response?.data);

            if (response?.data?.status === 'success') {
                const savedMouvement = transformMouvementFromAPI(response.data.data);

                if (selectedDocument && selectedDocument.id) {
                    // Mettre à jour dans la liste
                    setDocuments(prev => prev.map(d => 
                        d.id === selectedDocument.id ? savedMouvement : d
                    ));
                } else {
                    // Ajouter à la liste
                    setDocuments(prev => [...prev, savedMouvement]);
                }

                setShowMouvementModal(false);
                alert('Document sauvegardé avec succès');
                
                // Recharger l'état du stock
                const stockStateResponse = await getStockState();
                if (stockStateResponse?.data?.status === 'success') {
                    const stockData = transformStockStateFromAPI(stockStateResponse);
                    setStockState(stockData);
                }
            } else {
                const errorMsg = response?.data?.message || 'Erreur lors de la sauvegarde';
                console.error('❌ Erreur API:', errorMsg);
                alert(errorMsg);
            }
        } catch (err) {
            console.error('❌ Erreur sauvegarde document:', err);
            console.error('❌ Stack trace:', err.stack);
            
            // Message d'erreur plus détaillé
            let errorMessage = 'Erreur lors de la sauvegarde';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            alert(`Erreur: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await deleteStockMouvement(docId);
            
            if (response?.data?.status === 'success') {
                setDocuments(prev => prev.filter(d => d.id !== docId));
                alert('Document supprimé avec succès');
                
                // Recharger l'état du stock
                const stockStateResponse = await getStockState();
                if (stockStateResponse?.data?.status === 'success') {
                    const stockData = transformStockStateFromAPI(stockStateResponse);
                    setStockState(stockData);
                }
            }
        } catch (err) {
            console.error('Erreur suppression document:', err);
            alert(`Erreur: ${err.response?.data?.message || 'Erreur lors de la suppression'}`);
        } finally {
            setLoading(false);
        }
    };

    // Gestionnaires pour les filtres
    const handleApplyFiltres = async (filtres) => {
        try {
            setLoading(true);
            console.log('Filtres appliqués:', filtres);

            // Pour l'instant, on recharge tous les mouvements
            // TODO: Implémenter le filtrage côté API
            const mouvementsResponse = await getAllStockMouvement();
            if (mouvementsResponse?.data?.status === 'success') {
                const mouvements = mouvementsResponse.data.data || [];
                let transformedMouvements = mouvements.map(transformMouvementFromAPI);

                // Filtrage côté client (à améliorer avec des filtres API)
                if (filtres.depot && filtres.depot !== 'Tous') {
                    transformedMouvements = transformedMouvements.filter(
                        m => m.depotOrigine === filtres.depot
                    );
                }

                if (filtres.dateDe) {
                    transformedMouvements = transformedMouvements.filter(
                        m => m.date >= filtres.dateDe
                    );
                }

                if (filtres.dateA) {
                    transformedMouvements = transformedMouvements.filter(
                        m => m.date <= filtres.dateA
                    );
                }

                setDocuments(transformedMouvements);
            }
        } catch (err) {
            console.error('Erreur application filtres:', err);
            alert(`Erreur: ${err.response?.data?.message || 'Erreur lors de l\'application des filtres'}`);
        } finally {
            setLoading(false);
        }
    };

    // Gestionnaires pour l'impression
    const handlePrint = (options) => {
        console.log('Impression avec options:', options);
        window.print();
    };

    const handlePreview = (options) => {
        const dataSource = selectedDocument || (documents.length > 0 ? documents[0] : null);

        if (!dataSource) {
            alert('Aucune donnée à prévisualiser');
            return;
        }

        setDataForPreview({
            entreprise: {
                nom: 'Votre Entreprise',
                depot: dataSource.depotOrigine
            },
            periode: {
                du: options.dateDe || dataSource.date,
                au: options.dateA || dataSource.date
            },
            lignes: dataSource.lignes || []
        });

        setShowImpressionModal(false);
        setShowApercuModal(true);
    };

    // Afficher un loader pendant le chargement initial
    if (loading && documents.length === 0 && depots.length === 0) {
        return (
            <div className="stock-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Chargement des données...</div>
            </div>
        );
    }

    // Afficher une erreur si nécessaire
    if (error && documents.length === 0) {
        return (
            <div className="stock-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ color: 'red' }}>Erreur: {error}</div>
                <button
                    className="btn-custom btn-primary-custom"
                    onClick={loadInitialData}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="stock-container">
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px 40px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        Chargement...
                    </div>
                </div>
            )}

            <DocumentsStockListe
                documents={documents}
                onSelectDocument={handleSelectDocument}
                onNewDocument={handleNewDocument}
                onOpenFiltres={() => setShowFiltresModal(true)}
                onDeleteDocument={handleDeleteDocument}
            />

            <MouvementEntreeModal
                show={showMouvementModal}
                onHide={() => setShowMouvementModal(false)}
                mouvement={selectedDocument}
                onSave={handleSaveDocument}
                depots={depots}
            />

            <FiltresMouvementModal
                show={showFiltresModal}
                onHide={() => setShowFiltresModal(false)}
                onApply={handleApplyFiltres}
                depots={depots}
            />

            <ImpressionModal
                show={showImpressionModal}
                onHide={() => setShowImpressionModal(false)}
                onPrint={handlePrint}
                onPreview={handlePreview}
            />

            <ApercuImpressionModal
                show={showApercuModal}
                onHide={() => setShowApercuModal(false)}
                data={dataForPreview}
            />
        </div>
    );
};

export default GestionStock;