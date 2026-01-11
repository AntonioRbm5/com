import '../InvoiceForm.css';
const BonCommande = ({ onClose }) => {
    return (
        <div>
            <div className="invoice-wrapper">
                {/* Header */}
                <div className="invoice-header">
                    <div className="header-left">
                        <span className="header-icon">📄</span>
                        <h2 className="header-title">
                            Bon de commande: A préparer N° BC00001
                        </h2>
                    </div>
                    <div className="header-controls">
                        <button className="control-btn">−</button>
                        <button className="control-btn">□</button>
                        <button onClick={onClose} className="control-btn">×</button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="invoice-toolbar">
                    <button className="toolbar-btn">⚙ Fonctions</button>
                    <button className="toolbar-btn">📊 Barèmes</button>
                    <button className="toolbar-btn">ℹ Informations</button>
                    <button className="toolbar-btn">📎 Pied</button>
                    <button className="toolbar-btn">🖨 Imprimer</button>
                    <button className="toolbar-btn">💰 Comptabiliser</button>
                    <button className="toolbar-btn">🔄 Transformer</button>
                    <button className="toolbar-btn">📋 Traçabilité</button>
                </div>

                {/* Form content */}
                <div className="invoice-body">
                    <div className="form-grid">
                        <div>
                            <div className="form-row">
                                <label>Client</label>
                                <select className="input-field w-120">
                                    <option>Numéro</option>
                                </select>
                                <input type="text" className="input-field input-flex" />
                            </div>
                            <div className="form-row">
                                <label>Statut</label>
                                <select className="input-field w-120">
                                    <option>A préparer</option>
                                </select>
                                <input type="text" className="input-field input-flex" />
                            </div>
                            <div className="form-row">
                                <label>Affaire</label>
                                <input type="text" className="input-field input-flex" />
                            </div>
                            <div className="form-row">
                                <label>Expédition</label>
                                <input type="text" className="input-field input-flex" />
                            </div>
                        </div>

                        <div>
                            <div className="form-row">
                                <label>Date</label>
                                <input type="date" defaultValue="070722" className="input-field w-100" />
                                <label className="label-right">N° document</label>
                                <select className="input-field w-120">
                                    <option>N° Pièce</option>
                                </select>
                                <input type="text" defaultValue="2" className="input-field w-60" />
                            </div>
                            <div className="form-row">
                                <label>Date livraison</label>
                                <select className="input-field w-100">
                                    <option>Prévue</option>
                                </select>
                                <input type="date" className="input-field input-flex" />
                            </div>
                            <div className="form-row">
                                <label>Représentant</label>
                                <input type="text" className="input-field input-flex" />
                            </div>
                            <div className="form-row">
                                <label>N° document</label>
                                <input type="text" className="input-field w-150" />
                                <label className="label-right">N° Pièce</label>
                                <input type="text" className="input-field input-flex" />
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="info-box">Info1</div>
                        <div className="info-box">Info2</div>
                        <button className="btn-validate">Valider</button>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <div className="table-scroll">
                            <table className="invoice-table">
                                <thead>
                                    <tr>
                                        <th>Référence a...</th>
                                        <th>Référence f...</th>
                                        <th>Désignation</th>
                                        <th className="text-right">P.U. HT</th>
                                        <th className="text-right">Qté colisée</th>
                                        <th>Conditionn...</th>
                                        <th className="text-right">Remise</th>
                                        <th className="text-right">P.U. net</th>
                                        <th className="text-right">Montant HT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="9" className="empty-row-text">
                                            Aucune ligne de document
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-actions">
                            <button className="btn-action">Nouveau</button>
                            <button className="btn-action btn-delete" disabled>Supprimer</button>
                            <button className="btn-action">Enregistrer</button>
                        </div>
                    </div>

                    {/* Footer summary */}
                    <div className="summary-footer">
                        <div className="summary-card">
                            <div className="summary-row">
                                <span className="summary-label">Poids net</span>
                                <span>0</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Poids brut</span>
                                <span>0</span>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="text-right">
                                <span>Total HT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BonCommande