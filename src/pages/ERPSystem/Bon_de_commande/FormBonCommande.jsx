import React from 'react';

const FormBonCommande = ({ formData, setFormData, clients = [], onValidate, isReadOnly }) => {
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateChange = (field) => {
        const today = new Date().toISOString().split('T')[0];
        handleChange(field, today);
    };

    const statutOptions = [
        { id: 1, label: 'A préparer' },
        { id: 2, label: 'En cours' },
        { id: 3, label: 'Préparé' },
        { id: 4, label: 'Livré' }
    ];

    const expeditionOptions = [
        { value: 'STANDARD', label: 'Standard' },
        { value: 'EXPRESS', label: 'Express' },
        { value: 'URGENTE', label: 'Urgente' }
    ];

    return (
        <div className="invoice-body container-fluid py-2">
            <div className="row g-2">
                {/* Colonne 1 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Client</span>
                        <select
                            className="form-select"
                            value={formData.commande_client_id || ''}
                            onChange={(e) => handleChange('commande_client_id', e.target.value)}
                            disabled={isReadOnly}
                            required
                        >
                            <option value="">-- Sélectionner un client --</option>
                            {clients.map((client) => (
                                <option key={client.client_id} value={client.client_id}>
                                    {client.client_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Statut</span>
                        <select
                            className="form-select"
                            value={formData.commande_status_id || 1}
                            onChange={(e) => handleChange('commande_status_id', e.target.value)}
                            disabled={isReadOnly}
                        >
                            {statutOptions.map((statut) => (
                                <option key={statut.id} value={statut.id}>
                                    {statut.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Affaire</span>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.affaire || ''}
                            onChange={(e) => handleChange('affaire', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Référence affaire"
                        />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Expédition</span>
                        <select
                            className="form-select"
                            value={formData.expedition || ''}
                            onChange={(e) => handleChange('expedition', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="">-- Sélectionner --</option>
                            {expeditionOptions.map((exp) => (
                                <option key={exp.value} value={exp.value}>
                                    {exp.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Date</span>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.date || ''}
                            onChange={(e) => handleChange('date', e.target.value)}
                            disabled={isReadOnly}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => handleDateChange('date')}
                        >
                            📅
                        </button>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Date livraison</span>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.dateLivraison || ''}
                            onChange={(e) => handleChange('dateLivraison', e.target.value)}
                            disabled={isReadOnly}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => handleDateChange('dateLivraison')}
                        >
                            📅
                        </button>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Mode paiement</span>
                        <select
                            className="form-select"
                            value={formData.mode_paiement_id || ''}
                            onChange={(e) => handleChange('mode_paiement_id', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="">-- Sélectionner --</option>
                            <option value="1">Espèces</option>
                            <option value="2">Chèque</option>
                            <option value="3">Virement</option>
                            <option value="4">Carte bancaire</option>
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1 text-muted">
                        <span className="input-group-text custom-label bg-light">Info1</span>
                        <input
                            type="text"
                            className="form-control bg-light"
                            disabled
                            placeholder="Informations calculées"
                        />
                    </div>
                </div>

                {/* Colonne 3 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">N° document</span>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.reference || 'Nouveau'}
                            disabled
                            readOnly
                        />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Référence</span>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.reference || ''}
                            disabled
                            readOnly
                            placeholder="Sera généré automatiquement"
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
                                placeholder="Informations supplémentaires"
                            />
                        </div>
                        <button
                            className="btn btn-outline-primary btn-sm px-4"
                            onClick={onValidate}
                            disabled={isReadOnly || !formData.commande_client_id}
                            title="Valider le bon de commande pour pouvoir ajouter des lignes"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </div>

            {/* Message d'information */}
            {!isReadOnly && (
                <div className="row mt-2">
                    <div className="col-12">
                        <div style={{
                            padding: '8px',
                            background: '#fff3cd',
                            borderLeft: '4px solid #ffc107',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#856404'
                        }}>
                            ⚠️ <strong>Attention:</strong> Veuillez sélectionner un client et valider le bon de commande avant d'ajouter des lignes
                        </div>
                    </div>
                </div>
            )}

            {isReadOnly && (
                <div className="row mt-2">
                    <div className="col-12">
                        <div style={{
                            padding: '8px',
                            background: '#d4edda',
                            borderLeft: '4px solid #28a745',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#155724'
                        }}>
                            ✓ <strong>Bon de commande validé</strong> - Vous pouvez maintenant ajouter des lignes
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormBonCommande;