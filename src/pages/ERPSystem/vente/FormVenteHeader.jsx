import React from 'react';

const FormVenteHeader = ({
    onValidate,
    formData,
    setFormData,
    clients = [],
    users = [],
    venteStatuses = [],
    modesPaiement = [],
    isReadOnly = false
}) => {
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

    const handleClientChange = (e) => {
        const clientId = e.target.value;

        if (!clientId) {
            setFormData(prev => ({
                ...prev,
                client_id: '',
                client_name: ''
            }));
            return;
        }

        const client = clients.find(c => String(c.client_id) === String(clientId));

        setFormData(prev => ({
            ...prev,
            client_id: clientId,
            client_name: client?.client_name || ''
        }));
    };

    return (
        <div className="invoice-body container-fluid py-2">
            <div className="row g-2">
                {/* Colonne 1 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <label className='input-group-text custom-label'>Client</label>
                        <select
                            className="form-select"
                            value={formData.client_id || ''}
                            onChange={handleClientChange}
                            disabled={isReadOnly}
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map((c, index) => (
                                <option
                                    key={c.client_id ?? `client-${index}`}
                                    value={c.client_id ?? ''}
                                >
                                    {c.client_name ?? 'Client sans nom'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <label className='input-group-text custom-label'>Statut</label>
                        <select
                            className="form-select"
                            value={formData.status_id || ''}
                            onChange={(e) => handleChange('status_id', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="">Sélectionner un statut</option>
                            {venteStatuses.map((status) => (
                                <option key={status.vente_status_id} value={status.vente_status_id}>
                                    {status.vente_status_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Vendeur</span>
                        <select
                            className="form-select"
                            value={formData.user_id || ''}
                            onChange={(e) => handleChange('user_id', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="">Sélectionner un vendeur</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Mode paiement</span>
                        <select
                            className="form-select"
                            value={formData.mode_paiement_id || ''}
                            onChange={(e) => handleChange('mode_paiement_id', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="">Sélectionner un mode</option>
                            {modesPaiement.map((mode) => (
                                <option key={mode.mode_paiement_id} value={mode.mode_paiement_id}>
                                    {mode.mode_paiement_libelle}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <label className="input-group-text custom-label">Date vente</label>
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
                        <span className="input-group-text custom-label">N° vente</span>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.numeroVente || 'VEN000001'}
                            onChange={(e) => handleChange('numeroVente', e.target.value)}
                            disabled={isReadOnly}
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

                    <div className="input-group input-group-sm mb-1 text-muted">
                        <span className="input-group-text custom-label bg-light">Total HT</span>
                        <input
                            type="text"
                            className="form-control bg-light"
                            disabled
                            value={formData.totalHT || '0.00'}
                        />
                    </div>
                </div>

                {/* Colonne 3 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <label className='input-group-text custom-label'>Code validation</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.validationCode || ''}
                            onChange={(e) => handleChange('validationCode', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Code de validation"
                        />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Remise globale</span>
                        <div className="form-check form-switch ms-3 d-flex align-items-center">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.vente_has_discount || false}
                                onChange={(e) => handleChange('vente_has_discount', e.target.checked)}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Notes</span>
                        <textarea
                            className="form-control"
                            value={formData.notes || ''}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Notes internes"
                            rows="2"
                        />
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                        <div className="input-group input-group-sm flex-grow-1">
                            <span className="input-group-text custom-label bg-light">Total TTC</span>
                            <input
                                type="text"
                                className="form-control bg-light"
                                disabled
                                value={formData.totalTTC || '0.00'}
                            />
                        </div>
                        <button
                            className="btn btn-outline-primary btn-sm px-4"
                            onClick={onValidate}
                            disabled={isReadOnly}
                            title="Valider le bon de commande pour pouvoir ajouter des lignes"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </div>

            {/* Barre d'informations */}
            <div className="row mt-2">
                <div className="col-12">
                    <div style={{
                        padding: '8px',
                        background: '#e7f3ff',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#0078d4'
                    }}>
                        ℹ️ <strong>Aide:</strong> Sélectionnez un client et ajoutez des articles avant de valider la vente
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormVenteHeader;