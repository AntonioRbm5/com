// DocumentModal.jsx
import React from 'react';

const DocumentModal = ({ document, onClose }) => {
    if (!document) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-window"
                style={{ minWidth: '900px', maxWidth: '95vw' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-title-bar">
                    <div className="modal-title">
                        <span className="icon-doc icon-blue"></span>
                        Facture : A comptabiliser N° {document.id} - {document.name}
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div style={{ padding: 0 }}>
                    <div className="toolbar">
                        <button className="toolbar-btn">
                            <span className="icon-save"></span> Enregistrer
                        </button>
                        <button className="toolbar-btn">
                            <span className="icon-print"></span> Imprimer
                        </button>
                        <button className="toolbar-btn">
                            <span className="icon-check"></span> Comptabiliser
                        </button>
                        <button className="toolbar-btn">Valider</button>
                    </div>

                    <div className="form-document">
                        <div className="form-header">
                            <div>
                                <div className="form-group">
                                    <label className="form-label">Client</label>
                                    <select className="form-control">
                                        <option>{document.client}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Statut</label>
                                    <select className="form-control">
                                        <option>A comptabiliser</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Affaire</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input type="text" className="form-control" value={document.date} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date livraison</label>
                                    <select className="form-control">
                                        <option>Prévue</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Représentant</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    <label className="form-label">N° document</label>
                                    <input type="text" className="form-control" value={document.id} readOnly />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Référence</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Entête 1</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                        </div>

                        <div className="items-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '120px' }}>Référence a...</th>
                                        <th>Désignation</th>
                                        <th style={{ width: '100px', textAlign: 'right' }}>P.U. HT</th>
                                        <th style={{ width: '80px', textAlign: 'right' }}>Quantité</th>
                                        <th style={{ width: '100px' }}>Conditionn...</th>
                                        <th style={{ width: '80px' }}>Remise</th>
                                        <th style={{ width: '100px', textAlign: 'right' }}>P.U. net</th>
                                        <th style={{ width: '120px', textAlign: 'right' }}>Montant HT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ORDP0007</td>
                                        <td>LENOVO THINKPAD P17</td>
                                        <td style={{ textAlign: 'right' }}>2 368 005</td>
                                        <td style={{ textAlign: 'right' }}>2,00</td>
                                        <td>PIECE</td>
                                        <td></td>
                                        <td style={{ textAlign: 'right' }}>2 368 005</td>
                                        <td style={{ textAlign: 'right' }}>4 736 010</td>
                                    </tr>
                                    <tr>
                                        <td>ORDB0006</td>
                                        <td>DELL PRECISION 3650 TOWER</td>
                                        <td style={{ textAlign: 'right' }}>944 578</td>
                                        <td style={{ textAlign: 'right' }}>5,00</td>
                                        <td>PIECE</td>
                                        <td></td>
                                        <td style={{ textAlign: 'right' }}>944 578</td>
                                        <td style={{ textAlign: 'right' }}>4 722 890</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="8" style={{ background: '#f0f0f0', padding: '4px' }}>
                                            <button
                                                className="btn-secondary"
                                                style={{ fontSize: '10px', padding: '2px 8px' }}
                                            >
                                                + Nouvelle ligne
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="form-footer">
                            <div>
                                <div>
                                    <strong>Poids net:</strong> 0
                                </div>
                                <div>
                                    <strong>Poids brut:</strong> 0
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div>
                                    <strong>Total HT:</strong> {document.ht}
                                </div>
                                <div style={{ fontSize: '13px', color: '#0066cc' }}>
                                    <strong>Montant TTC:</strong> {document.ttc}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="btn-secondary">Nouveau</button>
                        <button className="btn-primary">OK</button>
                        <button className="btn-secondary" onClick={onClose}>
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;