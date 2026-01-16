
import React, { useState } from 'react';
import './stock.css';

const ITEMS_PER_PAGE = 12;

// Fonctions utilitaires pour le formatage
const formatDate = (dateStr) => {
    if (!dateStr) return '';

    // Si format DDMMYY (6 chiffres)
    if (dateStr.length === 6) {
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 6);
        return `${day}/${month}/${year}`;
    }

    // Si format YYYY-MM-DD
    if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    return dateStr;
};

const formatNumber = (num) => {
    if (!num && num !== 0) return '0.00';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return number.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ApercuImpressionModal = ({ show, onHide, data }) => {
    const [currentPage, setCurrentPage] = useState(1);

    if (!show || !data) return null;

    const mouvements = data?.lignes || [];
    const totalStock = mouvements.reduce((sum, m) => sum + (parseFloat(m.montantHT) || 0), 0);

    return (
        <div className="mouvement-modal-overlay">
            <div className="mouvement-modal-container apercu-modal-container">
                <div className="mouvement-modal-header">
                    <span className="mouvement-modal-title">
                        Aperçu avant impression Mouvements de stock
                    </span>
                    <button className="close-btn" onClick={onHide}>×</button>
                </div>

                <div className="apercu-content">
                    <div className="apercu-page">
                        <div className="apercu-header">
                            <div className="apercu-company-name">LES ASSOCIES</div>
                            <div style={{ fontSize: '9px' }}>
                                100 - Gestion commerciale Réservée aux 8.50
                                <br />
                                Depuis le compte : PCDFA
                            </div>
                            <div className="apercu-doc-title">Mouvements de stock</div>

                            <div style={{ textAlign: 'right', fontSize: '9px' }}>
                                Période du : {formatDate(periode.du)} au {formatDate(periode.au)}
                            </div>
                        </div>

                        <table className="apercu-table">
                            <thead>
                                <tr>
                                    <th>Date<br />mouv.</th>
                                    <th>Type<br />mouv.</th>
                                    <th>N°<br />pièce</th>
                                    <th>Référence<br />Tiers</th>
                                    <th style={{ width: '25%' }}>Quantité en stock<br />+/- | Solde</th>
                                    <th>P.R<br />unitaire</th>
                                    <th>Stock<br />permanent</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    <td colSpan="7">
                                        <strong>IMPRIMANTE</strong>
                                    </td>
                                </tr>
                                {mouvements.slice(0, 8).map((mouv, idx) => {
                                    const references = [
                                        'IMPR0001',
                                        'IMPR0001',
                                        'IMPR0002',
                                        'IMPR0003',
                                        'IMPR0004',
                                        'IMPR0005',
                                        'IMPR0006',
                                        'IMPR0007'
                                    ];
                                    const designations = [
                                        'HP MULTIFONCTION LASERJET M443nda',
                                        'HP LASERJET PRO M404dn',
                                        'HP DESIGNJET STUDIO METAL 36 POUCES',
                                        'CANON PIXMA G7050',
                                        'CANON MAXIFY GX7050',
                                        'EPSON ET 85000',
                                        'EPSON SC T3100M',
                                        'HP Z6 G4'
                                    ];

                                    return (
                                        <React.Fragment key={idx}>
                                            <tr>
                                                <td>010722</td>
                                                <td>ME<br />Total</td>
                                                <td>SI<br />{references[idx]}</td>
                                                <td>{designations[idx]}</td>
                                                <td>
                                                    13.00 | 13.00<br />
                                                    13.00
                                                </td>
                                                <td>603 480</td>
                                                <td>
                                                    7 845 240<br />
                                                    7 845 240
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}

                                <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                    <td colSpan="2">Total</td>
                                    <td>ME<br />SIEGE</td>
                                    <td></td>
                                    <td>47.00<br />47.00</td>
                                    <td></td>
                                    <td>33 627 885<br />33 627 885</td>
                                </tr>

                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    <td colSpan="7">
                                        <strong>ORDINATEUR DE BUREAU</strong>
                                    </td>
                                </tr>

                                {[
                                    { ref: 'ORDB0001', design: 'HP 260 G4T', qty: '4.00', pu: '546 930', total: '1 369 122' },
                                    { ref: 'ORDB0002', design: 'HP PRODESK 400 G7', qty: '6.00', pu: '696 907', total: '3 341 842' },
                                    { ref: 'ORDB0003', design: 'DELL PEDESK 405 G6', qty: '2.00', pu: '634 605', total: '1 009 210' },
                                    { ref: 'ORDB0004', design: 'HP Z4 G4 05', qty: '3.00', pu: '1 422 878', total: '3 768 634' }
                                ].map((item, idx) => (
                                    <tr key={`ordb-${idx}`}>
                                        <td>010722</td>
                                        <td>ME<br />Total</td>
                                        <td>SI<br />{item.ref}</td>
                                        <td>{item.design}</td>
                                        <td>
                                            {item.qty} | {item.qty}<br />
                                            {item.qty}
                                        </td>
                                        <td>{item.pu}</td>
                                        <td>
                                            {item.total}<br />
                                            {item.total}
                                        </td>
                                    </tr>
                                ))}

                                <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                    <td colSpan="7" style={{ textAlign: 'right', padding: '10px' }}>
                                        A reporter : 85 658 085
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="apercu-footer-info">
                            <div>
                                <strong>03-_CREATION_DE_CATALOGUES_ET_SAISIE_DU_STOCK_INITIAL(0)</strong>
                            </div>
                            <div>
                                <strong>Page : 1</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="apercu-pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        ◀ Précédent
                    </button>
                    <span>Page {currentPage} sur 1</span>
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage >= 1}
                    >
                        Suivant ▶
                    </button>
                </div>

                <div className="mouvement-modal-footer">
                    <button className="btn-custom btn-primary-custom" onClick={onHide}>
                        Imprimer
                    </button>
                    <button className="btn-custom btn-secondary-custom" onClick={onHide}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ApercuImpressionModal;