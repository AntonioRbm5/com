

import React from 'react';

const ListBonCommande = ({ lignes = [], onDeleteLigne, isReadOnly = false }) => {
    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="table-container">
            <div className="table-scroll">
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Référence</th>
                            <th>Désignation</th>
                            <th className="text-right" style={{ width: '100px' }}>P.U. HT</th>
                            <th className="text-right" style={{ width: '80px' }}>Quantité</th>
                            <th style={{ width: '100px' }}>Conditionn...</th>
                            <th className="text-right" style={{ width: '80px' }}>Remise %</th>
                            <th className="text-right" style={{ width: '100px' }}>Total Brut</th>
                            <th className="text-right" style={{ width: '100px' }}>Montant HT</th>
                            <th style={{ width: '80px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lignes.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="empty-row-text" style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#999',
                                    fontStyle: 'italic'
                                }}>
                                    {isReadOnly
                                        ? 'Veuillez valider le bon de commande pour ajouter des lignes'
                                        : 'Aucune ligne de document'}
                                </td>
                            </tr>
                        ) : (
                            lignes.map((ligne, index) => (
                                <tr key={index} style={{
                                    background: index % 2 === 0 ? '#fff' : '#f9f9f9'
                                }}>
                                    <td>{ligne.ref || '-'}</td>
                                    <td>{ligne.designation || '-'}</td>
                                    <td className="text-right">{formatCurrency(ligne.puht)}</td>
                                    <td className="text-right">{formatCurrency(ligne.qte)}</td>
                                    <td>{ligne.conditionner || 'PIECE'}</td>
                                    <td className="text-right">{ligne.remise || '0'}%</td>
                                    <td className="text-right">{formatCurrency(ligne.totalBrut)}</td>
                                    <td className="text-right" style={{ fontWeight: '500' }}>
                                        {formatCurrency(ligne.montantNet)}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            style={{ fontSize: '10px', padding: '2px 8px' }}
                                            onClick={() => onDeleteLigne(index)}
                                            title="Supprimer cette ligne"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                    {lignes.length > 0 && (
                        <tfoot style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'right', padding: '12px' }}>
                                    TOTAL:
                                </td>
                                <td className="text-right">
                                    {formatCurrency(
                                        lignes.reduce((sum, l) => sum + parseFloat(l.montantNet || 0), 0)
                                    )}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <div className="table-actions">
                <button
                    className="btn-action"
                    disabled={isReadOnly}
                    title={isReadOnly ? 'Veuillez valider le document' : 'Ajouter une ligne'}
                >
                    Nouveau
                </button>
                <button
                    className="btn-action btn-delete"
                    disabled={lignes.length === 0}
                >
                    Supprimer
                </button>
                <button
                    className="btn-action"
                    disabled={lignes.length === 0}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default ListBonCommande;