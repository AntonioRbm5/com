import React, { useState, useEffect } from 'react';
import ArticleStockDepotFormModal from './ArticleStockDepotFormModal';

import './stock.css';
import { searchArticleStockDepot } from '../../services/articleStockService';
import { deleteArticleStockDepot } from '../../services/articleStockDepotService';

/**
 * ArticleStockDepotListView
 * Liste les stocks d'articles par dépôt avec CRUD complet
 */
const ArticleStockDepotListView = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filtres
    const [filterArticleId, setFilterArticleId] = useState('');
    const [filterDepotId, setFilterDepotId] = useState('');

    /* ──────────────────────────────────────
       CHARGEMENT
    ────────────────────────────────────── */
    const loadStocks = async (articleId = '', depotId = '') => {
        try {
            setLoading(true);
            const response = await searchArticleStockDepot(
                articleId || undefined,
                depotId || undefined
            );

            if (response?.data?.status === 'success') {
                setStocks(response.data.data || []);
            } else {
                setStocks([]);
            }
        } catch (err) {
            console.error('Erreur chargement stocks:', err);
            alert(`❌ Erreur lors du chargement : ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStocks();
    }, []);

    /* ──────────────────────────────────────
       HANDLERS
    ────────────────────────────────────── */
    const handleNew = () => {
        setSelectedStock(null);
        setShowModal(true);
    };

    const handleEdit = (stock) => {
        setSelectedStock(stock);
        setShowModal(true);
    };

    const handleDelete = async (stockId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de stock ?')) return;

        try {
            setLoading(true);
            const response = await deleteArticleStockDepot(stockId);

            if (response?.data?.status === 'success') {
                alert('✅ Entrée de stock supprimée avec succès');
                setSelectedRow(null);
                loadStocks(filterArticleId, filterDepotId);
            }
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert(`❌ Erreur : ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadStocks(filterArticleId, filterDepotId);
    };

    const handleResetFilters = () => {
        setFilterArticleId('');
        setFilterDepotId('');
        loadStocks();
    };

    const handleSaveSuccess = () => {
        loadStocks(filterArticleId, filterDepotId);
    };

    /* ──────────────────────────────────────
       FORMATAGE
    ────────────────────────────────────── */
    const formatNumber = (val) => {
        if (val === undefined || val === null) return '—';
        return parseFloat(val).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    /* ──────────────────────────────────────
       RENDER
    ────────────────────────────────────── */
    return (
        <div className="stock-list-container" style={{ flexDirection: 'column' }}>

            {/* ── Toolbar ── */}
            <div className="mouvement-toolbar" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#555', fontWeight: '600' }}>
                        📦 Stocks articles par dépôt
                    </span>

                    <input
                        type="number"
                        placeholder="ID article..."
                        value={filterArticleId}
                        onChange={e => setFilterArticleId(e.target.value)}
                        style={{
                            padding: '3px 6px',
                            border: '1px solid #999',
                            fontSize: '11px',
                            width: '100px',
                            height: '24px'
                        }}
                    />
                    <input
                        type="number"
                        placeholder="ID dépôt..."
                        value={filterDepotId}
                        onChange={e => setFilterDepotId(e.target.value)}
                        style={{
                            padding: '3px 6px',
                            border: '1px solid #999',
                            fontSize: '11px',
                            width: '100px',
                            height: '24px'
                        }}
                    />
                    <button className="mouvement-toolbar-btn" onClick={handleSearch}>
                        🔍 Filtrer
                    </button>
                    <button className="mouvement-toolbar-btn" onClick={handleResetFilters}>
                        🔄 Réinitialiser
                    </button>
                </div>

                <div style={{ fontSize: '12px', color: '#666' }}>
                    {stocks.length} entrée(s)
                </div>
            </div>

            {/* ── Table ── */}
            <div className="stock-table-wrapper">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                        ⏳ Chargement...
                    </div>
                ) : (
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>ID</th>
                                <th>Article</th>
                                <th>Référence</th>
                                <th>Dépôt</th>
                                <th>Code dépôt</th>
                                <th style={{ textAlign: 'right' }}>Quantité</th>
                                <th style={{ textAlign: 'right' }}>Valeur unit.</th>
                                <th style={{ textAlign: 'right' }}>Valeur totale</th>
                                <th style={{ width: '30px' }}>▶</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        style={{ textAlign: 'center', padding: '50px', color: '#999' }}
                                    >
                                        Aucune entrée de stock. Cliquez sur "Nouveau" pour en créer une.
                                    </td>
                                </tr>
                            ) : (
                                stocks.map((s, idx) => {
                                    const qty = parseFloat(s.stock_quantity ?? s.quantity ?? 0);
                                    const val = parseFloat(s.stock_value ?? s.value ?? 0);
                                    const total = qty * val;

                                    return (
                                        <tr
                                            key={s.id ?? idx}
                                            className={selectedRow === idx ? 'selected' : ''}
                                            onClick={() => setSelectedRow(idx)}
                                            onDoubleClick={() => handleEdit(s)}
                                        >
                                            <td>{s.id}</td>
                                            <td>
                                                <span style={{ color: '#0066cc' }}>📦</span>{' '}
                                                {s.article?.article_name ?? `Article #${s.stock_article_id}`}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: '#555' }}>
                                                {s.article?.article_reference ?? '—'}
                                            </td>
                                            <td>
                                                {s.depot?.depot_name ?? `Dépôt #${s.stock_depot_id}`}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: '#555' }}>
                                                {s.depot?.depot_code ?? '—'}
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: '600' }}>
                                                {formatNumber(qty)}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {val > 0 ? formatNumber(val) : '—'}
                                            </td>
                                            <td style={{ textAlign: 'right', color: '#0066cc', fontWeight: '600' }}>
                                                {val > 0 ? formatNumber(total) : '—'}
                                            </td>
                                            <td></td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Footer actions ── */}
            <div className="stock-footer-actions">
                <button className="stock-footer-left" onClick={handleResetFilters}>
                    Réinitialiser les filtres...
                </button>

                <div className="stock-footer-right">
                    <button
                        className="btn-custom btn-secondary"
                        onClick={() => {
                            if (selectedRow !== null && stocks[selectedRow]) {
                                handleEdit(stocks[selectedRow]);
                            } else {
                                alert('Sélectionnez une ligne à ouvrir');
                            }
                        }}
                    >
                        Ouvrir
                    </button>

                    <button
                        className="btn-custom btn-primary"
                        onClick={handleNew}
                    >
                        Nouveau
                    </button>

                    <button
                        className="btn-custom btn-secondary"
                        onClick={() => {
                            if (selectedRow !== null && stocks[selectedRow]) {
                                handleDelete(stocks[selectedRow].id);
                            } else {
                                alert('Sélectionnez une ligne à supprimer');
                            }
                        }}
                        style={{ color: '#cc0000' }}
                    >
                        Supprimer
                    </button>

                    <button className="btn-custom btn-secondary" onClick={() => loadStocks()}>
                        🔄 Actualiser
                    </button>
                </div>
            </div>

            {/* ── Modal ── */}
            <ArticleStockDepotFormModal
                show={showModal}
                onHide={() => setShowModal(false)}
                stockEntry={selectedStock}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default ArticleStockDepotListView;