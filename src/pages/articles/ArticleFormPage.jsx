import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IdentificationTab from './tabs/IdentificationTab';
import ParametresTab from './parametres/ParametresTab';
import './article.css';
import { createArticle } from '../../services/articleService';
import { getAllFamilles } from '../../services/familleService';

const ArticleFormPage = ({ mode = 'edit' }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('identification');
    const [familles, setFamilles] = useState([]);
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
        unitVente: 'PIECE',
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
        loadFamilles();
        // Si mode edit, charger l'article
        if (mode === 'edit' && id) {
            // TODO: Implémenter le chargement de l'article existant
            // loadArticle(id);
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Préparer les données pour l'API
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

            const response = await createArticle(apiData);
            
            if (response.data.status === 'success') {
                navigate('/article');
            } else {
                setError(response.data.message || 'Erreur lors de la création');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    <div className="form-section">
                        <div className="form-section-title">Tarif</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Prix d'achat</label>
                                <input type="number" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Dernier Prix d'achat</label>
                                <input type="number" className="form-input" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nomenclature</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Coût standard</label>
                                <input type="number" className="form-input" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Prix de vente</label>
                                <input 
                                    type="number" 
                                    className="form-input"
                                    value={formData.article_prix_vente}
                                    onChange={(e) => handleInputChange('article_prix_vente', e.target.value)}
                                />
                                <select className="form-select" style={{ flex: '0 0 100px' }}>
                                    <option>PV HT</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Unité de vente</label>
                                <select
                                    className="form-select"
                                    value={formData.unitVente || 'PIECE'}
                                    onChange={(e) => handleInputChange('unitVente', e.target.value)}
                                >
                                    <option>PIECE</option>
                                    <option>METRE</option>
                                    <option>KG</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'champsLibres' && (
                    <div className="form-section">
                        <div className="form-section-title">Champs Libres</div>
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
    );
};

export default ArticleFormPage;