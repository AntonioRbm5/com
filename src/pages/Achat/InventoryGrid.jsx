import React from 'react';

const InventoryGrid = () => {
    return (
        <div className="sage-window sage-app">
            <div className="sage-header">Saisie inventaire : SIEGE</div>
            <div className="p-2 bg-light border-bottom">
                <button className="sage-btn me-2">Imprimer</button>
            </div>
            <table className="sage-table">
                <thead>
                    <tr><th>Référence</th><th>Désignation</th><th>Stock</th><th>PR Unitaire</th><th>Valeur</th></tr>
                </thead>
                <tbody>
                    <tr><td>IMPR0001</td><td>HP MULTIFONCTION</td><td>10,00</td><td>589 675</td><td>5 896 750</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default InventoryGrid;