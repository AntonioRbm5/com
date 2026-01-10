// PurchasesView.jsx
import React from 'react';

const PurchasesView = ({ documents }) => {
    return (
        <>
            <div style={{ padding: '12px', background: '#f0f0f0', borderBottom: '1px solid #c0c0c0' }}>
                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    <strong>Documents en cours</strong>
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
                            <th>N° fournisseur</th>
                            <th>Intitulé fournisseur</th>
                            <th style={{ textAlign: 'right' }}>Hors taxe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc.id}>
                                <td>
                                    <span style={{ color: '#0078d7' }}>📋</span>
                                </td>
                                <td>
                                    <span className="status-badge status-to-account">A comptabil...</span>
                                </td>
                                <td>{doc.id}</td>
                                <td>{doc.date}</td>
                                <td>{doc.supplier}</td>
                                <td>{doc.name}</td>
                                <td style={{ textAlign: 'right' }}>{doc.ht}</td>
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

export default PurchasesView;