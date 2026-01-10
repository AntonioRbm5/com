// TransformModal.jsx
import React from 'react';

const TransformModal = ({ show, onClose, transformType, onTransformTypeChange }) => {
    if (!show) return null;

    const handleSubmit = () => {
        onClose();
        alert(`Document transformé en ${transformType}`);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title-bar">
                    <div className="modal-title">
                        <span className="icon-gear icon-blue"></span>
                        Transformation documents
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-section">
                        <div style={{ fontSize: '11px', marginBottom: '12px' }}>
                            Indiquer vers quel type transformer ce(s) document(s) :
                        </div>

                        <div className="radio-group">
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    name="transform"
                                    value="bon_commande"
                                    onChange={(e) => onTransformTypeChange(e.target.value)}
                                />
                                Bon de commande
                            </label>
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    name="transform"
                                    value="preparation"
                                    checked={transformType === 'preparation'}
                                    onChange={(e) => onTransformTypeChange(e.target.value)}
                                />
                                Préparation de livraison
                            </label>
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    name="transform"
                                    value="bon_livraison"
                                    onChange={(e) => onTransformTypeChange(e.target.value)}
                                />
                                Bon de livraison
                            </label>
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    name="transform"
                                    value="facture"
                                    onChange={(e) => onTransformTypeChange(e.target.value)}
                                />
                                Facture
                            </label>
                        </div>
                    </div>

                    <div className="modal-section">
                        <div className="modal-section-title">Paramètres du nouveau document</div>

                        <div className="form-group">
                            <label className="form-label">Statut</label>
                            <select className="form-control">
                                <option>A livrer</option>
                                <option>A préparer</option>
                                <option>A comptabiliser</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Souche</label>
                            <select className="form-control">
                                <option>N° Pièce</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">N° de pièce</label>
                            <input
                                type="text"
                                className="form-control"
                                value={transformType === 'facture' ? 'FACT0003' : 'BL00001'}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input type="text" className="form-control" value="070722" readOnly />
                        </div>
                    </div>

                    <div className="modal-section">
                        <div className="modal-section-title">Options de transformation</div>

                        <div className="form-group">
                            <label className="form-label">Mise à jour des cours</label>
                            <select className="form-control">
                                <option>Aucune</option>
                                <option>Automatique</option>
                            </select>
                        </div>

                        <label className="checkbox-item">
                            <input type="checkbox" />
                            Conserver le devis d'origine
                        </label>

                        <label className="checkbox-item">
                            <input type="checkbox" />
                            Mettre à jour les taux de taxes
                        </label>

                        <label className="checkbox-item">
                            <input type="checkbox" />
                            Recalculer le prix de vente
                        </label>

                        <label className="checkbox-item">
                            <input type="checkbox" />
                            Recalculer les frais d'expédition
                        </label>

                        <label className="checkbox-item">
                            <input type="checkbox" />
                            Appliquer les barèmes
                        </label>
                    </div>

                    <div className="modal-section">
                        <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                            Imprimer le document
                        </div>

                        <label className="checkbox-item">
                            <input type="checkbox" />
                            Valider la facture
                        </label>

                        <label className="checkbox-item">
                            <input type="checkbox" checked readOnly />
                            Ouvrir le document
                        </label>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={handleSubmit}>
                        OK
                    </button>
                    <button className="btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransformModal;