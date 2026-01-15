import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../familles/famille.css';

import { createFournisseur, getFournisseurById, updateFournisseur } from '../../services/fournisseurService';

const FournisseurFormPage = ({ mode = 'edit' }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('identification');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fournisseur_name: '',
        fournisseur_reference: ''
    });

    useEffect(() => {
        if (mode === 'edit' && id) {
            loadFournisseur(id);
        }
    }, [mode, id]);

    const loadFournisseur = async (fournisseurId) => {
        try {
            setLoading(true);
            const response = await getFournisseurById(fournisseurId);

            if (response.data.status === 'success' && response.data.data.length > 0) {
                const fournisseur = response.data.data[0];
                setFormData({
                    fournisseur_name: fournisseur.fournisseur_name || '',
                    fournisseur_reference: fournisseur.fournisseur_reference || ''
                });
            } else {
                setError('Fournisseur introuvable');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement du fournisseur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.fournisseur_name) {
            setError('Le nom du fournisseur est obligatoire');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const apiData = {
                fournisseur_name: formData.fournisseur_name,
                fournisseur_reference: formData.fournisseur_reference || null
            };

            let response;
            if (mode === 'edit' && id) {
                response = await updateFournisseur(apiData, id);
            } else {
                response = await createFournisseur(apiData);
            }

            if (response.data.status === 'success') {
                navigate('/fournisseur');
            } else {
                setError(response.data.message || 'Erreur lors de la sauvegarde');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="famille-window">
            <div className="famille-window-header">
                <h2 className="famille-window-title">
                    Fournisseur : {formData.fournisseur_name || 'Nouveau Fournisseur'}
                </h2>
                <div className="famille-window-controls">
                    <button className="famille-window-control-btn">_</button>
                    <button className="famille-window-control-btn">□</button>
                    <button className="famille-window-control-btn">×</button>
                </div>
            </div>

            <div className="toolbar">
                <button className="toolbar-btn">
                    <span className="toolbar-icon">⚙️</span>
                    Fonctions
                </button>
                <button className="toolbar-btn">
                    <span className="toolbar-icon">📦</span>
                    Articles
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
                        className={`form-tab ${activeTab === 'coordonnees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('coordonnees')}
                    >
                        Coordonnées
                    </button>
                    <button
                        className={`form-tab ${activeTab === 'articles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('articles')}
                    >
                        Articles
                    </button>
                </div>

                {activeTab === 'identification' && (
                    <div className="form-section">
                        <div className="form-section-title">Informations générales</div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Nom du fournisseur *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.fournisseur_name}
                                    onChange={(e) => handleInputChange('fournisseur_name', e.target.value)}
                                    placeholder="Entrez le nom du fournisseur"
                                />
                            </div>
                        </div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Référence</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.fournisseur_reference}
                                    onChange={(e) => handleInputChange('fournisseur_reference', e.target.value)}
                                    placeholder="Référence du fournisseur"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'coordonnees' && (
                    <div className="form-section">
                        <div className="form-section-title">Coordonnées</div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Adresse</label>
                                <input type="text" className="form-input" placeholder="À venir" disabled />
                            </div>
                        </div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Ville</label>
                                <input type="text" className="form-input" placeholder="À venir" disabled />
                            </div>
                            <div className="famille-form-group">
                                <label className="famille-form-label">Code postal</label>
                                <input type="text" className="form-input" placeholder="À venir" disabled />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'articles' && (
                    <div className="form-section">
                        <div className="form-section-title">Articles du fournisseur</div>
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            Liste des articles à venir
                        </div>
                    </div>
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
                <button className="btn" onClick={() => navigate('/fournisseur')}>Annuler</button>
            </div>
        </div>
    );
};

export default FournisseurFormPage;