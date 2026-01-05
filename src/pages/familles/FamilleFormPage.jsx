import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import IdentificationTab from './tabs/IdentificationTab';
import ParametresTab from './parametres/ParametresTab';
import './famille.css';


const FamilleFormPage = ({ famille, onSave, mode = 'edit' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('identification');
    const [formData, setFormData] = useState(famille || {
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        navigate('/famille');
    };
    return (
        <div className="window">
            <div className="window-header">
                <h2 className="window-title">
                    Famille : {formData.code ? `${formData.code} ${formData.intitule}` : 'Nouvelle Famille'}
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
                        className={`form-tab ${activeTab === 'descriptif' ? 'active' : ''}`}
                        onClick={() => setActiveTab('descriptif')}
                    >
                        Descriptif
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

                {activeTab === 'descriptif' && (
                    <div className="form-section">
                        <div className="form-section-title">Description complémentaire</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Code fiscal</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pays d'origine</label>
                                <select className="form-select">
                                    <option></option>
                                    <option>Madagascar</option>
                                    <option>France</option>
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
                <button className="btn" onClick={() => navigate('/famille')}>Annuler</button>
            </div>
        </div>
    )
}

export default FamilleFormPage