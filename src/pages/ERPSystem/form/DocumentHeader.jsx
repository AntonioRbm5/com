import React from 'react';
import './DocumentForm.css';

const DocumentHeader = ({ title, onClose }) => {
    return (
        <div className="invoice-header">
            <div className="header-left">
                <span className="header-icon">📄</span>
                <h2 className="header-title">{title}</h2>
            </div>
            <div className="header-controls">
                <button className="control-btn">−</button>
                <button className="control-btn">□</button>
                <button onClick={onClose} className="control-btn">×</button>
            </div>
        </div>
    );
};

export default DocumentHeader;