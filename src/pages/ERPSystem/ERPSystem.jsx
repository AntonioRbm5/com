import React, { useState } from 'react'
import { clientAnalysis, documents, purchaseDocuments } from './data';

import SalesView from './Tous/SalesView';
import PurchasesView from './PurchasesView';
// import InventoryView from './Facture_comptabilisée/InventoryView';
import AnalysisView from './AnalysisView';
import TransformModal from './Tous/TransformModal';
import DocumentModal from './Tous/DocumentModal';
import './erp.css';
import InvoiceForm from './Facture_comptabilisée/InvoiceForm';
import BonCommande from './Bon_de_commande/BonCommande';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import Toolbar from '../Layout/Toolbar';


const ERPSystem = () => {
    const [currentView, setCurrentView] = useState('sales');
    const [showTransformModal, setShowTransformModal] = useState(false);
    const [showDocument, setShowDocument] = useState(null);
    const [transformType, setTransformType] = useState('preparation');
    const sidebarItems = [
        { id: 'cours', label: 'Documents en cours' },
        { id: 'devis', label: 'Devis' },
        { id: 'commande', label: 'Bon de commande' },
        { id: 'livraison', label: 'Préparation de livraison' },
        { id: 'retour', label: 'Bon de retour' },
        { id: 'financier', label: 'Bon d\'avoir financier' },
        { id: 'facture', label: 'Facture' },
        { id: 'comptabiliée', label: 'Facture comptabilisée' },
        { id: 'tous', label: 'Tous les documents' },
        { id: 'sales', label: 'Documents en cours' },
        { id: 'purchases', label: 'Documents des achats' },
        { id: 'stock', label: 'Mouvements de stock' },
        { id: 'analysis', label: 'Analyse clients' },
        { id: 'stats', label: 'Statistiques clients' }
    ];
    const toolbarCustomButtons = [
        {
            icon: '➕',
            label: 'Nouveau',
            onClick: () => console.log('Nouveau document')
        },
        {
            icon: '📄',
            label: 'Document',
            onClick: () => console.log('Ouvrir document')
        },
        {
            icon: '💾',
            label: 'Enregistrer',
            onClick: () => console.log('Enregistrer')
        }
    ];

    const toolbarCustomButtons2 = [
        {
            icon: '🖨',
            label: 'Imprimer',
            onClick: () => console.log('Imprimer')
        },
        {
            icon: '🔍',
            label: 'Rechercher',
            onClick: () => console.log('Rechercher')
        },
        {
            icon: '🔄',
            label: 'Transformer',
            onClick: () => setShowTransformModal(true)
        },
        {
            icon: '✓',
            label: 'Valider',
            onClick: () => console.log('Valider')
        }
    ];
    return (
        <div className="app-container">
            <Header
                title="Mouvement de stock"
                showWindowControls={true}
                onClose={() => console.log('Fermer')}
                onMinimize={() => console.log('Minimiser')}
                onMaximize={() => console.log('Maximiser')}
            />

            {/* Toolbar centralisé */}
            <Toolbar
                customButtons={[...toolbarCustomButtons, ...toolbarCustomButtons2]}
            />

            <div className="main-content">
                <Sidebar
                    items={sidebarItems}
                    activeItem={currentView}
                    onItemClick={setCurrentView}
                />
                <div className="content-area">
                    {currentView === 'sales' && (
                        <SalesView documents={documents} onDocumentClick={setShowDocument} />
                    )}
                    {currentView === 'facture' && (
                        <InvoiceForm documents={documents} onDocumentClick={setShowDocument} />
                    )}
                    {currentView === 'commande' && (
                        <BonCommande documents={documents} onDocumentClick={setShowDocument} />
                    )}

                    {currentView === 'purchases' && (
                        <PurchasesView documents={purchaseDocuments} />
                    )}

                    {/* {currentView === 'inventory' && <InventoryView inventory={inventory} />} */}

                    {currentView === 'analysis' && <AnalysisView data={clientAnalysis} />}

                    {currentView === 'stats' && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h3>Statistiques clients</h3>
                            <p>Fonctionnalité à venir...</p>
                        </div>
                    )}

                    {currentView === 'stock' && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h3>Mouvements de stock</h3>
                            <p>Fonctionnalité à venir...</p>
                        </div>
                    )}
                </div>
            </div>

            <TransformModal
                show={showTransformModal}
                onClose={() => setShowTransformModal(false)}
                transformType={transformType}
                onTransformTypeChange={setTransformType}
            />

            <DocumentModal document={showDocument} onClose={() => setShowDocument(null)} />
        </div>
    )
}

export default ERPSystem