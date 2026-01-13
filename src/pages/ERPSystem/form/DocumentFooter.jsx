
import React from 'react';
import './DocumentForm.css';

const DocumentFooter = ({
    poidsNet = 0,
    poidsBrut = 0,
    totalHT = '0,00',
    totalTTC = '0,00',
    totalTVA,
    devise = 'FCFA',
    showPoids = true,
    additionalInfo
}) => {
    const formatCurrency = (value) => {
        if (typeof value === 'string') return value;
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Calculer la TVA si non fournie
    const calculatedTVA = totalTVA || (
        parseFloat(totalTTC.toString().replace(/\s/g, '').replace(',', '.')) -
        parseFloat(totalHT.toString().replace(/\s/g, '').replace(',', '.'))
    ).toFixed(2);

    return (
        <div className="summary-footer">
            {/* Colonne gauche - Poids */}
            {showPoids && (
                <div className="summary-card">
                    <div className="summary-section">
                        <div className="summary-title">Informations logistiques</div>
                        <div className="summary-row">
                            <span className="summary-label">Poids net</span>
                            <span>{formatCurrency(poidsNet)} kg</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Poids brut</span>
                            <span>{formatCurrency(poidsBrut)} kg</span>
                        </div>
                    </div>

                    {additionalInfo && (
                        <div className="summary-section" style={{ marginTop: '12px', fontSize: '11px', color: '#666' }}>
                            {additionalInfo}
                        </div>
                    )}
                </div>
            )}

            {/* Colonne droite - Totaux */}
            <div className="summary-card" style={{ minWidth: '300px' }}>
                <div className="summary-section">
                    <div className="summary-title">Récapitulatif financier</div>

                    <div className="summary-row">
                        <span className="summary-label">Total HT</span>
                        <span style={{ fontSize: '14px' }}>
                            {typeof totalHT === 'string' ? totalHT : formatCurrency(totalHT)} {devise}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span className="summary-label">TVA (20%)</span>
                        <span style={{ fontSize: '13px', color: '#666' }}>
                            {formatCurrency(calculatedTVA)} {devise}
                        </span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row" style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#0078d4',
                        paddingTop: '8px'
                    }}>
                        <span className="summary-label">Montant TTC</span>
                        <span>
                            {typeof totalTTC === 'string' ? totalTTC : formatCurrency(totalTTC)} {devise}
                        </span>
                    </div>

                    <div className="summary-row" style={{
                        fontSize: '14px',
                        color: '#28a745',
                        marginTop: '8px'
                    }}>
                        <span className="summary-label">Net à payer</span>
                        <span style={{ fontWeight: '600' }}>
                            {typeof totalTTC === 'string' ? totalTTC : formatCurrency(totalTTC)} {devise}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentFooter;