import React, { useState, useEffect } from 'react';
import { getAllArticles } from '../../services/articleService';

import './stock.css';
import { searchStockageDepot, transformDepotResponse } from '../../services/stockService';
import { createArticleStockDepot, updateArticleStockDepot } from '../../services/articleStockDepotService';

/**
 * ArticleStockDepotFormModal
 * Création ou modification d'un stock article dans un dépôt
 * Props :
 *   show          {boolean}   — afficher ou masquer la modale
 *   onHide        {function}  — fermer la modale
 *   stockEntry    {object}    — objet existant (mode édition) ou null (mode création)
 *   onSaveSuccess {function}  — callback après enregistrement réussi
 */
const ArticleStockDepotFormModal = ({ show, onHide, stockEntry, onSaveSuccess }) => {

    /* ──────────────────────────────────────
       ÉTATS
    ────────────────────────────────────── */
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [articles, setArticles] = useState([]);
    const [depots, setDepots] = useState([]);

    const [formData, setFormData] = useState({
        stock_article_id: '',
        stock_depot_id: '',
        stock_quantity: '',
        stock_value: ''
    });

    const [errors, setErrors] = useState({});

    /* ──────────────────────────────────────
       CHARGEMENT DES DONNÉES DE RÉFÉRENCE
    ────────────────────────────────────── */
    useEffect(() => {
        if (!show) return;

        const fetchData = async () => {
            try {
                setLoadingData(true);

                const [articlesRes, depotsRes] = await Promise.all([
                    getAllArticles().catch(() => ({ data: { data: [] } })),
                    searchStockageDepot().catch(() => ({ data: { data: [] } }))
                ]);

                const articlesList = Array.isArray(articlesRes?.data?.data)
                    ? articlesRes.data.data
                    : [];

                const depotsList = transformDepotResponse(depotsRes);

                setArticles(articlesList);
                setDepots(depotsList);

            } catch (error) {
                console.error('❌ Erreur chargement données:', error);
                alert('⚠️ Erreur lors du chargement des données de référence');
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [show]);

    /* ──────────────────────────────────────
       PRÉ-REMPLISSAGE EN MODE ÉDITION
    ────────────────────────────────────── */
    useEffect(() => {
        if (!show) return;

        if (stockEntry) {
            setFormData({
                stock_article_id: String(stockEntry.stock_article_id ?? stockEntry.article_id ?? ''),
                stock_depot_id: String(stockEntry.stock_depot_id ?? stockEntry.depot_id ?? ''),
                stock_quantity: String(stockEntry.stock_quantity ?? stockEntry.quantity ?? ''),
                stock_value: String(stockEntry.stock_value ?? stockEntry.value ?? '')
            });
        } else {
            setFormData({
                stock_article_id: '',
                stock_depot_id: '',
                stock_quantity: '',
                stock_value: ''
            });
        }

        setErrors({});
    }, [show, stockEntry]);

    /* ──────────────────────────────────────
       HANDLERS
    ────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    /* ──────────────────────────────────────
       VALIDATION
    ────────────────────────────────────── */
    const validate = () => {
        const newErrors = {};

        if (!formData.stock_article_id)
            newErrors.stock_article_id = 'Veuillez sélectionner un article';

        if (!formData.stock_depot_id)
            newErrors.stock_depot_id = 'Veuillez sélectionner un dépôt';

        if (formData.stock_quantity === '' || isNaN(Number(formData.stock_quantity)))
            newErrors.stock_quantity = 'La quantité est obligatoire et doit être un nombre';
        else if (Number(formData.stock_quantity) < 0)
            newErrors.stock_quantity = 'La quantité ne peut pas être négative';

        if (formData.stock_value !== '' && isNaN(Number(formData.stock_value)))
            newErrors.stock_value = 'La valeur doit être un nombre';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ──────────────────────────────────────
       SOUMISSION
    ────────────────────────────────────── */
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                stock_article_id: parseInt(formData.stock_article_id),
                stock_depot_id: parseInt(formData.stock_depot_id),
                stock_quantity: parseFloat(formData.stock_quantity),
                stock_value: formData.stock_value !== ''
                    ? parseFloat(formData.stock_value)
                    : undefined
            };

            let response;
            if (stockEntry?.id) {
                response = await updateArticleStockDepot(stockEntry.id, payload);
            } else {
                response = await createArticleStockDepot(payload);
            }

            if (response?.data?.status === 'success') {
                alert(stockEntry
                    ? '✅ Stock mis à jour avec succès'
                    : '✅ Stock créé avec succès'
                );
                onSaveSuccess?.();
                onHide();
            } else {
                alert(`❌ ${response?.data?.message || 'Erreur lors de la sauvegarde'}`);
            }
        } catch (err) {
            console.error('❌ Erreur soumission:', err);
            alert(`❌ Erreur : ${err.response?.data?.message || err.message || 'Erreur inconnue'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (loading) return;
        onHide();
    };

    /* ──────────────────────────────────────
       RENDER
    ────────────────────────────────────── */
    if (!show) return null;

    // Retrouver le nom de l'article sélectionné pour affichage
    const selectedArticle = articles.find(
        a => String(a.article_id) === String(formData.stock_article_id)
    );

    return (
        <div className="mouvement-modal-overlay">
            <div
                className="mouvement-modal-container"
                style={{ maxWidth: '560px', height: 'auto' }}
            >
                {/* ── Header ── */}
                <div className="mouvement-modal-header">
                    <span className="mouvement-modal-title">
                        {stockEntry
                            ? '✏️ Modifier le stock article'
                            : '➕ Nouveau stock article dans un dépôt'
                        }
                    </span>
                    <button className="close-btn" onClick={handleCancel}>×</button>
                </div>



                {/* ── Corps ── */}
                <div style={{ padding: '20px' }}>
                    {loadingData ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            ⏳ Chargement des données...
                        </div>
                    ) : (
                        <>
                            {/* ── Sélection Article ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label style={{ minWidth: '130px' }}>
                                        Article *
                                        {errors.stock_article_id && (
                                            <span style={{ color: 'red', fontSize: '11px', marginLeft: '8px' }}>
                                                {errors.stock_article_id}
                                            </span>
                                        )}
                                    </label>
                                    <select
                                        name="stock_article_id"
                                        value={formData.stock_article_id}
                                        onChange={handleChange}
                                        style={{
                                            flex: 1,
                                            padding: '6px 8px',
                                            border: errors.stock_article_id
                                                ? '2px solid red'
                                                : '1px solid #999',
                                            fontSize: '12px',
                                            height: '28px'
                                        }}
                                    >
                                        <option value="">-- Sélectionner un article --</option>
                                        {articles.map(a => (
                                            <option key={a.article_id} value={String(a.article_id)}>
                                                [{a.article_reference}] {a.article_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ── Aperçu article sélectionné ── */}
                            {selectedArticle && (
                                <div style={{
                                    margin: '0 0 12px 0',
                                    padding: '8px 12px',
                                    backgroundColor: '#e8f4fd',
                                    border: '1px solid #b3d9ff',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    color: '#333'
                                }}>
                                    <strong>Article sélectionné :</strong>{' '}
                                    {selectedArticle.article_name}
                                    {selectedArticle.article_family && (
                                        <span style={{ color: '#666', marginLeft: '8px' }}>
                                            — Famille : {selectedArticle.article_family}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* ── Sélection Dépôt ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label style={{ minWidth: '130px' }}>
                                        Dépôt *
                                        {errors.stock_depot_id && (
                                            <span style={{ color: 'red', fontSize: '11px', marginLeft: '8px' }}>
                                                {errors.stock_depot_id}
                                            </span>
                                        )}
                                    </label>
                                    <select
                                        name="stock_depot_id"
                                        value={formData.stock_depot_id}
                                        onChange={handleChange}
                                        style={{
                                            flex: 1,
                                            padding: '6px 8px',
                                            border: errors.stock_depot_id
                                                ? '2px solid red'
                                                : '1px solid #999',
                                            fontSize: '12px',
                                            height: '28px'
                                        }}
                                    >
                                        <option value="">-- Sélectionner un dépôt --</option>
                                        {depots.map(d => (
                                            <option key={d.id} value={String(d.id)}>
                                                [{d.code}] {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ── Quantité ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label style={{ minWidth: '130px' }}>
                                        Quantité *
                                        {errors.stock_quantity && (
                                            <span style={{ color: 'red', fontSize: '11px', marginLeft: '8px' }}>
                                                {errors.stock_quantity}
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.001"
                                        placeholder="ex : 100"
                                        style={{
                                            flex: 1,
                                            padding: '4px 8px',
                                            border: errors.stock_quantity
                                                ? '2px solid red'
                                                : '1px solid #999',
                                            fontSize: '12px',
                                            height: '26px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ── Valeur ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label style={{ minWidth: '130px' }}>
                                        Valeur unitaire
                                        {errors.stock_value && (
                                            <span style={{ color: 'red', fontSize: '11px', marginLeft: '8px' }}>
                                                {errors.stock_value}
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        name="stock_value"
                                        value={formData.stock_value}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="ex : 1500.00 (optionnel)"
                                        style={{
                                            flex: 1,
                                            padding: '4px 8px',
                                            border: errors.stock_value
                                                ? '2px solid red'
                                                : '1px solid #999',
                                            fontSize: '12px',
                                            height: '26px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ── Résumé calcul ── */}
                            {formData.stock_quantity !== '' && formData.stock_value !== '' && (
                                <div style={{
                                    padding: '10px 14px',
                                    backgroundColor: '#dce9f5',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '6px'
                                }}>
                                    <span>Valeur totale estimée :</span>
                                    <strong style={{ fontSize: '14px', color: '#0066cc' }}>
                                        {(
                                            parseFloat(formData.stock_quantity || 0) *
                                            parseFloat(formData.stock_value || 0)
                                        ).toLocaleString('fr-FR', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </strong>
                                </div>
                            )}

                            {/* ── Infos mode édition ── */}
                            {stockEntry && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    backgroundColor: '#f0f8ff',
                                    border: '1px solid #b3d9ff',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    color: '#333'
                                }}>
                                    <strong>📋 Entrée de stock :</strong>
                                    <div style={{ marginTop: '6px', color: '#555' }}>
                                        ID : {stockEntry.id}
                                    </div>
                                </div>
                            )}

                            {/* ── Astuce ── */}
                            <div style={{
                                marginTop: '16px',
                                padding: '10px 12px',
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffc107',
                                borderRadius: '4px',
                                fontSize: '11px',
                                color: '#555'
                            }}>
                                <strong>💡 Info :</strong> Cette opération assigne une quantité de stock
                                d'un article à un dépôt spécifique. Pour enregistrer un mouvement
                                d'entrée ou de sortie, utilisez "Mouvement d'entrée".
                            </div>
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="mouvement-modal-footer">
                    <button
                        className="btn-custom btn-primary-custom"
                        onClick={handleSubmit}
                        disabled={loading || loadingData}
                        style={{ minWidth: '140px' }}
                    >
                        {loading
                            ? '⏳ Enregistrement...'
                            : stockEntry
                                ? '💾 Enregistrer les modifications'
                                : '✅ Créer le stock'
                        }
                    </button>
                    <button
                        className="btn-custom btn-secondary-custom"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ArticleStockDepotFormModal;