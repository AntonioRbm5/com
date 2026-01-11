import React from 'react';
import './DocumentForm.css';

const DocumentFooter = () => {
    return (
        <div className="summary-footer">
            <div className="summary-card">
                <div className="summary-row">
                    <span className="summary-label">Poids net</span>
                    <span>0</span>
                </div>
                <div className="summary-row">
                    <span className="summary-label">Poids brut</span>
                    <span>0</span>
                </div>
            </div>
            <div className="summary-card">
                <div className="text-right">
                    <span>Total HT</span>
                </div>
            </div>
        </div>
    );
};

export default DocumentFooter;