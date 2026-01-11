import React from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
const InvoiceForm = ({ onClose }) => {
    return (
        <div>
            <div className="invoice-wrapper">
                {/* Header */}
                <DocumentHeader
                    title="Facture : A comptabiliser N° 2"
                    onClose={onClose}
                />

                {/* Toolbar */}
                <DocumentToolbar />

                {/* Form content */}
                <div className="invoice-body">
                    <div className="invoice-body container-fluid py-2">
                        <div className="row g-2">
                            <div className="col-md-4">
                                <div className="input-group input-group-sm mb-1">
                                    <label className='input-group-text custom-label'>Fournisseur</label>
                                    <select className="form-select w-25">
                                        <option>Numéro</option>
                                    </select>
                                    <input type="text" className="form-select flex-grow-1" />
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <label className='input-group-text custom-label'>Statut</label>
                                    <select className="form-select w-25">
                                        <option>A comptabiliser</option>
                                    </select>
                                    <input type="text" className="form-select flex-grow-1" />
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text custom-label">Affaire</span>
                                    <select className="form-select"><option></option></select>
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text custom-label">Expédition</span>
                                    <select className="form-select"><option></option></select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="input-group input-group-sm mb-1">
                                    <label className="input-group-text custom-label">Date</label>
                                    <input type="text" defaultValue="070722" className="form-control" />
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text custom-label">N° document</span>
                                    <select className="form-select w-25"><option>N° Pièce</option></select>
                                    <input type="text" className="form-control" defaultValue="BC000001" />
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text custom-label">Date livraison</span>
                                    <select className="form-select w-25"><option>Prévue</option></select>
                                    <input type="text" className="form-control" />
                                    <button className="btn btn-outline-secondary" type="button">📅</button>
                                </div>
                                <div className="input-group input-group-sm mb-1 text-muted">
                                    <span className="input-group-text custom-label bg-light">Info1</span>
                                    <input type="text" className="form-control bg-light" disabled />
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="input-group input-group-sm mb-1">
                                    <label className='input-group-text custom-label'>Acheteur</label>
                                    <input type="text" className="input-field input-flex" />
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text custom-label">Référence</span>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text custom-label">Entête 1</span>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <div className="input-group input-group-sm flex-grow-1">
                                        <span className="input-group-text custom-label bg-light">Info2</span>
                                        <input type="text" className="form-control bg-light" disabled />
                                    </div>
                                    <button className="btn btn-outline-primary btn-sm px-4">Valider</button>
                                </div>
                            </div>
                        </div>

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
                    <DocumentFooter />
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;