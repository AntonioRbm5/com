import React from 'react'

const ListFactureComptablisée = () => {
    return (
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
    )
}

export default ListFactureComptablisée