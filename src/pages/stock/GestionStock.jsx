import React, { useState } from 'react'
import DocumentsStockListe from './DocumentsStockListe';
import MouvementEntreeModal from './MouvementEntreeModal';
import FiltresMouvementModal from './FiltresMouvementModal';
import ImpressionModal from './ImpressionModal';
import ApercuImpressionModal from './ApercuImpressionModal';
import "./stock.css";

const GestionStock = () => {
    const [documents, setDocuments] = useState([
        {
            type: 'Mouvement d\'entrée',
            numeroPiece: 'SI001',
            reference: 'SI001',
            date: '010722',
            depotOrigine: 'SIEGE',
            depotDestination: '',
            lignes: [
                { reference: 'IMPR0001', designation: 'HP MULTIFONCTION LASERJET M443nda', puHT: '603480', quantite: '13', conditionnement: 'PIECE', montantHT: '7845240' },
                { reference: 'IMPR0002', designation: 'HP LASERJET PRO M404dn', puHT: '221058', quantite: '1', conditionnement: 'PIECE', montantHT: '221058' },
                { reference: 'IMPR0003', designation: 'HP DESIGNJET STUDIO METAL 36 POUCES', puHT: '1566425', quantite: '1', conditionnement: 'PIECE', montantHT: '1566425' },
                { reference: 'IMPR0004', designation: 'CANON PIXMA G7050', puHT: '281406', quantite: '1', conditionnement: 'PIECE', montantHT: '281406' },
                { reference: 'IMPR0005', designation: 'CANON MAXIFY GX7050', puHT: '421780', quantite: '2', conditionnement: 'PIECE', montantHT: '843560' },
                { reference: 'IMPR0006', designation: 'EPSON ET 85000', puHT: '459170', quantite: '4', conditionnement: 'PIECE', montantHT: '1836680' },
                { reference: 'IMPR0007', designation: 'EPSON SC T3100M', puHT: '1378822', quantite: '9', conditionnement: 'PIECE', montantHT: '12409398' }
            ]
        }
    ]);

    // États pour les modales
    const [showMouvementModal, setShowMouvementModal] = useState(false);
    const [showFiltresModal, setShowFiltresModal] = useState(false);
    const [showImpressionModal, setShowImpressionModal] = useState(false);
    const [showApercuModal, setShowApercuModal] = useState(false);

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [dataForPreview, setDataForPreview] = useState(null);

    // Gestionnaires pour les documents
    const handleNewDocument = () => {
        setSelectedDocument(null);
        setShowMouvementModal(true);
    };

    const handleSelectDocument = (doc) => {
        setSelectedDocument(doc);
        setShowMouvementModal(true);
    };

    const handleSaveDocument = (documentData) => {
        if (selectedDocument) {
            // Modification d'un document existant
            setDocuments(prev => prev.map(d =>
                d.numeroPiece === selectedDocument.numeroPiece ? documentData : d
            ));
        } else {
            // Création d'un nouveau document
            const newDoc = {
                type: 'Mouvement d\'entrée',
                numeroPiece: documentData.numeroDocument || `DOC${documents.length + 1}`,
                reference: documentData.reference || `REF${documents.length + 1}`,
                date: documentData.date,
                depotOrigine: documentData.depot,
                depotDestination: '',
                lignes: documentData.lignes || []
            };
            setDocuments(prev => [...prev, newDoc]);
        }
    };

    // Gestionnaires pour les filtres
    const handleApplyFiltres = (filtres) => {
        console.log('Filtres appliqués:', filtres);
        // Ici vous pouvez filtrer les documents selon les critères
    };

    // Gestionnaires pour l'impression
    const handlePrint = (options) => {
        console.log('Impression avec options:', options);
        // Logique d'impression réelle
    };

    const handlePreview = (options) => {
        setDataForPreview({
            lignes: selectedDocument?.lignes || documents[0]?.lignes || []
        });
        setShowImpressionModal(false);
        setShowApercuModal(true);
    };
    return (
        <div className="stock-container">
            <DocumentsStockListe
                documents={documents}
                onSelectDocument={handleSelectDocument}
                onNewDocument={handleNewDocument}
                onOpenFiltres={() => setShowFiltresModal(true)}
            />

            <MouvementEntreeModal
                show={showMouvementModal}
                onHide={() => setShowMouvementModal(false)}
                mouvement={selectedDocument}
                onSave={handleSaveDocument}
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
    )
}

export default GestionStock
