import React, { useState } from 'react';
import './InventoryEntryModal.css';

const InventoryEntryModal = ({ show, onClose, onValidate }) => {
    const [showMoreCriteria, setShowMoreCriteria] = useState(false);
    const [formData, setFormData] = useState({
        traitement: 'rapide_simplifie',
        typeTraitement: 'saisie_regularisations',
        typeInventaire: 'cumuls_stocks',
        dateInventaire: '',
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

    if (!show) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onValidate(formData);
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
                    <button 
                        className="criteria-toggle"
                        onClick={() => setShowMoreCriteria(!showMoreCriteria)}
                    >
                        <span className="toggle-icon">📋</span>
                        Plus de critères
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
                            <label>Date d'inventaire</label>
                            <div className="date-input-group">
                                <input 
                                    type="text" 
                                    name="dateInventaire"
                                    value={formData.dateInventaire}
                                    onChange={handleInputChange}
                                    placeholder="JJ/MM/AA"
                                />
                                <button className="calendar-btn">📅</button>
                            </div>
                        </div>
                    </div>

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
                            </select>
                        </div>

                        <div className="form-row-double">
                            <label>Emplacement de</label>
                            <select 
                                name="emplacementDe"
                                value={formData.emplacementDe}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                            <span className="separator">à</span>
                            <select 
                                name="emplacementA"
                                value={formData.emplacementA}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                        </div>

                        <div className="form-row-double">
                            <label>Famille de</label>
                            <select 
                                name="familleDe"
                                value={formData.familleDe}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                            <span className="separator">à</span>
                            <select 
                                name="familleA"
                                value={formData.familleA}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                        </div>

                        <div className="form-row-double">
                            <label>Article de</label>
                            <select 
                                name="articleDe"
                                value={formData.articleDe}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                            <span className="separator">à</span>
                            <select 
                                name="articleA"
                                value={formData.articleA}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                        </div>

                        <div className="form-row-double">
                            <label>N° fournisseur de</label>
                            <select 
                                name="fournisseurDe"
                                value={formData.fournisseurDe}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                            </select>
                            <span className="separator">à</span>
                            <select 
                                name="fournisseurA"
                                value={formData.fournisseurA}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
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

                    <div className="watermark">
                        <div className="watermark-text">TLP ACHAT(0)</div>
                        <div className="watermark-subtext">
                            Afficher les articles à inventorier par ordre de :
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-ok" onClick={handleSubmit}>
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