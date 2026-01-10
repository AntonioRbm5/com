// SalesView.jsx
import React from 'react';

const SalesView = ({ documents, onDocumentClick }) => {
    return (
        <>
            <div style={{ padding: '12px', background: '#f0f0f0', borderBottom: '1px solid #c0c0c0' }}>
                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    <strong>Documents en cours</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher des mots dans la liste..."
                        style={{ maxWidth: '400px' }}
                    />
                </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                <table className="document-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Statut</th>
                            <th>N° pièce</th>
                            <th>Date</th>
                            <th>N° client</th>
                            <th>Intitulé client</th>
                            <th>Souche</th>
                            <th style={{ textAlign: 'right' }}>Hors taxe</th>
                            <th style={{ textAlign: 'right' }}>Total TTC</th>
                            <th style={{ textAlign: 'right' }}>Solde dû</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc.id} onClick={() => onDocumentClick(doc)}>
                                <td>
                                    <span style={{ color: '#ff6600' }}>●</span>
                                </td>
                                <td>
                                    <span className="status-badge status-to-account">{doc.status}</span>
                                </td>
                                <td>{doc.id}</td>
                                <td>{doc.date}</td>
                                <td>{doc.client}</td>
                                <td>{doc.name}</td>
                                <td>N° Pièce</td>
                                <td style={{ textAlign: 'right' }}>{doc.ht}</td>
                                <td style={{ textAlign: 'right' }}>{doc.ttc}</td>
                                <td style={{ textAlign: 'right' }}>{doc.ttc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button className="btn-primary">Ouvrir</button>
                <button className="btn-secondary">Nouveau</button>
                <button className="btn-secondary">Supprimer</button>
                <button className="btn-secondary">Fermer</button>
            </div>
        </>
    );
};

export default SalesView;