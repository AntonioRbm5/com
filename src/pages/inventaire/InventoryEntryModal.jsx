import React, { useState, useEffect } from 'react';
import './InventoryEntryModal.css';
import { getAllFamilles } from '../../services/familleService';
import { getAllFournisseurs } from '../../services/fournisseurService';
import { getAllArticles } from '../../services/articleService';
import { getAllDepots } from '../../services/depotService'; // Ajoutez ce service si disponible

const InventoryEntryModal = ({ show, onClose, onValidate }) => {
    const [showMoreCriteria, setShowMoreCriteria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [familles, setFamilles] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [articles, setArticles] = useState([]);
    const [depots, setDepots] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);

    const [formData, setFormData] = useState({
        traitement: 'rapide_simplifie',
        typeTraitement: 'saisie_regularisations',
        typeInventaire: 'cumuls_stocks',
        dateInventaire: new Date().toISOString().split('T')[0],
        depot: '',
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
        } else {
            // Réinitialiser le formulaire quand le modal se ferme
            resetForm();
        }
    }, [show]);

    // Filtrer les articles selon les critères
    useEffect(() => {
        if (articles.length > 0) {
            filterArticles();
        }
    }, [formData.familleDe, formData.familleA, formData.fournisseurDe, formData.fournisseurA, articles]);

    const resetForm = () => {
        setFormData({
            traitement: 'rapide_simplifie',
            typeTraitement: 'saisie_regularisations',
            typeInventaire: 'cumuls_stocks',
            dateInventaire: new Date().toISOString().split('T')[0],
            depot: '',
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
        setShowMoreCriteria(false);
        setError(null);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Charger toutes les données en parallèle
            const [famillesResponse, fournisseursResponse, articlesResponse] = await Promise.all([
                getAllFamilles(),
                getAllFournisseurs(),
                getAllArticles()
            ]);

            // Traiter les familles
            if (famillesResponse.data.status === 'success') {
                const famillesList = famillesResponse.data.data || [];
                setFamilles(famillesList.sort((a, b) =>
                    a.famille_name.localeCompare(b.famille_name)
                ));
            }

            // Traiter les fournisseurs
            if (fournisseursResponse.data.status === 'success') {
                const fournisseursList = fournisseursResponse.data.data || [];
                setFournisseurs(fournisseursList.sort((a, b) =>
                    a.fournisseur_name.localeCompare(b.fournisseur_name)
                ));
            }

            // Traiter les articles
            if (articlesResponse.data.status === 'success') {
                const articlesList = articlesResponse.data.data || [];
                setArticles(articlesList.sort((a, b) =>
                    a.article_reference.localeCompare(b.article_reference)
                ));
                setFilteredArticles(articlesList);
            }

            // Charger les dépôts si le service existe
            try {
                if (typeof getAllDepots === 'function') {
                    const depotsResponse = await getAllDepots();
                    if (depotsResponse.data.status === 'success') {
                        const depotsList = depotsResponse.data.data || [];
                        setDepots(depotsList);
                        // Définir le premier dépôt par défaut
                        if (depotsList.length > 0 && !formData.depot) {
                            setFormData(prev => ({
                                ...prev,
                                depot: depotsList[0].depot_id || depotsList[0].depot_code || 'SIEGE'
                            }));
                        }
                    }
                }
            } catch (err) {
                console.log('Service dépôt non disponible, utilisation des valeurs par défaut');
                // Utiliser des valeurs par défaut si le service n'existe pas
                setDepots([
                    { depot_id: 1, depot_code: 'SIEGE', depot_name: 'Siège' },
                    { depot_id: 2, depot_code: 'DEPOT2', depot_name: 'Dépôt 2' },
                    { depot_id: 3, depot_code: 'DEPOT3', depot_name: 'Dépôt 3' }
                ]);
                setFormData(prev => ({ ...prev, depot: 'SIEGE' }));
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Erreur lors du chargement des données';
            setError(errorMsg);
            console.error('Erreur lors du chargement:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterArticles = () => {
        let filtered = [...articles];

        // Filtrer par famille
        if (formData.familleDe || formData.familleA) {
            filtered = filtered.filter(article => {
                if (!article.famille?.famille_id) return false;
                const familleId = parseInt(article.famille.famille_id);
                const deFamille = formData.familleDe ? parseInt(formData.familleDe) : 0;
                const aFamille = formData.familleA ? parseInt(formData.familleA) : Infinity;
                return familleId >= deFamille && familleId <= aFamille;
            });
        }

        // Filtrer par fournisseur
        if (formData.fournisseurDe || formData.fournisseurA) {
            filtered = filtered.filter(article => {
                if (!article.fournisseur?.fournisseur_id) return false;
                const fournisseurId = parseInt(article.fournisseur.fournisseur_id);
                const deFournisseur = formData.fournisseurDe ? parseInt(formData.fournisseurDe) : 0;
                const aFournisseur = formData.fournisseurA ? parseInt(formData.fournisseurA) : Infinity;
                return fournisseurId >= deFournisseur && fournisseurId <= aFournisseur;
            });
        }

        setFilteredArticles(filtered);
    };

    if (!show) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.dateInventaire) {
            errors.push('La date d\'inventaire est obligatoire');
        }

        if (!formData.depot) {
            errors.push('Le dépôt est obligatoire');
        }

        // Vérifier que "De" n'est pas supérieur à "À"
        if (formData.familleDe && formData.familleA) {
            if (parseInt(formData.familleDe) > parseInt(formData.familleA)) {
                errors.push('La famille "De" ne peut pas être supérieure à la famille "À"');
            }
        }

        if (formData.articleDe && formData.articleA) {
            if (parseInt(formData.articleDe) > parseInt(formData.articleA)) {
                errors.push('L\'article "De" ne peut pas être supérieur à l\'article "À"');
            }
        }

        if (formData.fournisseurDe && formData.fournisseurA) {
            if (parseInt(formData.fournisseurDe) > parseInt(formData.fournisseurA)) {
                errors.push('Le fournisseur "De" ne peut pas être supérieur au fournisseur "À"');
            }
        }

        return errors;
    };

    const handleSubmit = () => {
        // Validation
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join('\n'));
            return;
        }

        // Préparer les données à envoyer
        const dataToSend = {
            traitement: formData.traitement,
            typeTraitement: formData.typeTraitement,
            typeInventaire: formData.typeInventaire,
            dateInventaire: formData.dateInventaire,
            depot: formData.depot,
            classement: formData.classement,
            uniteInventaire: formData.uniteInventaire,
            criteres: {
                depot: formData.depot,
                famille_range: formData.familleDe || formData.familleA ? {
                    de: formData.familleDe || null,
                    a: formData.familleA || null
                } : null,
                article_range: formData.articleDe || formData.articleA ? {
                    de: formData.articleDe || null,
                    a: formData.articleA || null
                } : null,
                fournisseur_range: formData.fournisseurDe || formData.fournisseurA ? {
                    de: formData.fournisseurDe || null,
                    a: formData.fournisseurA || null
                } : null
            },
            articlesCount: filteredArticles.length
        };

        onValidate(dataToSend);
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="inventory-modal-overlay" onClick={handleCancel}>
            <div className="inventory-modal" onClick={(e) => e.stopPropagation()}>
                <div className="inventory-modal-header">
                    <div className="inventory-modal-title">
                        <span className="inventory-modal-icon">⚙</span>
                        <span>Saisie d'inventaire</span>
                    </div>
                    <button className="inventory-modal-close-btn" onClick={handleCancel}>×</button>
                </div>

                <div className="inventory-modal-body">
                    {loading && (
                        <div style={{
                            padding: '15px',
                            textAlign: 'center',
                            color: '#666',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            margin: '10px 0'
                        }}>
                            <span>⏳</span> Chargement des données...
                        </div>
                    )}

                    {error && (
                        <div style={{
                            padding: '10px',
                            margin: '10px 0',
                            backgroundColor: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '4px',
                            color: '#c00',
                            whiteSpace: 'pre-line'
                        }}>
                            <strong>⚠️ Erreur:</strong>
                            <br />
                            {error}
                            <button
                                onClick={() => setError(null)}
                                style={{
                                    float: 'right',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#c00',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <button
                        className="criteria-toggle"
                        onClick={() => setShowMoreCriteria(!showMoreCriteria)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '15px',
                            backgroundColor: showMoreCriteria ? '#007bff' : '#f0f0f0',
                            color: showMoreCriteria ? 'white' : '#333',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <span className="toggle-icon">📋</span>
                        <span>Plus de critères</span>
                        <span>{showMoreCriteria ? '▲' : '▼'}</span>
                    </button>

                    <div className="form-section">
                        <div className="form-row">
                            <label>Traitement</label>
                            <select
                                name="traitement"
                                value={formData.traitement}
                                onChange={handleInputChange}
                                disabled={loading}
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
                                disabled={loading}
                            >
                                <option value="saisie_regularisations">Saisie des régularisations</option>
                                <option value="verification">Vérification</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Type d'inventaire</label>
                            <select
                                name="typeInventaire"
                                value={formData.typeInventaire}
                                onChange={handleInputChange}
                                disabled={loading}
                            >
                                <option value="cumuls_stocks">Cumuls de stocks</option>
                                <option value="physique">Inventaire physique</option>
                                <option value="tournant">Inventaire tournant</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Date d'inventaire <span style={{ color: 'red' }}>*</span></label>
                            <div className="date-input-group">
                                <input
                                    type="date"
                                    name="dateInventaire"
                                    value={formData.dateInventaire}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label>Dépôt <span style={{ color: 'red' }}>*</span></label>
                            <select
                                name="depot"
                                value={formData.depot}
                                onChange={handleInputChange}
                                disabled={loading}
                                required
                            >
                                <option value="">-- Sélectionner un dépôt --</option>
                                {depots.map(depot => (
                                    <option
                                        key={depot.depot_id || depot.depot_code}
                                        value={depot.depot_id || depot.depot_code}
                                    >
                                        {depot.depot_name || depot.depot_code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {showMoreCriteria && (
                        <>
                            <div className="form-section">
                                <h3 className="section-title">Critères de sélection</h3>

                                <div className="form-row-double">
                                    <label>Famille de</label>
                                    <select
                                        name="familleDe"
                                        value={formData.familleDe}
                                        onChange={handleInputChange}
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
                                    >
                                        <option value="">Tous</option>
                                        {filteredArticles.map(article => (
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
                                        disabled={loading}
                                    >
                                        <option value="">Tous</option>
                                        {filteredArticles.map(article => (
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
                                    >
                                        <option value="unite_vente">Unité de vente</option>
                                        <option value="unite_stock">Unité de stock</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="watermark" style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        borderLeft: '4px solid #007bff'
                    }}>
                        <div className="watermark-text" style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#333'
                        }}>
                            📦 Articles sélectionnés: {filteredArticles.length} / {articles.length}
                        </div>
                        <div className="watermark-subtext" style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '5px'
                        }}>
                            📅 Date: {formData.dateInventaire ? new Date(formData.dateInventaire).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : '-'}
                        </div>
                        {formData.depot && (
                            <div className="watermark-subtext" style={{
                                fontSize: '12px',
                                color: '#666',
                                marginTop: '3px'
                            }}>
                                🏢 Dépôt: {depots.find(d => d.depot_id === formData.depot || d.depot_code === formData.depot)?.depot_name || formData.depot}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn-ok"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Chargement...' : 'OK'}
                    </button>
                    <button
                        className="btn-cancel"
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

export default InventoryEntryModal;