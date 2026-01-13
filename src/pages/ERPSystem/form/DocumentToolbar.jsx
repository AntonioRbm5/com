
import React from 'react';
import './DocumentForm.css';

const DocumentToolbar = ({
    onSave,
    onPrint,
    onComptabiliser,
    onTransform,
    onValidate,
    onBaremes,
    onInformations,
    onPied,
    onTracabilite,
    disabled = false,
    showComptabiliser = false,
    showTransform = true,
    showValidate = true
}) => {
    return (
        <div className="invoice-toolbar">
            <button
                className="toolbar-btn"
                onClick={() => alert('Fonctions')}
                disabled={disabled}
            >
                ⚙ Fonctions
            </button>

            <button
                className="toolbar-btn"
                onClick={onBaremes || (() => alert('Barèmes'))}
                disabled={disabled}
            >
                📊 Barèmes
            </button>

            <button
                className="toolbar-btn"
                onClick={onInformations || (() => alert('Informations'))}
                disabled={disabled}
            >
                ℹ️ Informations
            </button>

            <button
                className="toolbar-btn"
                onClick={onPied || (() => alert('Pied de page'))}
                disabled={disabled}
            >
                📎 Pied
            </button>

            <button
                className="toolbar-btn"
                onClick={onPrint || (() => window.print())}
                disabled={disabled}
                title="Imprimer le document"
            >
                🖨 Imprimer
            </button>

            {showComptabiliser && (
                <button
                    className="toolbar-btn"
                    onClick={onComptabiliser}
                    disabled={disabled}
                    style={{ color: '#28a745', fontWeight: '500' }}
                    title="Comptabiliser le document"
                >
                    💰 Comptabiliser
                </button>
            )}

            {showTransform && (
                <button
                    className="toolbar-btn"
                    onClick={onTransform || (() => alert('Transformer'))}
                    disabled={disabled}
                    title="Transformer le document"
                >
                    🔄 Transformer
                </button>
            )}

            <button
                className="toolbar-btn"
                onClick={onTracabilite || (() => alert('Traçabilité'))}
                disabled={disabled}
            >
                📋 Traçabilité
            </button>

            {showValidate && (
                <button
                    className="toolbar-btn"
                    onClick={onValidate || (() => alert('Valider'))}
                    disabled={disabled}
                    style={{ color: '#007bff', fontWeight: '500' }}
                    title="Valider le document"
                >
                    ✓ Valider
                </button>
            )}

            <button
                className="toolbar-btn"
                onClick={onSave}
                disabled={disabled}
                style={{ marginLeft: 'auto', background: '#0078d4', color: 'white' }}
                title="Enregistrer le document"
            >
                💾 Enregistrer
            </button>
        </div>
    );
};

export default DocumentToolbar;