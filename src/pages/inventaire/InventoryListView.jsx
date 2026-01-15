import React, { useState, useEffect } from 'react';
import './InventoryListView.css';
import InventoryEntryModal from './InventoryEntryModal';
import SidebarLayout from '../Layout/SidebarLayout';
import Toolbar from '../Layout/Toolbar';
import Header from '../Layout/Header';
import Navbar from '../../composants/navbar';
import Sidebar from '../../composants/sidebar';
import { getAllArticles } from '../../services/articleService';
import { getStockState } from '../../services/stockManagementService';
import { getAllArticleStockDepot } from '../../services/articleStockDepotService';

const InventoryListView = () => {
    const [activeTab, setActiveTab] = useState('tous');
    const [showModal, setShowModal] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [adjustedValues, setAdjustedValues] = useState({});

    const sidebarItems = [
        { id: 'tous', label: 'Tous' },
        { id: 'articles_stock', label: 'Articles en stock' },
        { id: 'articles_non_presents', label: 'Articles non présents' }
    ];

    const toolbarButtons = ['fonctions', 'imprimer', 'importer', 'exporter', 'enregistrer'];

    useEffect(() => {
        loadInventoryData();
    }, []);

    useEffect(() => {
        filterData();
    }, [activeTab, inventoryData, searchTerm]);

    const loadInventoryData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Charger tous les articles
            const articlesResponse = await getAllArticles();
            
            // Charger l'état du stock
            let stockData = [];
            try {
                const stockResponse = await getAllArticleStockDepot();
                if (stockResponse.data.status === 'success') {
                    stockData = stockResponse.data.data || [];
                }
            } catch (stockErr) {
                console.warn('Erreur lors du chargement du stock:', stockErr);
            }

            if (articlesResponse.data.status === 'success') {
                const articles = articlesResponse.data.data;
                
                // Fusionner les données d'articles avec les données de stock
                const mergedData = articles.map(article => {
                    // Trouver le stock correspondant à cet article
                    const stockInfo = stockData.find(s => s.article_id === article.article_id);
                    
                    return {
                        article_id: article.article_id,
                        ref: article.article_reference,
                        designation: article.article_name,
                        description: article.article_description,
                        quantity: stockInfo?.quantity || 0,
                        priceUnit: article.article_prix_vente || 0,
                        value: (stockInfo?.quantity || 0) * (article.article_prix_vente || 0),
                        condition: article.unite_stock?.unite_code || 'PIECE',
                        unite_libelle: article.unite_stock?.unite_libelle || 'Pièce',
                        famille: article.famille?.famille_name || '-',
                        fournisseur: article.fournisseur?.fournisseur_name || '-',
                        is_serialized: article.article_is_serialized,
                        depot_id: stockInfo?.depot_id || null
                    };
                });

                setInventoryData(mergedData);
                setFilteredData(mergedData);
            } else {
                setError('Erreur lors du chargement des données');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let filtered = [...inventoryData];

        // Filtrer par recherche
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ref.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrer par onglet
        switch (activeTab) {
            case 'articles_stock':
                filtered = filtered.filter(item => item.quantity > 0);
                break;
            case 'articles_non_presents':
                filtered = filtered.filter(item => item.quantity === 0);
                break;
            default:
                // tous
                break;
        }

        setFilteredData(filtered);
    };

    const handleNewInventory = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleValidateModal = (formData) => {
        console.log('Données du formulaire:', formData);
        // Recharger les données après validation
        loadInventoryData();
        setShowModal(false);
    };

    const handleAdjustedValueChange = (articleId, field, value) => {
        setAdjustedValues(prev => ({
            ...prev,
            [articleId]: {
                ...prev[articleId],
                [field]: value
            }
        }));
    };

    const handleSaveAdjustments = async () => {
        try {
            setLoading(true);
            
            // Ici vous pouvez envoyer les ajustements à l'API
            // Pour chaque article ajusté, créer un mouvement de stock
            const adjustmentsToSave = Object.entries(adjustedValues).filter(
                ([_, values]) => values.quantity || values.price
            );

            if (adjustmentsToSave.length === 0) {
                setError('Aucun ajustement à enregistrer');
                return;
            }

            // TODO: Appeler l'API pour enregistrer les ajustements
            console.log('Ajustements à enregistrer:', adjustedValues);
            
            // Recharger les données
            await loadInventoryData();
            setAdjustedValues({});
            
        } catch (err) {
            setError('Erreur lors de la sauvegarde des ajustements');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            setError('Veuillez sélectionner au moins un article');
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} article(s) ?`)) {
            // TODO: Implémenter la suppression
            console.log('Articles à supprimer:', selectedItems);
            setSelectedItems([]);
        }
    };

    const toggleSelectItem = (articleId) => {
        setSelectedItems(prev => {
            if (prev.includes(articleId)) {
                return prev.filter(id => id !== articleId);
            } else {
                return [...prev, articleId];
            }
        });
    };

    const calculateTotals = () => {
        return filteredData.reduce((acc, item) => {
            const adjustedQty = adjustedValues[item.article_id]?.quantity || 0;
            const adjustedPrice = adjustedValues[item.article_id]?.price || 0;
            
            return {
                totalValue: acc.totalValue + item.value,
                totalAdjustedValue: acc.totalAdjustedValue + (adjustedQty * adjustedPrice)
            };
        }, { totalValue: 0, totalAdjustedValue: 0 });
    };

    const totals = calculateTotals();

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar/>
            </div>

            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="inventory-container">
                    <Header
                        title={`Saisie inventaire - ${new Date().toLocaleDateString('fr-FR')}`}
                        showWindowControls={true}
                    />

                    <Toolbar buttons={toolbarButtons} />

                    {error && (
                        <div style={{
                            padding: '10px',
                            margin: '10px',
                            backgroundColor: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '4px',
                            color: '#c00',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <span>{error}</span>
                            <button onClick={() => setError(null)} style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: '#c00',
                                fontSize: '16px'
                            }}>✕</button>
                        </div>
                    )}

                    <div className="inventory-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'tous' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tous')}
                        >
                            Tous
                        </button>
                        <input 
                            type="text" 
                            className="tab-input"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="tab-labels">
                            <span>Désignation</span>
                        </div>
                    </div>

                    <div className="inventory-content">
                        <SidebarLayout
                            items={sidebarItems}
                            activeItem={activeTab}
                            onItemClick={setActiveTab}
                        />

                        <div className="inventory-table-container">
                            {loading ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    Chargement de l'inventaire...
                                </div>
                            ) : (
                                <>
                                    <table className="inventory-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30px' }}>
                                                    <input 
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedItems(filteredData.map(item => item.article_id));
                                                            } else {
                                                                setSelectedItems([]);
                                                            }
                                                        }}
                                                    />
                                                </th>
                                                <th>Référence</th>
                                                <th>Désignation</th>
                                                <th className="text-right">Quantité</th>
                                                <th className="text-right">PR unitaire</th>
                                                <th className="text-right">Valeur</th>
                                                <th>Unité</th>
                                                <th>Qté ajustée</th>
                                                <th>PR ajusté</th>
                                                <th>Valeur ajustée</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.length === 0 ? (
                                                <tr>
                                                    <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                                                        Aucun article trouvé
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredData.map((item) => {
                                                    const adjusted = adjustedValues[item.article_id] || {};
                                                    const adjustedQty = parseFloat(adjusted.quantity) || 0;
                                                    const adjustedPrice = parseFloat(adjusted.price) || 0;
                                                    const adjustedValue = adjustedQty * adjustedPrice;

                                                    return (
                                                        <tr 
                                                            key={item.article_id}
                                                            className={selectedItems.includes(item.article_id) ? 'selected' : ''}
                                                        >
                                                            <td>
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={selectedItems.includes(item.article_id)}
                                                                    onChange={() => toggleSelectItem(item.article_id)}
                                                                />
                                                            </td>
                                                            <td>{item.ref}</td>
                                                            <td>{item.designation}</td>
                                                            <td className="text-right">{item.quantity.toFixed(2)}</td>
                                                            <td className="text-right">{item.priceUnit.toLocaleString()}</td>
                                                            <td className="text-right">{item.value.toLocaleString()}</td>
                                                            <td>{item.condition}</td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="adjustment-input"
                                                                    value={adjusted.quantity || ''}
                                                                    onChange={(e) => handleAdjustedValueChange(
                                                                        item.article_id, 
                                                                        'quantity', 
                                                                        e.target.value
                                                                    )}
                                                                    style={{ width: '80px', padding: '4px' }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="adjustment-input"
                                                                    value={adjusted.price || ''}
                                                                    onChange={(e) => handleAdjustedValueChange(
                                                                        item.article_id, 
                                                                        'price', 
                                                                        e.target.value
                                                                    )}
                                                                    style={{ width: '100px', padding: '4px' }}
                                                                />
                                                            </td>
                                                            <td className="text-right">
                                                                {adjustedValue > 0 ? adjustedValue.toLocaleString() : ''}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                <td colSpan="5" style={{ textAlign: 'right' }}>Total:</td>
                                                <td className="text-right">{totals.totalValue.toLocaleString()}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="text-right">
                                                    {totals.totalAdjustedValue > 0 ? totals.totalAdjustedValue.toLocaleString() : ''}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    <div className="table-actions">
                                        <button
                                            className="action-btn primary"
                                            onClick={handleNewInventory}
                                        >
                                            Nouveau
                                        </button>
                                        <button 
                                            className="action-btn"
                                            onClick={handleDeleteSelected}
                                            disabled={selectedItems.length === 0}
                                        >
                                            Supprimer
                                        </button>
                                        <button 
                                            className="action-btn primary"
                                            onClick={handleSaveAdjustments}
                                            disabled={Object.keys(adjustedValues).length === 0}
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="inventory-status-bar">
                        <div className="status-left">
                            <span>Articles: {filteredData.length} / {inventoryData.length}</span>
                        </div>
                        <div className="status-right">
                            <button className="btn-close" onClick={() => window.history.back()}>
                                Fermer
                            </button>
                        </div>
                    </div>

                    <div className="page-indicator">
                        {filteredData.length}/{inventoryData.length}
                    </div>
                </div>

                <InventoryEntryModal
                    show={showModal}
                    onClose={handleCloseModal}
                    onValidate={handleValidateModal}
                />
            </div>
        </div>
    );
};

export default InventoryListView;