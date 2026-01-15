
import React, { useState } from 'react';
import { clientAnalysis, documents, purchaseDocuments } from './data';

import SalesView from './Tous/SalesView';
import PurchasesView from './PurchasesView';
import InventoryView from './Facture_comptabilisée/InventoryView';
import AnalysisView from './AnalysisView';
import TransformModal from './Tous/TransformModal';
import DocumentModal from './Tous/DocumentModal';
import './erp.css';
import InvoiceForm from './Facture_comptabilisée/InvoiceForm';
import BonCommande from './Bon_de_commande/BonCommande';
import Header from '../Layout/Header';
import Sidebar from '../Layout/SidebarLayout';
import Toolbar from '../Layout/Toolbar';

const ERPSystem = () => {
    const [currentView, setCurrentView] = useState('sales');
    const [showTransformModal, setShowTransformModal] = useState(false);
    const [showDocument, setShowDocument] = useState(null);
    const [transformType, setTransformType] = useState('preparation');
    const [refreshKey, setRefreshKey] = useState(0);

    const sidebarItems = [
        { id: 'cours', label: 'Documents en cours', icon: '📄' },
        { id: 'devis', label: 'Devis', icon: '📝' },
        { id: 'commande', label: 'Bon de commande', icon: '📋' },
        { id: 'livraison', label: 'Préparation de livraison', icon: '📦' },
        { id: 'retour', label: 'Bon de retour', icon: '↩️' },
        { id: 'financier', label: 'Bon d\'avoir financier', icon: '💰' },
        { id: 'facture', label: 'Facture', icon: '🧾' },
        { id: 'comptabiliée', label: 'Facture comptabilisée', icon: '✓' },
        { id: 'tous', label: 'Tous les documents', icon: '📚' },
        { id: 'sales', label: 'Documents de vente', icon: '💼' },
        { id: 'purchases', label: 'Documents des achats', icon: '🛒' },
        { id: 'stock', label: 'Mouvements de stock', icon: '📊' },
        { id: 'analysis', label: 'Analyse clients', icon: '📈' },
        { id: 'stats', label: 'Statistiques clients', icon: '📉' }
    ];

    const toolbarCustomButtons = [
        {
            icon: '➕',
            label: 'Nouveau',
            onClick: () => {
                console.log('Nouveau document');
            }
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
            onClick: () => window.print()
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
        },
        {
            icon: '↻',
            label: 'Actualiser',
            onClick: () => setRefreshKey(prev => prev + 1)
        }
    ];

    const handleViewChange = (viewId) => {
        setCurrentView(viewId);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <Header
                title="Système de Gestion ERP"
                showWindowControls={true}
                onClose={() => console.log('Fermer')}
                onMinimize={() => console.log('Minimiser')}
                onMaximize={() => console.log('Maximiser')}
            />

            <Toolbar
                customButtons={[...toolbarCustomButtons, ...toolbarCustomButtons2]}
            />

            <div className="main-content">
                <Sidebar
                    items={sidebarItems}
                    activeItem={currentView}
                    onItemClick={handleViewChange}
                />

                <div className="content-area">
                    {currentView === 'sales' && (
                        <SalesView
                            key={`sales-${refreshKey}`}
                            documents={documents}
                            onDocumentClick={setShowDocument}
                        />
                    )}

                    {currentView === 'facture' && (
                        <InvoiceForm
                            key={`invoice-${refreshKey}`}
                            documents={documents}
                            onDocumentClick={setShowDocument}
                        />
                    )}

                    {currentView === 'commande' && (
                        <BonCommande
                            key={`commande-${refreshKey}`}
                            documents={documents}
                            onDocumentClick={setShowDocument}
                        />
                    )}

                    {currentView === 'purchases' && (
                        <PurchasesView
                            key={`purchases-${refreshKey}`}
                            documents={purchaseDocuments}
                        />
                    )}

                    {currentView === 'stock' && (
                        <InventoryView
                            key={`inventory-${refreshKey}`}
                        />
                    )}

                    {currentView === 'analysis' && (
                        <AnalysisView
                            key={`analysis-${refreshKey}`}
                            data={clientAnalysis}
                        />
                    )}

                    {currentView === 'stats' && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h3>📊 Statistiques clients</h3>
                            <p>Fonctionnalité à venir...</p>
                            <div style={{ marginTop: '20px' }}>
                                <button className="btn-primary">
                                    Générer un rapport
                                </button>
                            </div>
                        </div>
                    )}

                    {!['sales', 'facture', 'commande', 'purchases', 'stock', 'analysis', 'stats'].includes(currentView) && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h3>🚧 {sidebarItems.find(item => item.id === currentView)?.label}</h3>
                            <p style={{ color: '#666', marginTop: '12px' }}>
                                Cette fonctionnalité est en cours de développement
                            </p>
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

            <DocumentModal
                document={showDocument}
                onClose={() => setShowDocument(null)}
            />
        </div>
    );
};

export default ERPSystem;