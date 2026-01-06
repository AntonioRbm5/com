import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import IdentificationTab from './tabs/IdentificationTab';
import ParametresTab from './parametres/ParametresTab';
import './article.css';


const ArticleFormPage = ({ article, onSave, mode = 'edit' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('identification');
    const [formData, setFormData] = useState(article || {
        reference: '',
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        navigate('/article');
    };
    return (
        <div className="window">
            <div className="window-header">
                <h2 className="window-title">
                    article : {formData.reference ? `${formData.reference} ${formData.intitule}` : 'Nouvelle article'}
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
                    <IdentificationTab formData={formData} handleInputChange={handleInputChange} />
                )}

                {activeTab === 'tarif' && (
                    <div className="form-section">
                        <div className="form-section-title">Tarif</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Prix d'achat</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Dernier Prix d'achat</label>
                                <input type="text" className="form-input" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nomendature</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Coût standard</label>
                                <input type="text" className="form-input" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Prix de vente</label>
                                <input type="text" className="form-input" />
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
                <button className="btn btn-primary" onClick={handleSubmit}>OK</button>
                <button className="btn" onClick={() => navigate('/article')}>Annuler</button>
            </div>
        </div>
    )
}

export default ArticleFormPage