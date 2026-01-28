import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IdentificationTab from './tabs/IdentificationTab';
import ParametresTab from './parametres/ParametresTab';
import './article.css';
import { createArticle, getArticleById, updateArticle } from '../../services/articleService';
import { getAllFamilles } from '../../services/familleService';
import { getAllUnites } from '../../services/uniteService';
import Sidebar from '../../composants/sidebar';
import Navbar from '../../composants/navbar';

const ArticleFormPage = ({ mode = 'edit' }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('identification');
    const [familles, setFamilles] = useState([]);
    const [unitesStock, setUnitesStock] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        article_name: '',
        article_reference: '',
        article_description: '',
        article_prix_vente: 0,
        article_is_serialized: false,
        famille_id: null,
        categorie_id: null,
        fournisseur_id: null,
        unite_stock_id: null,
        unite_vente_defaut_id: null,
        suiviStock: 'Aucun',
        type: 'Détail',
        codeFiscal: '',
        paysOrigine: '',
        publierSurSite: true,
        suiviStockParam: 'CMUP',
        niveauCriticite: 'Mineur',
        unitesPoids: 'Kilogramme',
        delaiLivraison: 0,
        garantie: 0
    });

    useEffect(() => {
        console.log("MODE =", mode, "ID =", id);
        
        loadFamilles();
        loadUnites();

        if (mode === 'edit' && id) {
            console.log("➡ Appel loadArticle avec id =", id);
            loadArticle(id);
        }
    }, [mode, id]);

    const loadFamilles = async () => {
        try {
            const response = await getAllFamilles();
            if (response.data.status === 'success') {
                setFamilles(response.data.data);
            }
        } catch (err) {
            console.error('Erreur chargement familles:', err);
        }
    };

    const loadUnites = async () => {
        try {
            const response = await getAllUnites();
            if (response.data?.status === 'success') {
                setUnitesStock(response.data.data || []);
            }
        } catch (err) {
            console.error('Erreur chargement unités:', err);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const apiData = {
                article_name: formData.article_name,
                article_reference: formData.article_reference,
                article_description: formData.article_description || '--',
                article_prix_vente: parseFloat(formData.article_prix_vente) || 0,
                article_is_serialized: formData.article_is_serialized,
                famille_id: formData.famille_id,
                categorie_id: formData.categorie_id,
                fournisseur_id: formData.fournisseur_id,
                unite_stock_id: formData.unite_stock_id,
                unite_vente_defaut_id: formData.unite_vente_defaut_id
            };

            let response;

            if (mode === 'edit' && id) {
                response = await updateArticle(id, apiData);
            } else {
                response = await createArticle(apiData);
            }

            if (response.data.status === 'success') {
                navigate('/article');
            } else {
                setError(response.data.message || 'Erreur lors de l\'enregistrement');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadArticle = async (articleId) => {
        try {
            setLoading(true);

            const response = await getArticleById(articleId);

            if (response.data.status !== 'success') {
                setError("Erreur chargement article");
                return;
            }

            const a = response.data.data;

            setFormData({
                article_name: a.article_name || '',
                article_reference: a.article_reference || '',
                article_description: a.article_description || '',
                article_prix_vente: a.article_prix_vente || 0,
                article_is_serialized: a.article_is_serialized || false,
                famille_id: a.famille?.famille_id || null,
                categorie_id: a.categorie?.categorie_id || null,
                fournisseur_id: a.fournisseur?.fournisseur_id || null,
                unite_stock_id: a.unite_stock?.unite_id || null,
                unite_vente_defaut_id: a.unite_vente_defaut?.unite_id || null,
                suiviStock: 'Aucun',
                type: 'Détail',
                publierSurSite: true,
                suiviStockParam: 'CMUP',
                niveauCriticite: 'Mineur',
                unitesPoids: 'Kilogramme',
                delaiLivraison: 0,
                garantie: 0
            });

        } catch (err) {
            console.error(err);
            setError("Erreur chargement article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="window">
                    <div className="window-header">
                        <h2 className="window-title">
                            Article : {formData.article_reference ? `${formData.article_reference} ${formData.article_name}` : 'Nouvel article'}
                        </h2>
                        <div className="window-controls">
                            <button className="window-control-btn">_</button>
                            <button className="window-control-btn">□</button>
                            <button className="window-control-btn">×</button>
                        </div>
                    </div>

                    <div className="toolbar">
                        <button className="toolbar-btn">
                            <span className="toolbar-icon">⚙️</span>
                            Fonctions
                        </button>
                        <button className="toolbar-btn">
                            <span className="toolbar-icon">📝</span>
                            Nomenclature
                        </button>
                        <button className="toolbar-btn">
                            <span className="toolbar-icon">❓</span>
                            Interroger
                        </button>
                        <button className="toolbar-btn">
                            <span className="toolbar-icon">🔄</span>
                            Traçabilité
                        </button>
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px',
                            margin: '10px',
                            backgroundColor: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '4px',
                            color: '#c00'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-container">
                        <div className="form-tabs">
                            <button
                                className={`form-tab ${activeTab === 'identification' ? 'active' : ''}`}
                                onClick={() => setActiveTab('identification')}
                            >
                                Identification
                            </button>
                            <button
                                className={`form-tab ${activeTab === 'tarif' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tarif')}
                            >
                                Tarif
                            </button>
                            <button
                                className={`form-tab ${activeTab === 'champsLibres' ? 'active' : ''}`}
                                onClick={() => setActiveTab('champsLibres')}
                            >
                                Champs Libres
                            </button>
                            <button
                                className={`form-tab ${activeTab === 'parametres' ? 'active' : ''}`}
                                onClick={() => setActiveTab('parametres')}
                            >
                                Paramètres
                            </button>
                        </div>

                        {activeTab === 'identification' && (
                            <IdentificationTab
                                formData={formData}
                                handleInputChange={handleInputChange}
                                familles={familles}
                            />
                        )}

                        {activeTab === 'tarif' && (
                            <div className="article-form-section">
                                <div className="article-form-section-title">Tarif</div>
                                <div className="article-form-row">
                                    <div className="article-form-group">
                                        <label className="article-form-label">Prix d'achat</label>
                                        <input type="number" step="0.01" className="form-input" />
                                    </div>
                                    <div className="article-form-group">
                                        <label className="article-form-label">Dernier Prix d'achat</label>
                                        <input type="number" step="0.01" className="form-input" />
                                    </div>
                                </div>
                                <div className="article-form-row">
                                    <div className="article-form-group">
                                        <label className="article-form-label">Nomenclature</label>
                                        <input type="text" className="form-input" />
                                    </div>
                                    <div className="article-form-group">
                                        <label className="article-form-label">Coût standard</label>
                                        <input type="number" step="0.01" className="form-input" />
                                    </div>
                                </div>
                                <div className="article-form-row">
                                    <div className="article-form-group">
                                        <label className="article-form-label">Prix de vente *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.article_prix_vente}
                                            onChange={(e) => handleInputChange('article_prix_vente', parseFloat(e.target.value) || 0)}
                                        />
                                        <select className="form-select" style={{ flex: '0 0 100px' }}>
                                            <option>PV HT</option>
                                            <option>PV TTC</option>
                                        </select>
                                    </div>
                                    <div className="article-form-group">
                                        <label className="article-form-label">Unité de vente par défaut</label>
                                        <select
                                            className="form-select"
                                            value={formData.unite_vente_defaut_id || ''}
                                            onChange={(e) => handleInputChange('unite_vente_defaut_id', parseInt(e.target.value) || null)}
                                            disabled={loading}
                                        >
                                            <option value="">-- Sélectionner --</option>
                                            {unitesStock.map(u => (
                                                <option key={u.unite_id} value={u.unite_id}>
                                                    {u.unite_libelle} ({u.unite_code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'champsLibres' && (
                            <div className="article-form-section">
                                <div className="article-form-section-title">Champs Libres</div>
                                <p>Aucun champ libre défini</p>
                            </div>
                        )}

                        {activeTab === 'parametres' && (
                            <ParametresTab formData={formData} handleInputChange={handleInputChange} />
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Enregistrement...' : 'OK'}
                        </button>
                        <button className="btn" onClick={() => navigate('/article')}>Annuler</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleFormPage;