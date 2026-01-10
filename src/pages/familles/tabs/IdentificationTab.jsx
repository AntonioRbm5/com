
import React from 'react';
import CategoriesTable from './CategoriesTable';

const IdentificationTab = ({ formData, handleInputChange, familles = [] }) => {
    return (
        <>
            <div className="form-section">
                <div className="form-section-title">Identification</div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Référence</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.article_reference || ''}
                            onChange={(e) => handleInputChange('article_reference', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                            className="form-select"
                            value={formData.type || 'Standard'}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                        >
                            <option>Standard</option>
                            <option>Détail</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Désignation</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.article_name || ''}
                            onChange={(e) => handleInputChange('article_name', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Famille</label>
                        <select
                            className="form-select"
                            value={formData.famille_id || ''}
                            onChange={(e) => handleInputChange('famille_id', parseInt(e.target.value))}
                        >
                            <option value="">-- Sélectionner --</option>
                            {familles.map(famille => (
                                <option key={famille.famille_id} value={famille.famille_id}>
                                    {famille.famille_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nomenclature</label>
                        <input type="text" className="form-input" value="Aucune" disabled />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Suivi de stock</label>
                        <select
                            className="form-select"
                            value={formData.suiviStock || 'Aucun'}
                            onChange={(e) => handleInputChange('suiviStock', e.target.value)}
                        >
                            <option>Aucun</option>
                            <option>CMUP</option>
                            <option>FIFO</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Conditionnement</label>
                        <input type="text" className="form-input" value="Aucun" disabled />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            rows="3"
                            value={formData.article_description || ''}
                            onChange={(e) => handleInputChange('article_description', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <label className="form-checkbox-label">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={formData.article_is_serialized || false}
                            onChange={(e) => handleInputChange('article_is_serialized', e.target.checked)}
                        />
                        Article sérialisé
                    </label>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">Tarif</div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Prix d'achat</label>
                        <input type="number" step="0.01" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Dernier Prix d'achat</label>
                        <input type="number" step="0.01" className="form-input" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Nomenclature</label>
                        <input type="text" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Coût standard</label>
                        <input type="number" step="0.01" className="form-input" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Prix de vente</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            value={formData.article_prix_vente || ''}
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

            <div className="form-section">
                <div className="form-row">
                    <CategoriesTable />
                </div>
            </div>
        </>
    );
};

export default IdentificationTab;