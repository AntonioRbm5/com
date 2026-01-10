// InventoryView.jsx
import React from 'react';

const InventoryView = ({ inventory }) => {
    return (
        <>
            <div style={{ padding: '16px', background: 'white' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '16px' }}>
                    Saisie inventaire au 07/07/22 : SIEGE
                </h3>

                <div style={{ marginBottom: '16px' }}>
                    <button className="btn-primary">Nouveau</button>
                    <button className="btn-secondary" style={{ marginLeft: '8px' }}>
                        Enregistrer
                    </button>
                </div>

                <table className="document-table">
                    <thead>
                        <tr>
                            <th>Référence a...</th>
                            <th>Désignation</th>
                            <th style={{ textAlign: 'right' }}>Quantité</th>
                            <th style={{ textAlign: 'right' }}>PR unitaire</th>
                            <th style={{ textAlign: 'right' }}>Valeur</th>
                            <th>Conditionn...</th>
                            <th style={{ textAlign: 'right' }}>Qté ajustée</th>
                            <th style={{ textAlign: 'right' }}>PR ajusté</th>
                            <th style={{ textAlign: 'right' }}>Valeur ajustée</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.ref}>
                                <td>{item.ref}</td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'right' }}>{item.qty}</td>
                                <td style={{ textAlign: 'right' }}>{item.pu}</td>
                                <td style={{ textAlign: 'right' }}>{item.value}</td>
                                <td>PIECE</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button className="btn-secondary">Fermer</button>
            </div>
        </>
    );
};

export default InventoryView;