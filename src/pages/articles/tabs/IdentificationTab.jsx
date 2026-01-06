
import React from 'react';
import CategoriesTable from './CategoriesTable';

const IdentificationTab = ({ formData, handleInputChange }) => {
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
                            value={formData.reference || ''}
                            onChange={(e) => handleInputChange('reference', e.target.value)}
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
                            value={formData.designation || ''}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Famille</label>
                        <select
                            value={formData.famille || ''}
                            onChange={(e) => handleInputChange('famille', e.target.value)}
                        >
                            <option value="">-- Sélectionner --</option>
                            <option value="IMPR">IMPR IMPRIMANTE</option>
                            <option value="ORDB">ORDB ORDINATEUR DE BUREAU</option>
                            <option value="ORDP">ORDP ORDINATEUR PORTABLE</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nomendature</label>
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
            </div>
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

            <div className="form-section">
                
                <div className="form-row">
                   <CategoriesTable/>
                </div>
            </div>
        </>
    );
};

export default IdentificationTab;
