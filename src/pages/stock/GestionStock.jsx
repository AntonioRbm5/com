// import React, { useState } from 'react'
// import DocumentsStockListe from './DocumentsStockListe';
// import MouvementEntreeModal from './MouvementEntreeModal';
// import FiltresMouvementModal from './FiltresMouvementModal';
// import ImpressionModal from './ImpressionModal';
// import ApercuImpressionModal from './ApercuImpressionModal';
// import "./stock.css";

// const GestionStock = () => {
//     const [documents, setDocuments] = useState([
//         {
//             type: 'Mouvement d\'entrée',
//             numeroPiece: 'SI001',
//             reference: 'SI001',
//             date: '010722',
//             depotOrigine: 'SIEGE',
//             depotDestination: '',
//             lignes: [
//                 { reference: 'IMPR0001', designation: 'HP MULTIFONCTION LASERJET M443nda', puHT: '603480', quantite: '13', conditionnement: 'PIECE', montantHT: '7845240' },
//                 { reference: 'IMPR0002', designation: 'HP LASERJET PRO M404dn', puHT: '221058', quantite: '1', conditionnement: 'PIECE', montantHT: '221058' },
//                 { reference: 'IMPR0003', designation: 'HP DESIGNJET STUDIO METAL 36 POUCES', puHT: '1566425', quantite: '1', conditionnement: 'PIECE', montantHT: '1566425' },
//                 { reference: 'IMPR0004', designation: 'CANON PIXMA G7050', puHT: '281406', quantite: '1', conditionnement: 'PIECE', montantHT: '281406' },
//                 { reference: 'IMPR0005', designation: 'CANON MAXIFY GX7050', puHT: '421780', quantite: '2', conditionnement: 'PIECE', montantHT: '843560' },
//                 { reference: 'IMPR0006', designation: 'EPSON ET 85000', puHT: '459170', quantite: '4', conditionnement: 'PIECE', montantHT: '1836680' },
//                 { reference: 'IMPR0007', designation: 'EPSON SC T3100M', puHT: '1378822', quantite: '9', conditionnement: 'PIECE', montantHT: '12409398' }
//             ]
//         }
//     ]);

//     // États pour les modales
//     const [showMouvementModal, setShowMouvementModal] = useState(false);
//     const [showFiltresModal, setShowFiltresModal] = useState(false);
//     const [showImpressionModal, setShowImpressionModal] = useState(false);
//     const [showApercuModal, setShowApercuModal] = useState(false);

//     const [selectedDocument, setSelectedDocument] = useState(null);
//     const [dataForPreview, setDataForPreview] = useState(null);

//     // Gestionnaires pour les documents
//     const handleNewDocument = () => {
//         setSelectedDocument(null);
//         setShowMouvementModal(true);
//     };

//     const handleSelectDocument = (doc) => {
//         setSelectedDocument(doc);
//         setShowMouvementModal(true);
//     };

//     const handleSaveDocument = (documentData) => {
//         if (selectedDocument) {
//             // Modification d'un document existant
//             setDocuments(prev => prev.map(d =>
//                 d.numeroPiece === selectedDocument.numeroPiece ? documentData : d
//             ));
//         } else {
//             // Création d'un nouveau document
//             const newDoc = {
//                 type: 'Mouvement d\'entrée',
//                 numeroPiece: documentData.numeroDocument || `DOC${documents.length + 1}`,
//                 reference: documentData.reference || `REF${documents.length + 1}`,
//                 date: documentData.date,
//                 depotOrigine: documentData.depot,
//                 depotDestination: '',
//                 lignes: documentData.lignes || []
//             };
//             setDocuments(prev => [...prev, newDoc]);
//         }
//     };

//     // Gestionnaires pour les filtres
//     const handleApplyFiltres = (filtres) => {
//         console.log('Filtres appliqués:', filtres);
//         // Ici vous pouvez filtrer les documents selon les critères
//     };

//     // Gestionnaires pour l'impression
//     const handlePrint = (options) => {
//         console.log('Impression avec options:', options);
//         // Logique d'impression réelle
//     };

//     const handlePreview = (options) => {
//         setDataForPreview({
//             lignes: selectedDocument?.lignes || documents[0]?.lignes || []
//         });
//         setShowImpressionModal(false);
//         setShowApercuModal(true);
//     };
//     return (
//         <div className="stock-container">
//             <DocumentsStockListe
//                 documents={documents}
//                 onSelectDocument={handleSelectDocument}
//                 onNewDocument={handleNewDocument}
//                 onOpenFiltres={() => setShowFiltresModal(true)}
//             />

//             <MouvementEntreeModal
//                 show={showMouvementModal}
//                 onHide={() => setShowMouvementModal(false)}
//                 mouvement={selectedDocument}
//                 onSave={handleSaveDocument}
//             />

//             <FiltresMouvementModal
//                 show={showFiltresModal}
//                 onHide={() => setShowFiltresModal(false)}
//                 onApply={handleApplyFiltres}
//             />

//             <ImpressionModal
//                 show={showImpressionModal}
//                 onHide={() => setShowImpressionModal(false)}
//                 onPrint={handlePrint}
//                 onPreview={handlePreview}
//             />

//             <ApercuImpressionModal
//                 show={showApercuModal}
//                 onHide={() => setShowApercuModal(false)}
//                 data={dataForPreview}
//             />
//         </div>
//     )
// }

// export default GestionStock
import React, { useState, useEffect } from 'react';
import DocumentsStockListe from './DocumentsStockListe';
import MouvementEntreeModal from './MouvementEntreeModal';
import FiltresMouvementModal from './FiltresMouvementModal';
import ImpressionModal from './ImpressionModal';
import ApercuImpressionModal from './ApercuImpressionModal';
import {
    getAllMouvements,
    getAllDepots,
    createMouvement,
    updateMouvement,
    deleteMouvement,
    transformDepotResponse,
    transformMouvementForAPI,
    transformMouvementFromAPI
} from '../../services/stock';
import "./stock.css";

const GestionStock = () => {
    // États pour les données
    const [documents, setDocuments] = useState([]);
    const [depots, setDepots] = useState([]);
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
            const depotsResponse = await getAllDepots();
            const transformedDepots = transformDepotResponse(depotsResponse);
            setDepots(transformedDepots);

            // Charger les mouvements
            const mouvementsResponse = await getAllMouvements();
            if (mouvementsResponse?.data?.data) {
                const transformedMouvements = mouvementsResponse.data.data.map(transformMouvementFromAPI);
                setDocuments(transformedMouvements);
            }
        } catch (err) {
            console.error('Erreur chargement initial:', err);
            setError(err.message || 'Erreur lors du chargement des données');
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
            const apiData = transformMouvementForAPI(documentData);

            let response;
            if (selectedDocument && selectedDocument.id) {
                // Modification
                response = await updateMouvement(selectedDocument.id, apiData);
            } else {
                // Création
                response = await createMouvement(apiData);
            }

            if (response?.data?.data) {
                const savedMouvement = transformMouvementFromAPI(response.data.data);

                if (selectedDocument && selectedDocument.id) {
                    // Mettre à jour dans la liste
                    setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? savedMouvement : d));
                } else {
                    // Ajouter à la liste
                    setDocuments(prev => [...prev, savedMouvement]);
                }

                setShowMouvementModal(false);
                alert('Document sauvegardé avec succès');
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (err) {
            console.error('Erreur sauvegarde document:', err);
            alert(`Erreur: ${err.message || 'Erreur lors de la sauvegarde'}`);
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
            await deleteMouvement(docId);
            setDocuments(prev => prev.filter(d => d.id !== docId));
            alert('Document supprimé avec succès');
        } catch (err) {
            console.error('Erreur suppression document:', err);
            alert(`Erreur: ${err.message || 'Erreur lors de la suppression'}`);
        } finally {
            setLoading(false);
        }
    };

    // Gestionnaires pour les filtres
    const handleApplyFiltres = async (filtres) => {
        try {
            setLoading(true);
            console.log('Filtres appliqués:', filtres);

            // Construire les paramètres de filtrage pour l'API
            const params = {};
            if (filtres.dateDe) params.date_debut = filtres.dateDe;
            if (filtres.dateA) params.date_fin = filtres.dateA;
            if (filtres.depot && filtres.depot !== 'Tous') params.depot = filtres.depot;
            if (filtres.articleDe) params.article_debut = filtres.articleDe;
            if (filtres.articleA) params.article_fin = filtres.articleA;

            // Recharger les mouvements avec les filtres
            const response = await getAllMouvements(params);
            if (response?.data?.data) {
                const transformedMouvements = response.data.data.map(transformMouvementFromAPI);
                setDocuments(transformedMouvements);
            }
        } catch (err) {
            console.error('Erreur application filtres:', err);
            alert(`Erreur: ${err.message || 'Erreur lors de l\'application des filtres'}`);
        } finally {
            setLoading(false);
        }
    };

    // Gestionnaires pour l'impression
    const handlePrint = (options) => {
        console.log('Impression avec options:', options);
        // TODO: Implémenter la logique d'impression réelle
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
            articles: [{
                categorie: 'Articles',
                mouvements: dataSource.lignes.map(ligne => ({
                    date: dataSource.date,
                    type: dataSource.type.substring(0, 2).toUpperCase(),
                    piece: dataSource.numeroPiece,
                    designation: ligne.designation,
                    qte: ligne.quantite,
                    pu: ligne.puHT,
                    total: ligne.montantHT
                }))
            }],
            totalGeneral: dataSource.lignes.reduce((sum, l) => sum + parseFloat(l.montantHT || 0), 0)
        });

        setShowImpressionModal(false);
        setShowApercuModal(true);
    };

    // Afficher un loader pendant le chargement
    if (loading && documents.length === 0) {
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