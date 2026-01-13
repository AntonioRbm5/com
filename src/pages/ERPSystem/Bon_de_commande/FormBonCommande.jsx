
import React from 'react';

const FormBonCommande = ({ onValidate, isReadOnly, headerRef, setHeaderRef, formData, setFormData }) => {
    const [localData, setLocalData] = React.useState({
        client: '123',
        statut: 'A préparer',
        date: '070722',
        dateLivraison: '',
        representant: '',
        numeroDocument: 'BC000001',
        affaire: '',
        expedition: '',
        entete1: ''
    });

    React.useEffect(() => {
        if (formData) {
            setLocalData(formData);
        }
    }, [formData]);

    const handleChange = (field, value) => {
        const newData = { ...localData, [field]: value };
        setLocalData(newData);
        if (setFormData) {
            setFormData(newData);
        }
    };

    return (
        <div className="invoice-body container-fluid py-2">
            <div className="row g-2">
                {/* Colonne 1 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Client</span>
                        <select
                            className="form-select w-25"
                            disabled={isReadOnly}
                        >
                            <option>Numéro</option>
                        </select>
                        <select
                            className="form-select flex-grow-1"
                            value={localData.client}
                            onChange={(e) => handleChange('client', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="123">Client 123</option>
                            <option value="456">Client 456</option>
                            <option value="789">Client 789</option>
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Statut</span>
                        <select
                            className="form-select"
                            value={localData.statut}
                            onChange={(e) => handleChange('statut', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option value="A préparer">A préparer</option>
                            <option value="En cours">En cours</option>
                            <option value="Préparé">Préparé</option>
                            <option value="Livré">Livré</option>
                        </select>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Affaire</span>
                        <select
                            className="form-select"
                            value={localData.affaire}
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
                            value={localData.expedition}
                            onChange={(e) => handleChange('expedition', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option></option>
                            <option value="STANDARD">Standard</option>
                            <option value="EXPRESS">Express</option>
                            <option value="URGENTE">Urgente</option>
                        </select>
                    </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Date</span>
                        <input
                            type="text"
                            className="form-control"
                            value={localData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="jjmmaa"
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => {
                                const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '');
                                handleChange('date', today);
                            }}
                        >
                            📅
                        </button>
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
                            value={localData.dateLivraison}
                            onChange={(e) => handleChange('dateLivraison', e.target.value)}
                            disabled={isReadOnly}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            disabled={isReadOnly}
                        >
                            📅
                        </button>
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Représentant</span>
                        <select
                            className="form-select"
                            value={localData.representant}
                            onChange={(e) => handleChange('representant', e.target.value)}
                            disabled={isReadOnly}
                        >
                            <option></option>
                            <option value="REP001">Représentant 1</option>
                            <option value="REP002">Représentant 2</option>
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
                        <select
                            className="form-select w-25"
                            disabled={isReadOnly}
                        >
                            <option>N° Pièce</option>
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            value={localData.numeroDocument}
                            onChange={(e) => handleChange('numeroDocument', e.target.value)}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Référence</span>
                        <input
                            type="text"
                            className="form-control"
                            value={headerRef}
                            onChange={(e) => setHeaderRef(e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Référence du bon de commande"
                        />
                    </div>

                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Entête 1</span>
                        <input
                            type="text"
                            className="form-control"
                            value={localData.entete1}
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
                            disabled={isReadOnly}
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
                            ⚠️ <strong>Attention:</strong> Veuillez valider le bon de commande avant d'ajouter des lignes
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