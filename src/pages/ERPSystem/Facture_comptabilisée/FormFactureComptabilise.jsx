
import React from 'react';

const FormFactureComptabilise = ({ formData, setFormData, isReadOnly = false }) => {
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateChange = (field) => {
        const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '');
        handleChange(field, today);
    };

    return (
        <div className="invoice-body container-fluid py-2">
            <div className="row g-2">
                {/* Colonne 1 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <label className='input-group-text custom-label'>Fournisseur</label>
                        <select 
                            className="form-select w-25"
                            disabled={isReadOnly}
                        >
                            <option>Numéro</option>
                        </select>
                        <input 
                            type="text" 
                            className="form-select flex-grow-1"
                            value={formData.fournisseur || ''}
                            onChange={(e) => handleChange('fournisseur', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Sélectionner un fournisseur"
                        />
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <label className='input-group-text custom-label'>Statut</label>
                        <select 
                            className="form-select"
                            value={formData.statut || 'A comptabiliser'}
                            onChange={(e) => handleChange('statut', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="A comptabiliser">A comptabiliser</option>
                            <option value="Comptabilisé">Comptabilisé</option>
                            <option value="Annulé">Annulé</option>
                        </select>
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Affaire</span>
                        <select 
                            className="form-select"
                            value={formData.affaire || ''}
                            onChange={(e) => handleChange('affaire', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option></option>
                            <option value="AFF001">Affaire 001</option>
                            <option value="AFF002">Affaire 002</option>
                        </select>
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Expédition</span>
                        <select 
                            className="form-select"
                            value={formData.expedition || ''}
                            onChange={(e) => handleChange('expedition', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option></option>
                            <option value="STANDARD">Standard</option>
                            <option value="EXPRESS">Express</option>
                        </select>
                    </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <label className="input-group-text custom-label">Date</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={formData.date || ''}
                            onChange={(e) => handleChange('date', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="jjmmaa"
                        />
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => handleDateChange('date')}
                            disabled={isReadOnly}
                        >
                            📅
                        </button>
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">N° document</span>
                        <select 
                            className="form-select w-25"
                            disabled={isReadOnly}
                        >
                            <option>N° Pièce</option>
                        </select>
                        <input 
                            type="text" 
                            className="form-control"
                            value={formData.numeroDocument || 'BC000001'}
                            onChange={(e) => handleChange('numeroDocument', e.target.value)}
                            disabled={isReadOnly}
                        />
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Date livraison</span>
                        <select 
                            className="form-select w-25"
                            disabled={isReadOnly}
                        >
                            <option>Prévue</option>
                            <option>Réelle</option>
                        </select>
                        <input 
                            type="text" 
                            className="form-control"
                            value={formData.dateLivraison || ''}
                            onChange={(e) => handleChange('dateLivraison', e.target.value)}
                            disabled={isReadOnly}
                        />
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => handleDateChange('dateLivraison')}
                            disabled={isReadOnly}
                        >
                            📅
                        </button>
                    </div>
                    
                    <div className="input-group input-group-sm mb-1 text-muted">
                        <span className="input-group-text custom-label bg-light">Info1</span>
                        <input 
                            type="text" 
                            className="form-control bg-light" 
                            disabled 
                            placeholder="Champ calculé automatiquement"
                        />
                    </div>
                </div>

                {/* Colonne 3 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <label className='input-group-text custom-label'>Acheteur</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={formData.acheteur || ''}
                            onChange={(e) => handleChange('acheteur', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Nom de l'acheteur"
                        />
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Référence</span>
                        <input 
                            type="text" 
                            className="form-control"
                            value={formData.reference || ''}
                            onChange={(e) => handleChange('reference', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Référence externe"
                        />
                    </div>
                    
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Entête 1</span>
                        <input 
                            type="text" 
                            className="form-control"
                            value={formData.entete1 || ''}
                            onChange={(e) => handleChange('entete1', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Texte d'en-tête"
                        />
                    </div>
                    
                    <div className="d-flex gap-2 align-items-center">
                        <div className="input-group input-group-sm flex-grow-1">
                            <span className="input-group-text custom-label bg-light">Info2</span>
                            <input 
                                type="text" 
                                className="form-control bg-light" 
                                disabled 
                                placeholder="Champ calculé"
                            />
                        </div>
                        <button 
                            className="btn btn-outline-primary btn-sm px-4"
                            disabled={isReadOnly}
                            title="Valider le formulaire"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </div>

            {/* Barre d'informations supplémentaires */}
            <div className="row mt-2">
                <div className="col-12">
                    <div style={{
                        padding: '8px',
                        background: '#e7f3ff',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#0078d4'
                    }}>
                        ℹ️ <strong>Aide:</strong> Remplissez tous les champs obligatoires avant d'ajouter des lignes au document
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormFactureComptabilise;