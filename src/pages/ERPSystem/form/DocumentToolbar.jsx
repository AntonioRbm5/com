import React from 'react';
import './DocumentForm.css';

const DocumentToolbar = () => {
    return (
        <div className="invoice-toolbar">
            <button className="toolbar-btn">⚙ Fonctions</button>
            <button className="toolbar-btn">📊 Barèmes</button>
            <button className="toolbar-btn">ℹ Informations</button>
            <button className="toolbar-btn">📎 Pied</button>
            <button className="toolbar-btn">🖨 Imprimer</button>
            <button className="toolbar-btn">💰 Comptabiliser</button>
            <button className="toolbar-btn">🔄 Transformer</button>
            <button className="toolbar-btn">📋 Traçabilité</button>
        </div>
    );
};

export default DocumentToolbar;