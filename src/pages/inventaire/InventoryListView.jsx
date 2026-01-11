import React, { useState } from 'react';
import './InventoryListView.css';
import InventoryEntryModal from './InventoryEntryModal';

const InventoryListView = () => {
    const [activeTab, setActiveTab] = useState('tous');
    const [showModal, setShowModal] = useState(false);

    const inventoryData = [
        { ref: 'IMPR0001', designation: 'HP MULTIFONCTION LASERJ...', quantity: 10.00, priceUnit: 589675, value: 5896750, condition: 'PIECE' },
        { ref: 'IMPR0002', designation: 'HP LASERJET PRO M404dn', quantity: 5.00, priceUnit: 221058, value: 1105290, condition: 'PIECE' },
        { ref: 'IMPR0003', designation: 'HP DESIGNJET STUDIO MFT...', quantity: 6.00, priceUnit: 1566425, value: 9398550, condition: 'PIECE' },
        { ref: 'IMPR0004', designation: 'CANON PIXMA G7050', quantity: 8.00, priceUnit: 281406, value: 2251248, condition: 'PIECE' },
        { ref: 'IMPR0005', designation: 'CANON MAXIFY GX7050', quantity: 2.00, priceUnit: 421780, value: 843560, condition: 'PIECE' },
        { ref: 'IMPR0006', designation: 'EPSON ET 85000', quantity: 4.00, priceUnit: 459170, value: 1836680, condition: 'PIECE' },
        { ref: 'IMPR0007', designation: 'EPSON SC T3100M', quantity: 7.00, priceUnit: 1578822, value: 9691754, condition: 'PIECE' },
        { ref: 'ORDB0001', designation: 'HP 260 G4 I7', quantity: 1.00, priceUnit: 345033, value: 345033, condition: 'PIECE' },
        { ref: 'ORDB0002', designation: 'HP PRODESK 400 G7', quantity: 5.00, priceUnit: 599401, value: 2997007, condition: 'PIECE' },
        { ref: 'ORDB0003', designation: 'HP ELITEDESK 805 G6', quantity: 2.00, priceUnit: 534605, value: 1069210, condition: 'PIECE' },
        { ref: 'ORDB0004', designation: 'HP Z2 G5', quantity: 3.00, priceUnit: 1252878, value: 3758634, condition: 'PIECE' },
        { ref: 'ORDB0005', designation: 'HP Z4 G4 STATION DE TRAV...', quantity: 4.00, priceUnit: 2767397, value: 11069587, condition: 'PIECE' },
        { ref: 'ORDB0006', designation: 'DELL PRECISION 3650 TOWER', quantity: 2.00, priceUnit: 755662, value: 1511324, condition: 'PIECE' },
        { ref: 'ORDB0007', designation: 'DELL OPTIPLEX 3000 MICRO', quantity: 8.00, priceUnit: 463762, value: 3710096, condition: 'PIECE' }
    ];

    // Fonction pour ouvrir la modale
    const handleNewInventory = () => {
        setShowModal(true);
    };

    // Fonction pour fermer la modale
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Fonction appelée quand on valide la modale
    const handleValidateModal = (formData) => {
        console.log('Données du formulaire:', formData);
        // Ici vous pouvez traiter les données du formulaire
        // Par exemple: ajouter un nouvel article, rafraîchir la liste, etc.
        setShowModal(false);
    };

    return (
        <>
            <div className="inventory-container">
                {/* Header */}
                <div className="inventory-header">
                    <div className="header-title">
                        <span className="header-icon">⚙</span>
                        <span>Saisie inventaire au 07/07/22 : SIEGE</span>
                    </div>
                    <div className="window-controls">
                        <button className="window-btn">−</button>
                        <button className="window-btn">□</button>
                        <button className="window-btn close">×</button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="inventory-toolbar">
                    <button className="toolbar-btn">⚙ Fonctions</button>
                    <button className="toolbar-btn">🖨 Imprimer</button>
                    <button className="toolbar-btn">📥 Importer</button>
                    <button className="toolbar-btn">📤 Exporter</button>
                    <button className="toolbar-btn">💾 Enregistrer</button>
                </div>

                {/* Tabs */}
                <div className="inventory-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'tous' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tous')}
                    >
                        Tous
                    </button>
                    <input type="text" className="tab-input" />
                    <div className="tab-labels">
                        <span>Désignation</span>
                    </div>
                </div>

                {/* Left Sidebar */}
                <div className="inventory-content">
                    <div className="inventory-sidebar">
                        <div
                            className={`sidebar-item ${activeTab === 'tous' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tous')}
                        >
                            Tous
                        </div>
                        <div
                            className={`sidebar-item ${activeTab === 'articles_stock' ? 'active' : ''}`}
                            onClick={() => setActiveTab('articles_stock')}
                        >
                            Articles en stock
                        </div>
                        <div
                            className={`sidebar-item ${activeTab === 'articles_non_presents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('articles_non_presents')}
                        >
                            Articles non présents
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="inventory-table-container">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Référence a...</th>
                                    <th>Désignation</th>
                                    <th className="text-right">Quantité</th>
                                    <th className="text-right">PR unitaire</th>
                                    <th className="text-right">Valeur</th>
                                    <th>Conditionn...</th>
                                    <th>Qté ajustée</th>
                                    <th>PR ajusté</th>
                                    <th>Valeur ajustée</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.ref}</td>
                                        <td>{item.designation}</td>
                                        <td className="text-right">{item.quantity.toFixed(2)}</td>
                                        <td className="text-right">{item.priceUnit.toLocaleString()}</td>
                                        <td className="text-right">{item.value.toLocaleString()}</td>
                                        <td>{item.condition}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Action Buttons */}
                        <div className="table-actions">
                            <button
                                className="action-btn primary"
                                onClick={handleNewInventory}
                            >
                                Nouveau
                            </button>
                            <button className="action-btn">Supprimer</button>
                            <button className="action-btn primary">Enregistrer</button>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="inventory-status-bar">
                    <div className="status-left">
                        <button className="status-toggle">◀</button>
                        <button className="status-toggle">▼</button>
                        <button className="status-toggle">◀</button>
                    </div>
                    <div className="status-right">
                        <button className="btn-close">Fermer</button>
                    </div>
                </div>

                {/* Page Indicator */}
                <div className="page-indicator">
                    14/96
                </div>
            </div>

            {/* Modal - S'affiche par-dessus quand showModal est true */}
            <InventoryEntryModal
                show={showModal}
                onClose={handleCloseModal}
                onValidate={handleValidateModal}
            />
        </>
    );
};

export default InventoryListView;