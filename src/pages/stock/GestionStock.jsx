import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentsStockListe from './DocumentsStockListe';
import MouvementEntreeModal from './MouvementEntreeModal';
import FiltresMouvementModal from './FiltresMouvementModal';
import ImpressionModal from './ImpressionModal';
import ApercuImpressionModal from './ApercuImpressionModal';
import ArticleStockDepotListView from './ArticleStockDepotListView';
import {
    getAllStockMouvement,
    searchStockageDepot,
    createStockMouvement,
    updateStockMouvement,
    deleteStockMouvement,
    getStockState,
    transformDepotResponse,
    transformMouvementFromAPI,
    transformStockStateFromAPI
} from '../../services/stockService';
import "./stock.css";
import Sidebar from '../../composants/sidebar';
import Navbar from '../../composants/navbar';


const VUES = {
    MOUVEMENTS: 'mouvements',
    STOCK_DEPOT: 'stock_depot',
};

const GestionStock = () => {
    const navigate = useNavigate();


    const [vueActive, setVueActive] = useState(VUES.MOUVEMENTS);


    const [documents, setDocuments] = useState([]);
    const [depots, setDepots] = useState([]);
    const [stockState, setStockState] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const [showMouvementModal, setShowMouvementModal] = useState(false);
    const [showFiltresModal, setShowFiltresModal] = useState(false);
    const [showImpressionModal, setShowImpressionModal] = useState(false);
    const [showApercuModal, setShowApercuModal] = useState(false);

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [dataForPreview, setDataForPreview] = useState(null);


    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            const depotsResponse = await searchStockageDepot();
            if (depotsResponse?.data?.status === 'success') {
                setDepots(transformDepotResponse(depotsResponse));
            }

            const mouvementsResponse = await getAllStockMouvement();
            if (mouvementsResponse?.data?.status === 'success') {
                const mouvements = mouvementsResponse.data.data || [];
                setDocuments(mouvements.map(transformMouvementFromAPI));
            }

            const stockStateResponse = await getStockState();
            if (stockStateResponse?.data?.status === 'success') {
                setStockState(transformStockStateFromAPI(stockStateResponse));
            }
        } catch (err) {
            console.error('Erreur chargement initial:', err);
            setError(err.response?.data?.message || 'Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };


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

            if (!documentData.mouvement_reference) throw new Error('Référence du mouvement manquante');
            if (!documentData.depot_destination_id) throw new Error('Dépôt de destination manquant');
            if (!documentData.article_id) throw new Error('Article non sélectionné');

            let response;
            if (selectedDocument?.id) {
                response = await updateStockMouvement(documentData, selectedDocument.id);
            } else {
                response = await createStockMouvement(documentData);
            }

            if (response?.data?.status === 'success') {
                const savedMouvement = transformMouvementFromAPI(response.data.data);

                setDocuments(prev =>
                    selectedDocument?.id
                        ? prev.map(d => d.id === selectedDocument.id ? savedMouvement : d)
                        : [...prev, savedMouvement]
                );

                setShowMouvementModal(false);
                alert('✅ Document sauvegardé avec succès');

                const stockStateResponse = await getStockState();
                if (stockStateResponse?.data?.status === 'success') {
                    setStockState(transformStockStateFromAPI(stockStateResponse));
                }
            } else {
                alert(`❌ ${response?.data?.message || 'Erreur lors de la sauvegarde'}`);
            }
        } catch (err) {
            console.error('❌ Erreur sauvegarde:', err);
            alert(`❌ Erreur: ${err.response?.data?.message || err.message || 'Erreur inconnue'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

        try {
            setLoading(true);
            const response = await deleteStockMouvement(docId);

            if (response?.data?.status === 'success') {
                setDocuments(prev => prev.filter(d => d.id !== docId));
                alert('✅ Document supprimé avec succès');

                const stockStateResponse = await getStockState();
                if (stockStateResponse?.data?.status === 'success') {
                    setStockState(transformStockStateFromAPI(stockStateResponse));
                }
            }
        } catch (err) {
            console.error('Erreur suppression document:', err);
            alert(`❌ Erreur: ${err.response?.data?.message || 'Erreur lors de la suppression'}`);
        } finally {
            setLoading(false);
        }
    };


    const handleApplyFiltres = async (filtres) => {
        try {
            setLoading(true);

            const mouvementsResponse = await getAllStockMouvement();
            if (mouvementsResponse?.data?.status === 'success') {
                let transformedMouvements = (mouvementsResponse.data.data || [])
                    .map(transformMouvementFromAPI);

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
            alert(`❌ Erreur: ${err.response?.data?.message || 'Erreur lors de l\'application des filtres'}`);
        } finally {
            setLoading(false);
        }
    };


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
            entreprise: { nom: 'Votre Entreprise', depot: dataSource.depotOrigine },
            periode: {
                du: options.dateDe || dataSource.date,
                au: options.dateA || dataSource.date
            },
            lignes: dataSource.lignes || []
        });

        setShowImpressionModal(false);
        setShowApercuModal(true);
    };


    if (loading && documents.length === 0 && depots.length === 0) {
        return (
            <div className="stock-container" style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', height: '100vh'
            }}>
                <div>Chargement des données...</div>
            </div>
        );
    }

    if (error && documents.length === 0) {
        return (
            <div className="stock-container" style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '100vh', flexDirection: 'column', gap: '20px'
            }}>
                <div style={{ color: 'red' }}>Erreur: {error}</div>
                <button className="btn-custom btn-primary-custom" onClick={loadInitialData}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="stock-container">

                    {loading && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            zIndex: 9999
                        }}>
                            <div style={{
                                backgroundColor: 'white', padding: '20px 40px',
                                borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                Chargement...
                            </div>
                        </div>
                    )}

                    <div className="mouvement-toolbar" style={{
                        marginBottom: '15px',
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '10px',
                        flexWrap: 'wrap',
                        gap: '6px'
                    }}>

                        <button
                            className="mouvement-toolbar-btn"
                            onClick={() => navigate('/depots')}
                            style={{ backgroundColor: '#007bff', color: 'white' }}
                        >
                            🏢 Gérer les Dépôts
                        </button>

                        <button
                            className="mouvement-toolbar-btn"
                            onClick={() => setVueActive(VUES.MOUVEMENTS)}
                            style={{
                                backgroundColor: vueActive === VUES.MOUVEMENTS ? '#0052a3' : '#e8e8e8',
                                color: vueActive === VUES.MOUVEMENTS ? 'white' : '#333',
                                fontWeight: vueActive === VUES.MOUVEMENTS ? '600' : 'normal',
                                borderBottom: vueActive === VUES.MOUVEMENTS ? '2px solid #0066cc' : '1px solid #999'
                            }}
                        >
                            📋 Mouvements de stock
                        </button>

                        <button
                            className="mouvement-toolbar-btn"
                            onClick={() => setVueActive(VUES.STOCK_DEPOT)}
                            style={{
                                backgroundColor: vueActive === VUES.STOCK_DEPOT ? '#0052a3' : '#e8e8e8',
                                color: vueActive === VUES.STOCK_DEPOT ? 'white' : '#333',
                                fontWeight: vueActive === VUES.STOCK_DEPOT ? '600' : 'normal',
                                borderBottom: vueActive === VUES.STOCK_DEPOT ? '2px solid #0066cc' : '1px solid #999'
                            }}
                        >
                            📦 Stock par dépôt
                        </button>

                        <button className="mouvement-toolbar-btn">
                            📊 État du Stock
                        </button>
                        <button className="mouvement-toolbar-btn">
                            📈 Statistiques
                        </button>

                        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#666' }}>
                            {depots.length} dépôt(s) • {documents.length} mouvement(s)
                        </div>
                    </div>


                    {vueActive === VUES.MOUVEMENTS && (
                        <DocumentsStockListe
                            documents={documents}
                            onSelectDocument={handleSelectDocument}
                            onNewDocument={handleNewDocument}
                            onOpenFiltres={() => setShowFiltresModal(true)}
                            onDeleteDocument={handleDeleteDocument}
                        />
                    )}

                    {vueActive === VUES.STOCK_DEPOT && (
                        <ArticleStockDepotListView />
                    )}

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
            </div>
        </div>
    );
};

export default GestionStock;
