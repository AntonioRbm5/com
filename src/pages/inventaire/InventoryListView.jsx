import React, { useState, useEffect } from 'react';
import './InventoryListView.css';
import InventoryEntryModal from './InventoryEntryModal';
import SidebarLayout from '../Layout/SidebarLayout';
import Toolbar from '../Layout/Toolbar';
import Header from '../Layout/Header';
import Navbar from '../../composants/navbar';
import Sidebar from '../../composants/sidebar';
import { getAllArticles } from '../../services/articleService';
import { getAllArticleStockDepot, updateArticleStockDepot, createArticleStockDepot } from '../../services/articleStockDepotService';

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
    const [modalFilters, setModalFilters] = useState(null);

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
    }, [activeTab, inventoryData, searchTerm, modalFilters]);

    const loadInventoryData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Chargement des données d\'inventaire...');

            // Charger tous les articles
            const articlesResponse = await getAllArticles();

            // Charger les données de stock par dépôt
            let stockData = [];
            try {
                const stockResponse = await getAllArticleStockDepot();
                if (stockResponse.data.status === 'success') {
                    stockData = stockResponse.data.data || [];
                    console.log('📦 Stocks chargés:', stockData.length);
                }
            } catch (stockErr) {
                console.warn('⚠️ Erreur chargement stock (normal si vide):', stockErr.message);
            }

            if (articlesResponse.data.status === 'success') {
                const articles = articlesResponse.data.data || [];
                console.log('📋 Articles chargés:', articles.length);

                // Créer un map pour accès rapide au stock par article_id
                const stockMap = {};
                stockData.forEach(stock => {
                    if (!stockMap[stock.article_id]) {
                        stockMap[stock.article_id] = [];
                    }
                    stockMap[stock.article_id].push(stock);
                });

                // Fusionner les données
                const mergedData = articles.map(article => {
                    const articleStocks = stockMap[article.article_id] || [];

                    // Calculer la quantité totale
                    const totalQuantity = articleStocks.reduce((sum, stock) =>
                        sum + (parseFloat(stock.quantity) || 0), 0
                    );

                    const priceUnit = parseFloat(article.article_prix_vente) || 0;
                    const totalValue = totalQuantity * priceUnit;

                    return {
                        article_id: article.article_id,
                        ref: article.article_reference || '-',
                        designation: article.article_name || '-',
                        description: article.article_description || '',
                        quantity: totalQuantity,
                        priceUnit: priceUnit,
                        value: totalValue,
                        condition: article.unite_stock?.unite_code || 'PIECE',
                        unite_libelle: article.unite_stock?.unite_libelle || 'Pièce',
                        unite_id: article.unite_stock?.unite_id || 1,
                        famille: article.famille?.famille_name || '-',
                        famille_id: article.famille?.famille_id || null,
                        fournisseur: article.fournisseur?.fournisseur_name || '-',
                        fournisseur_id: article.fournisseur?.fournisseur_id || null,
                        is_serialized: article.article_is_serialized || false,
                        stocks_by_depot: articleStocks
                    };
                });

                console.log('✅ Données fusionnées:', mergedData.length);
                setInventoryData(mergedData);
            } else {
                throw new Error('Erreur lors du chargement des articles');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Erreur de connexion au serveur';
            setError(errorMsg);
            console.error('❌ Erreur complète:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let filtered = [...inventoryData];

        // Appliquer les filtres du modal
        if (modalFilters?.criteres) {
            const { criteres } = modalFilters;

            if (criteres.famille_range?.de || criteres.famille_range?.a) {
                filtered = filtered.filter(item => {
                    if (!item.famille_id) return false;
                    const familleId = parseInt(item.famille_id);
                    const deFamille = criteres.famille_range.de ? parseInt(criteres.famille_range.de) : 0;
                    const aFamille = criteres.famille_range.a ? parseInt(criteres.famille_range.a) : Infinity;
                    return familleId >= deFamille && familleId <= aFamille;
                });
            }

            if (criteres.article_range?.de || criteres.article_range?.a) {
                filtered = filtered.filter(item => {
                    const articleId = parseInt(item.article_id);
                    const deArticle = criteres.article_range.de ? parseInt(criteres.article_range.de) : 0;
                    const aArticle = criteres.article_range.a ? parseInt(criteres.article_range.a) : Infinity;
                    return articleId >= deArticle && articleId <= aArticle;
                });
            }

            if (criteres.fournisseur_range?.de || criteres.fournisseur_range?.a) {
                filtered = filtered.filter(item => {
                    if (!item.fournisseur_id) return false;
                    const fournisseurId = parseInt(item.fournisseur_id);
                    const deFournisseur = criteres.fournisseur_range.de ? parseInt(criteres.fournisseur_range.de) : 0;
                    const aFournisseur = criteres.fournisseur_range.a ? parseInt(criteres.fournisseur_range.a) : Infinity;
                    return fournisseurId >= deFournisseur && fournisseurId <= aFournisseur;
                });
            }
        }

        // Filtrer par recherche
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.designation.toLowerCase().includes(search) ||
                item.ref.toLowerCase().includes(search) ||
                item.famille.toLowerCase().includes(search) ||
                item.fournisseur.toLowerCase().includes(search)
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
        console.log('📋 Filtres appliqués:', formData);
        setModalFilters(formData);
        setShowModal(false);
    };

    const handleAdjustedValueChange = (articleId, field, value) => {
        const id = parseInt(articleId);
        const article = inventoryData.find(a => parseInt(a.article_id) === id);
        if (!article) return;

        setAdjustedValues(prev => {
            const current = prev[id] || {
                quantity: '',
                price: ''
            };

            return {
                ...prev,
                [id]: {
                    ...current,
                    [field]: value
                }
            };
        });
    };

    // const handleSaveAdjustments = async () => {
    //     try {
    //         setLoading(true);
    //         setError(null);

    //         // Filtrer les ajustements valides
    //         const adjustmentsToSave = Object.entries(adjustedValues).filter(
    //             ([_, values]) => {
    //                 const qty = values.quantity !== '' ? parseFloat(values.quantity) : null;
    //                 return qty !== null && !isNaN(qty);
    //             }
    //         );

    //         console.log('💾 Ajustements à sauvegarder:', adjustmentsToSave.length);

    //         if (adjustmentsToSave.length === 0) {
    //             setError('Aucun ajustement valide à enregistrer');
    //             setLoading(false);
    //             return;
    //         }

    //         // Déterminer le dépôt à utiliser
    //         const selectedDepotId = modalFilters?.depot ? parseInt(modalFilters.depot) : 1;
    //         console.log('🏢 Dépôt sélectionné:', selectedDepotId);

    //         // Mettre à jour ou créer les stocks
    //         const results = [];
    //         let successCount = 0;
    //         let errorCount = 0;

    //         for (const [articleId, values] of adjustmentsToSave) {
    //             const article = inventoryData.find(a => a.article_id === parseInt(articleId));
    //             if (!article) {
    //                 console.warn(`⚠️ Article ${articleId} non trouvé`);
    //                 errorCount++;
    //                 continue;
    //             }

    //             const newQuantity = parseFloat(values.quantity);
    //             console.log(`📦 Article ${article.ref}: Nouvelle quantité=${newQuantity}`);

    //             // Vérifier si cet article a déjà un stock dans ce dépôt
    //             const existingStock = article.stocks_by_depot.find(
    //                 stock => parseInt(stock.depot_id) === selectedDepotId
    //             );

    //             try {
    //                 let response;

    //                 if (existingStock) {
    //                     // MISE À JOUR du stock existant
    //                     const updateData = {
    //                         quantity: newQuantity
    //                     };

    //                     console.log(`🔄 Mise à jour stock ID ${existingStock.id}:`, updateData);
    //                     response = await updateArticleStockDepot(existingStock.id, updateData);
    //                 } else {
    //                     // CRÉATION d'un nouveau stock
    //                     const createData = {
    //                         article_id: parseInt(articleId),
    //                         depot_id: selectedDepotId,
    //                         quantity: newQuantity
    //                     };

    //                     console.log(`➕ Création nouveau stock:`, createData);
    //                     response = await createArticleStockDepot(createData);
    //                 }

    //                 if (response.data.status === 'success') {
    //                     console.log('✅ Stock sauvegardé:', response.data);
    //                     successCount++;
    //                     results.push({ success: true, article: article.ref });
    //                 } else {
    //                     console.error('❌ Échec sauvegarde:', response.data);
    //                     errorCount++;
    //                     results.push({ success: false, article: article.ref, error: response.data.message });
    //                 }
    //             } catch (error) {
    //                 console.error(`❌ Erreur pour ${article.ref}:`, error);
    //                 if (error.response) {
    //                     console.error('📋 Détails erreur API:', {
    //                         status: error.response.status,
    //                         data: error.response.data
    //                     });
    //                 }
    //                 errorCount++;
    //                 const errorMsg = error.response?.data?.message || error.message;
    //                 results.push({ success: false, article: article.ref, error: errorMsg });
    //             }
    //         }

    //         console.log(`📊 Résultats: ${successCount} succès, ${errorCount} erreurs`);

    //         if (successCount > 0) {
    //             // Recharger les données
    //             await loadInventoryData();
    //             setAdjustedValues({});

    //             const message = errorCount > 0
    //                 ? `✅ ${successCount} ajustement(s) enregistré(s)\n⚠️ ${errorCount} erreur(s)`
    //                 : `✅ ${successCount} ajustement(s) enregistré(s) avec succès`;

    //             alert(message);
    //         } else {
    //             setError('❌ Aucun ajustement n\'a pu être enregistré. Vérifiez la console.');
    //         }

    //     } catch (err) {
    //         const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde';
    //         setError(errorMsg);
    //         console.error('❌ Erreur sauvegarde:', err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Extrait corrigé de la fonction handleSaveAdjustments dans InventoryListView.js

    const handleSaveAdjustments = async () => {
        try {
            setLoading(true);
            setError(null);

            // Filtrer les ajustements valides
            const adjustmentsToSave = Object.entries(adjustedValues).filter(
                ([_, values]) => {
                    const qty = values.quantity !== '' ? parseFloat(values.quantity) : null;
                    return qty !== null && !isNaN(qty);
                }
            );

            console.log('💾 Ajustements à sauvegarder:', adjustmentsToSave.length);

            if (adjustmentsToSave.length === 0) {
                setError('Aucun ajustement valide à enregistrer');
                setLoading(false);
                return;
            }

            // Déterminer le dépôt à utiliser
            const selectedDepotId = modalFilters?.depot ? parseInt(modalFilters.depot) : 1;
            console.log('🏢 Dépôt sélectionné:', selectedDepotId);

            // Mettre à jour ou créer les stocks
            const results = [];
            let successCount = 0;
            let errorCount = 0;

            for (const [articleId, values] of adjustmentsToSave) {
                const article = inventoryData.find(a => a.article_id === parseInt(articleId));
                if (!article) {
                    console.warn(`⚠️ Article ${articleId} non trouvé`);
                    errorCount++;
                    continue;
                }

                const newQuantity = parseFloat(values.quantity);
                console.log(`📦 Article ${article.ref}: Nouvelle quantité=${newQuantity}`);

                // Vérifier si cet article a déjà un stock dans ce dépôt
                const existingStock = article.stocks_by_depot.find(
                    stock => parseInt(stock.depot_id) === selectedDepotId
                );

                try {
                    let response;

                    if (existingStock) {
                        // MISE À JOUR du stock existant
                        const updateData = {
                            stock_quantity: newQuantity  // ⚠️ Utiliser stock_quantity comme l'API l'attend
                        };

                        console.log(`🔄 Mise à jour stock ID ${existingStock.id}:`, updateData);
                        response = await updateArticleStockDepot(existingStock.id, updateData);
                    } else {
                        // CRÉATION d'un nouveau stock
                        const createData = {
                            stock_article_id: parseInt(articleId),  // ⚠️ Utiliser stock_article_id
                            stock_depot_id: selectedDepotId,        // ⚠️ Utiliser stock_depot_id
                            stock_quantity: newQuantity             // ⚠️ Utiliser stock_quantity
                        };

                        console.log(`➕ Création nouveau stock:`, createData);
                        response = await createArticleStockDepot(createData);
                    }

                    if (response.data.status === 'success') {
                        console.log('✅ Stock sauvegardé:', response.data);
                        successCount++;
                        results.push({ success: true, article: article.ref });
                    } else {
                        console.error('❌ Échec sauvegarde:', response.data);
                        errorCount++;
                        results.push({
                            success: false,
                            article: article.ref,
                            error: response.data.message
                        });
                    }
                } catch (error) {
                    console.error(`❌ Erreur pour ${article.ref}:`, error);
                    if (error.response) {
                        console.error('📋 Détails erreur API:', {
                            status: error.response.status,
                            data: error.response.data
                        });
                    }
                    errorCount++;
                    const errorMsg = error.response?.data?.message || error.message;
                    results.push({ success: false, article: article.ref, error: errorMsg });
                }
            }

            console.log(`📊 Résultats: ${successCount} succès, ${errorCount} erreurs`);

            if (successCount > 0) {
                // Recharger les données
                await loadInventoryData();
                setAdjustedValues({});

                const message = errorCount > 0
                    ? `✅ ${successCount} ajustement(s) enregistré(s)\n⚠️ ${errorCount} erreur(s)`
                    : `✅ ${successCount} ajustement(s) enregistré(s) avec succès`;

                alert(message);
            } else {
                setError('❌ Aucun ajustement n\'a pu être enregistré. Vérifiez la console.');
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde';
            setError(errorMsg);
            console.error('❌ Erreur sauvegarde:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            setError('Veuillez sélectionner au moins un article');
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir retirer ${selectedItems.length} article(s) de la sélection ?`)) {
            setSelectedItems([]);
            setError(null);
        }
    };

    const handleResetFilters = () => {
        setModalFilters(null);
        setSearchTerm('');
        setActiveTab('tous');
        setError(null);
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
            const adjusted = adjustedValues[item.article_id];
            const adjustedQty = adjusted?.quantity !== '' ? parseFloat(adjusted?.quantity) : 0;
            const adjustedPrice = adjusted?.price !== '' ? parseFloat(adjusted?.price) : item.priceUnit;

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
                <Sidebar />
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
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{error}</span>
                            <button onClick={() => setError(null)} style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#c00',
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }}>×</button>
                        </div>
                    )}

                    {modalFilters && (
                        <div style={{
                            padding: '10px',
                            margin: '10px',
                            backgroundColor: '#e7f3ff',
                            border: '1px solid #b3d9ff',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>
                                🔍 Filtres actifs:
                                {modalFilters.criteres?.famille_range && ' Famille'}
                                {modalFilters.criteres?.article_range && ' | Article'}
                                {modalFilters.criteres?.fournisseur_range && ' | Fournisseur'}
                                {modalFilters.depot && ` | Dépôt: ${modalFilters.depot}`}
                            </span>
                            <button onClick={handleResetFilters} style={{
                                padding: '4px 12px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Réinitialiser filtres
                            </button>
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
                                    ⏳ Chargement de l'inventaire...
                                </div>
                            ) : (
                                <>
                                    <table className="inventory-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
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
                                                        {searchTerm || modalFilters
                                                            ? '🔍 Aucun article trouvé avec ces critères'
                                                            : '📦 Aucun article disponible'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredData.map((item) => {
                                                    const adjusted = adjustedValues[item.article_id] || { quantity: '', price: '' };

                                                    const displayQty = adjusted.quantity !== '' ? adjusted.quantity : '';
                                                    const displayPrice = adjusted.price !== '' ? adjusted.price : '';

                                                    const calcQty = adjusted.quantity !== '' ? parseFloat(adjusted.quantity) : 0;
                                                    const calcPrice = adjusted.price !== '' ? parseFloat(adjusted.price) : item.priceUnit;
                                                    const adjustedValue = calcQty * calcPrice;

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
                                                            <td className="text-right">{item.priceUnit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                                                            <td className="text-right">{item.value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                                                            <td>{item.condition}</td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="adjustment-input"
                                                                    value={displayQty}
                                                                    onChange={(e) => handleAdjustedValueChange(item.article_id, 'quantity', e.target.value)}
                                                                    placeholder={item.quantity.toFixed(2)}
                                                                    style={{ width: '80px', padding: '4px' }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="adjustment-input"
                                                                    value={displayPrice}
                                                                    onChange={(e) => handleAdjustedValueChange(item.article_id, 'price', e.target.value)}
                                                                    placeholder={item.priceUnit.toFixed(2)}
                                                                    style={{ width: '100px', padding: '4px' }}
                                                                />
                                                            </td>
                                                            <td className="text-right">
                                                                {adjustedValue > 0 ? adjustedValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : ''}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                <td colSpan="5" style={{ textAlign: 'right', padding: '8px' }}>Total:</td>
                                                <td className="text-right">{totals.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="text-right">
                                                    {totals.totalAdjustedValue > 0 ? totals.totalAdjustedValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    <div className="table-actions">
                                        <button className="action-btn primary" onClick={handleNewInventory}>
                                            📋 Nouveau
                                        </button>
                                        <button className="action-btn" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                                            ❌ Retirer sélection
                                        </button>
                                        <button className="action-btn primary" onClick={handleSaveAdjustments} disabled={Object.keys(adjustedValues).length === 0 || loading}>
                                            {loading ? '⏳ Enregistrement...' : '💾 Enregistrer ajustements'}
                                        </button>
                                        <button className="action-btn" onClick={loadInventoryData} disabled={loading}>
                                            🔄 Actualiser
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="inventory-status-bar">
                        <div className="status-left">
                            <span>📦 Articles: {filteredData.length} / {inventoryData.length}</span>
                            {selectedItems.length > 0 && (
                                <span style={{ marginLeft: '15px', color: '#007bff' }}>
                                    ✅ Sélectionnés: {selectedItems.length}
                                </span>
                            )}
                            {Object.keys(adjustedValues).length > 0 && (
                                <span style={{ marginLeft: '15px', color: '#28a745' }}>
                                    ✏️ Ajustements: {Object.keys(adjustedValues).length}
                                </span>
                            )}
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