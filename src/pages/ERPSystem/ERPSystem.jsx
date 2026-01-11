import React, { useState } from 'react'
import { clientAnalysis, documents, inventory, purchaseDocuments } from './data';
import HeaderErp from './Layout/HeaderErp';
import ToolbarERP from './Layout/ToolbarERP';
import SidebarERP from './Layout/SidebarERP';
import SalesView from './Tous/SalesView';
import PurchasesView from './PurchasesView';
import InventoryView from './Facture_comptabilisée/InventoryView';
import AnalysisView from './AnalysisView';
import TransformModal from './Tous/TransformModal';
import DocumentModal from './Tous/DocumentModal';
import './erp.css';
import InvoiceForm from './Facture_comptabilisée/InvoiceForm';
import BonCommande from './Bon_de_commande/BonCommande';
const ERPSystem = () => {
    const [currentView, setCurrentView] = useState('sales');
    const [showTransformModal, setShowTransformModal] = useState(false);
    const [showDocument, setShowDocument] = useState(null);
    const [transformType, setTransformType] = useState('preparation');
    return (
        <div className="app-container">
            <HeaderErp />
            <ToolbarERP onTransform={() => setShowTransformModal(true)} />

            <div className="main-content">
                <SidebarERP currentView={currentView} onViewChange={setCurrentView} />

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

                    {currentView === 'inventory' && <InventoryView inventory={inventory} />}

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