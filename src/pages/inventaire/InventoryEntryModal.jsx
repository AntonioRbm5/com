import React, { useState, useEffect } from 'react';
import './InventoryEntryModal.css';
import { getAllFamilles } from '../../services/familleService';
import { getAllFournisseurs } from '../../services/fournisseurService';
import { getAllArticles } from '../../services/articleService';

const InventoryEntryModal = ({ show, onClose, onValidate }) => {
    const [showMoreCriteria, setShowMoreCriteria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [familles, setFamilles] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [articles, setArticles] = useState([]);

    const [formData, setFormData] = useState({
        traitement: 'rapide_simplifie',
        typeTraitement: 'saisie_regularisations',
        typeInventaire: 'cumuls_stocks',
        dateInventaire: new Date().toISOString().split('T')[0],
        depot: 'SIEGE',
        emplacementDe: '',
        emplacementA: '',
        familleDe: '',
        familleA: '',
        articleDe: '',
        articleA: '',
        fournisseurDe: '',
        fournisseurA: '',
        classement: 'article',
        uniteInventaire: 'unite_vente'
    });

    useEffect(() => {
        if (show) {
            loadData();
        }
    }, [show]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Charger les familles
            const famillesResponse = await getAllFamilles();
            if (famillesResponse.data.status === 'success') {
                setFamilles(famillesResponse.data.data);
            }

            // Charger les fournisseurs
            const fournisseursResponse = await getAllFournisseurs();
            if (fournisseursResponse.data.status === 'success') {
                setFournisseurs(fournisseursResponse.data.data);
            }

            // Charger les articles
            const articlesResponse = await getAllArticles();
            if (articlesResponse.data.status === 'success') {
                setArticles(articlesResponse.data.data);
            }

        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.dateInventaire) {
            alert('La date d\'inventaire est obligatoire');
            return;
        }

        // Préparer les données à envoyer
        const dataToSend = {
            ...formData,
            criteres: {
                depot: formData.depot,
                famille_range: formData.familleDe || formData.familleA ? {
                    de: formData.familleDe,
                    a: formData.familleA
                } : null,
                article_range: formData.articleDe || formData.articleA ? {
                    de: formData.articleDe,
                    a: formData.articleA
                } : null,
                fournisseur_range: formData.fournisseurDe || formData.fournisseurA ? {
                    de: formData.fournisseurDe,
                    a: formData.fournisseurA
                } : null
            }
        };

        onValidate(dataToSend);
        onClose();
    };

    return (
        <div className="inventory-modal-overlay" onClick={onClose}>
            <div className="inventory-modal" onClick={(e) => e.stopPropagation()}>
                <div className="inventory-modal-header">
                    <div className="inventory-modal-title">
                        <span className="inventory-modal-icon">⚙</span>
                        <span>Saisie d'inventaire</span>
                    </div>
                    <button className="inventory-modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="inventory-modal-body">
                    {loading && (
                        <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                            Chargement des données...
                        </div>
                    )}

                    <button
                        className="criteria-toggle"
                        onClick={() => setShowMoreCriteria(!showMoreCriteria)}
                    >
                        <span className="toggle-icon">📋</span>
                        Plus de critères {showMoreCriteria ? '▲' : '▼'}
                    </button>

                    <div className="form-section">
                        <div className="form-row">
                            <label>Traitement</label>
                            <select
                                name="traitement"
                                value={formData.traitement}
                                onChange={handleInputChange}
                            >
                                <option value="rapide_simplifie">Rapide simplifié</option>
                                <option value="complet">Complet</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Type traitement</label>
                            <select
                                name="typeTraitement"
                                value={formData.typeTraitement}
                                onChange={handleInputChange}
                            >
                                <option value="saisie_regularisations">Saisie des régularisations</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Type d'inventaire</label>
                            <select
                                name="typeInventaire"
                                value={formData.typeInventaire}
                                onChange={handleInputChange}
                            >
                                <option value="cumuls_stocks">Cumuls de stocks</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Date d'inventaire *</label>
                            <div className="date-input-group">
                                <input
                                    type="date"
                                    name="dateInventaire"
                                    value={formData.dateInventaire}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {showMoreCriteria && (
                        <>
                            <div className="form-section">
                                <h3 className="section-title">Critères de sélection</h3>

                                <div className="form-row">
                                    <label>Dépôt</label>
                                    <select
                                        name="depot"
                                        value={formData.depot}
                                        onChange={handleInputChange}
                                    >
                                        <option value="SIEGE">SIEGE</option>
                                        <option value="DEPOT2">DEPOT2</option>
                                        <option value="DEPOT3">DEPOT3</option>
                                    </select>
                                </div>

                                <div className="form-row-double">
                                    <label>Famille de</label>
                                    <select
                                        name="familleDe"
                                        value={formData.familleDe}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Toutes</option>
                                        {familles.map(famille => (
                                            <option key={famille.famille_id} value={famille.famille_id}>
                                                {famille.famille_name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="separator">à</span>
                                    <select
                                        name="familleA"
                                        value={formData.familleA}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Toutes</option>
                                        {familles.map(famille => (
                                            <option key={famille.famille_id} value={famille.famille_id}>
                                                {famille.famille_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row-double">
                                    <label>Article de</label>
                                    <select
                                        name="articleDe"
                                        value={formData.articleDe}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Tous</option>
                                        {articles.map(article => (
                                            <option key={article.article_id} value={article.article_id}>
                                                {article.article_reference} - {article.article_name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="separator">à</span>
                                    <select
                                        name="articleA"
                                        value={formData.articleA}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Tous</option>
                                        {articles.map(article => (
                                            <option key={article.article_id} value={article.article_id}>
                                                {article.article_reference} - {article.article_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row-double">
                                    <label>Fournisseur de</label>
                                    <select
                                        name="fournisseurDe"
                                        value={formData.fournisseurDe}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Tous</option>
                                        {fournisseurs.map(fournisseur => (
                                            <option key={fournisseur.fournisseur_id} value={fournisseur.fournisseur_id}>
                                                {fournisseur.fournisseur_name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="separator">à</span>
                                    <select
                                        name="fournisseurA"
                                        value={formData.fournisseurA}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Tous</option>
                                        {fournisseurs.map(fournisseur => (
                                            <option key={fournisseur.fournisseur_id} value={fournisseur.fournisseur_id}>
                                                {fournisseur.fournisseur_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Options de traitement</h3>

                                <div className="form-row">
                                    <label>Classement</label>
                                    <select
                                        name="classement"
                                        value={formData.classement}
                                        onChange={handleInputChange}
                                    >
                                        <option value="article">Article</option>
                                        <option value="reference">Référence</option>
                                        <option value="famille">Famille</option>
                                        <option value="fournisseur">Fournisseur</option>
                                    </select>
                                </div>

                                <div className="form-row">
                                    <label>Unité inventaire</label>
                                    <select
                                        name="uniteInventaire"
                                        value={formData.uniteInventaire}
                                        onChange={handleInputChange}
                                    >
                                        <option value="unite_vente">Unité de vente</option>
                                        <option value="unite_stock">Unité de stock</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="watermark">
                        <div className="watermark-text">
                            Articles sélectionnés: {articles.length}
                        </div>
                        <div className="watermark-subtext">
                            Date: {new Date(formData.dateInventaire).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn-ok"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        OK
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryEntryModal;