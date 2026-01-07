// import React, { useState } from 'react'
// import './stock.css';

// const ITEMS_PER_PAGE = 12;

// const ApercuImpressionModal = ({ show, onHide, data }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     if (!show || !data) return null;

//     const { entreprise, periode, articles, totalGeneral } = data;

//     const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
//     const paginatedArticles = articles.slice(
//         (currentPage - 1) * ITEMS_PER_PAGE,
//         currentPage * ITEMS_PER_PAGE
//     );

//     return (
//         <div className="mouvement-modal-overlay">
//             <div className="mouvement-modal-container apercu-modal-container">

//                 {/* HEADER */}
//                 <div className="mouvement-modal-header">
//                     <span className="mouvement-modal-title">
//                         Aperçu avant impression – Mouvements de stock
//                     </span>
//                     <button className="close-btn" onClick={onHide}>×</button>
//                 </div>

//                 <div className="apercu-content">
//                     <div className="apercu-page">

//                         {/* INFOS ENTREPRISE */}
//                         <div className="apercu-header">
//                             <div className="apercu-company-name">{entreprise.nom}</div>
//                             <div style={{ fontSize: '9px' }}>
//                                 Gestion commerciale
//                                 <br />
//                                 Depuis le compte : {entreprise.depot}
//                             </div>

//                             <div className="apercu-doc-title">Mouvements de stock</div>

//                             <div style={{ textAlign: 'right', fontSize: '9px' }}>
//                                 Période du : {periode.du} au {periode.au}
//                             </div>
//                         </div>

//                         <table className="apercu-table">
//                             <thead>
//                                 <tr>
//                                     <th>Date</th>
//                                     <th>Type</th>
//                                     <th>Pièce</th>
//                                     <th>Désignation</th>
//                                     <th>Qté | Solde</th>
//                                     <th>P.U</th>
//                                     <th>Total</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {paginatedArticles.map((cat, idx) => (
//                                     <React.Fragment key={idx}>

//                                         {/* CATEGORIE */}
//                                         <tr style={{ background: '#f5f5f5' }}>
//                                             <td colSpan="7"><strong>{cat.categorie}</strong></td>
//                                         </tr>

//                                         {/* MOUVEMENTS */}
//                                         {cat.mouvements.map((m, i) => (
//                                             <tr key={i}>
//                                                 <td>{formatDate(m.date)}</td>
//                                                 <td>{m.type}</td>
//                                                 <td>{m.piece}</td>
//                                                 <td>{m.designation}</td>
//                                                 <td>{m.qte} | {m.qte}</td>
//                                                 <td>{formatNumber(m.pu)}</td>
//                                                 <td>{formatNumber(m.total)}</td>
//                                             </tr>
//                                         ))}

//                                     </React.Fragment>
//                                 ))}

//                                 {/* TOTAL */}
//                                 <tr style={{ fontWeight: 'bold', background: '#eee' }}>
//                                     <td colSpan="6" style={{ textAlign: 'right' }}>
//                                         Total général
//                                     </td>
//                                     <td>{formatNumber(totalGeneral)}</td>
//                                 </tr>

//                             </tbody>
//                         </table>

//                         <div className="apercu-footer-info">
//                             <strong>Page {currentPage} / {totalPages}</strong>
//                         </div>
//                     </div>
//                 </div>

//                 {/* PAGINATION */}
//                 <div className="apercu-pagination">
//                     <button
//                         onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                         disabled={currentPage === 1}
//                     >
//                         ◀ Précédent
//                     </button>

//                     <button
//                         onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                         disabled={currentPage === totalPages}
//                     >
//                         Suivant ▶
//                     </button>
//                 </div>

//                 {/* FOOTER */}
//                 <div className="mouvement-modal-footer">
//                     <button className="btn-custom btn-primary-custom">
//                         Imprimer
//                     </button>
//                     <button className="btn-custom btn-secondary-custom" onClick={onHide}>
//                         Fermer
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ApercuImpressionModal;


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

    const { entreprise, periode, articles, totalGeneral } = data;

    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
    const paginatedArticles = articles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="mouvement-modal-overlay">
            <div className="mouvement-modal-container apercu-modal-container">

                {/* HEADER */}
                <div className="mouvement-modal-header">
                    <span className="mouvement-modal-title">
                        Aperçu avant impression – Mouvements de stock
                    </span>
                    <button className="close-btn" onClick={onHide}>×</button>
                </div>

                <div className="apercu-content">
                    <div className="apercu-page">

                        {/* INFOS ENTREPRISE */}
                        <div className="apercu-header">
                            <div className="apercu-company-name">{entreprise.nom}</div>
                            <div style={{ fontSize: '9px' }}>
                                Gestion commerciale
                                <br />
                                Depuis le compte : {entreprise.depot}
                            </div>

                            <div className="apercu-doc-title">Mouvements de stock</div>

                            <div style={{ textAlign: 'right', fontSize: '9px' }}>
                                Période du : {formatDate(periode.du)} au {formatDate(periode.au)}
                            </div>
                        </div>

                        <table className="apercu-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Pièce</th>
                                    <th>Désignation</th>
                                    <th>Qté | Solde</th>
                                    <th>P.U</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedArticles.map((cat, idx) => (
                                    <React.Fragment key={idx}>

                                        {/* CATEGORIE */}
                                        <tr style={{ background: '#f5f5f5' }}>
                                            <td colSpan="7"><strong>{cat.categorie}</strong></td>
                                        </tr>

                                        {/* MOUVEMENTS */}
                                        {cat.mouvements.map((m, i) => (
                                            <tr key={i}>
                                                <td>{formatDate(m.date)}</td>
                                                <td>{m.type}</td>
                                                <td>{m.piece}</td>
                                                <td>{m.designation}</td>
                                                <td>{m.qte} | {m.qte}</td>
                                                <td>{formatNumber(m.pu)}</td>
                                                <td>{formatNumber(m.total)}</td>
                                            </tr>
                                        ))}

                                    </React.Fragment>
                                ))}

                                {/* TOTAL */}
                                <tr style={{ fontWeight: 'bold', background: '#eee' }}>
                                    <td colSpan="6" style={{ textAlign: 'right' }}>
                                        Total général
                                    </td>
                                    <td>{formatNumber(totalGeneral)}</td>
                                </tr>

                            </tbody>
                        </table>

                        <div className="apercu-footer-info">
                            <strong>Page {currentPage} / {totalPages}</strong>
                        </div>
                    </div>
                </div>

                {/* PAGINATION */}
                <div className="apercu-pagination">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ◀ Précédent
                    </button>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Suivant ▶
                    </button>
                </div>

                {/* FOOTER */}
                <div className="mouvement-modal-footer">
                    <button className="btn-custom btn-primary-custom">
                        Imprimer
                    </button>
                    <button className="btn-custom btn-secondary-custom" onClick={onHide}>
                        Fermer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ApercuImpressionModal;