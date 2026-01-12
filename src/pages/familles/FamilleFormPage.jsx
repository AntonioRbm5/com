import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IdentificationTab from './tabs/IdentificationTab';
import ParametresTab from './parametres/ParametresTab';
import './famille.css';
import { createFamille } from '../../services/familleService';

const FamilleFormPage = ({ mode = 'edit' }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('identification');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        famille_name: '',
        famille_description: '',
        code: '',
        intitule: '',
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
        if (mode === 'edit' && id) {
            // TODO: Charger la famille existante
            // loadFamille(id);
        }
    }, [mode, id]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const apiData = {
                famille_name: formData.famille_name || formData.famille_name,
                famille_description: formData.famille_description || formData.famille_description
            };

            const response = await createFamille(apiData);

            if (response.data.status === 'success') {
                navigate('/famille');
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
        <div className="famille-window">
            <div className="famille-window-header">
                <h2 className="famille-window-title">
                    Famille : {formData.code ? `${formData.code} ${formData.intitule}` : 'Nouvelle Famille'}
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
                        className={`form-tab ${activeTab === 'parametres' ? 'active' : ''}`}
                        onClick={() => setActiveTab('parametres')}
                    >
                        Paramètres
                    </button>
                </div>

                {activeTab === 'identification' && (
                    <IdentificationTab formData={formData} handleInputChange={handleInputChange} />
                )}

                {activeTab === 'tarif' && (
                    <div className="form-section">
                        <div className="form-section-title">Tarif</div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Prix d'achat</label>
                                <input type="number" className="form-input" />
                            </div>
                            <div className="famille-form-group">
                                <label className="famille-form-label">Dernier Prix d'achat</label>
                                <input type="number" className="form-input" />
                            </div>
                        </div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Coefficient</label>
                                <input type="number" className="form-input" />
                            </div>
                            <div className="famille-form-group">
                                <label className="famille-form-label">Coût standard</label>
                                <input type="number" className="form-input" />
                            </div>
                        </div>
                        <div className="famille-form-row">
                            <div className="famille-form-group">
                                <label className="famille-form-label">Prix de vente</label>
                                <input type="number" className="form-input" />
                                <select className="famille-form-select" style={{ flex: '0 0 100px' }}>
                                    <option>PV HT</option>
                                </select>
                            </div>
                            <div className="famille-form-group">
                                <label className="famille-form-label">Unité de vente</label>
                                <select
                                    className="famille-form-select"
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
                <button className="btn" onClick={() => navigate('/famille')}>Annuler</button>
            </div>
        </div>
    );
};

export default FamilleFormPage;