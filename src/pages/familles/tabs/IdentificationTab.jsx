


const IdentificationTab = ({ formData, handleInputChange = [] }) => {

    return (
        <>
            <div className="famille-form-section">
                <div className="famille-form-section-title">Identification</div>
                <div className="famille-form-row">
                    <div className="famille-form-group">
                        <label className="famille-form-label">Code</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.code || ''}
                            onChange={(e) => handleInputChange('code', e.target.value)}
                        />
                    </div>
                    <div className="famille-form-group">
                        <label className="famille-form-label">Type</label>
                        <select
                            className="famille-form-select"
                            value={formData.type || 'Standard'}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                        >
                            <option>Standard</option>
                            <option>Détail</option>
                        </select>
                    </div>
                </div>
                <div className="famille-form-row">
                    <div className="famille-form-group">
                        <label className="famille-form-label">Intitulé</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.famille_name || ''}
                            onChange={(e) => handleInputChange('famille_name', e.target.value)}
                        />
                    </div>
                </div>
                <div className="famille-form-row">
                    <div className="famille-form-group">
                        <label className="famille-form-label">Description</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.famille_description || ''}
                            onChange={(e) => handleInputChange('famille_description', e.target.value)}
                        />
                    </div>
                </div>
                <div className="famille-form-row">
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
                    <div className="famille-form-group">
                        <label className="famille-form-label">Coefficient</label>
                        <input type="text" className="form-input" value="Aucune" />
                    </div>
                </div>
                <div className="famille-form-row">
                    <div className="famille-form-group">
                        <label className="famille-form-label">Suivi de stock</label>
                        <select
                            className="famille-form-select"
                            value={formData.suiviStock || 'Aucun'}
                            onChange={(e) => handleInputChange('suiviStock', e.target.value)}
                        >
                            <option>Aucun</option>
                            <option>CMUP</option>
                            <option>FIFO</option>
                        </select>
                    </div>
                    <div className="famille-form-group">
                        <label className="famille-form-label">Famille centralisatrice</label>
                        <input type="text" className="form-input" value="Aucun" />
                    </div>
                </div>
            </div>

            <div className="famille-form-section">
                <div className="famille-form-section-title">Catalogue</div>
                <div className="famille-form-row">
                    <div className="famille-form-group">

                        <select
                            className="famille-form-select"
                            value={formData.catalogue || 'Aucun'}
                            onChange={(e) => handleInputChange('catalogue', e.target.value)}
                        >
                            <option value="aucun">Aucun</option>
                        </select>
                    </div>
                    <div className="famille-form-group">
                        <select
                            className="famille-form-select"
                            value={formData.catalogue || 'Aucun'}
                            onChange={(e) => handleInputChange('catalogue', e.target.value)}
                        >
                            <option value="aucun">Aucun</option>
                        </select>
                    </div>
                    <div className="famille-form-group">
                        <select
                            className="famille-form-select"
                            value={formData.catalogue || 'Aucun'}
                            onChange={(e) => handleInputChange('catalogue', e.target.value)}
                        >
                            <option value="aucun">Aucun</option>
                        </select>
                    </div>
                    <div className="famille-form-group">
                        <select
                            className="famille-form-select"
                            value={formData.catalogue || 'Aucun'}
                            onChange={(e) => handleInputChange('catalogue', e.target.value)}
                        >
                            <option value="aucun">Aucun</option>
                        </select>
                    </div>
                </div>


            </div>
            <div className="famille-form-section">
                <div className="famille-form-section-title">Description Complémentaire</div>
                <div className="famille-form-row">
                    <div className="famille-form-group">
                        <label className="famille-form-label">Code fiscal</label>
                        <input type="number" step="0.01" className="form-input" />
                    </div>
                    <div className="famille-form-group">
                        <label className="famille-form-label">Pays d'origine</label>
                        <select
                            className="famille-form-select"
                            value={formData.pays || 'France'}
                            onChange={(e) => handleInputChange('pays', e.target.value)}
                        >
                            <option value="france">France</option>
                            <option value="madagascar">Madagascar</option>
                        </select>
                    </div>
                </div>
            </div>


        </>
    );
};

export default IdentificationTab;