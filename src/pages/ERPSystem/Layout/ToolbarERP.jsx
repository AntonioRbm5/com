// ToolbarERP.jsx
import React from 'react';

const ToolbarERP = ({ onTransform }) => {
    return (
        <div className="ToolbarERP">
            <button className="ToolbarERP-btn">
                <span className="icon-add"></span>
            </button>
            <button className="ToolbarERP-btn">
                <span className="icon-doc"></span>
            </button>
            <button className="ToolbarERP-btn">
                <span className="icon-save"></span>
            </button>
            <div className="ToolbarERP-separator"></div>
            <button className="ToolbarERP-btn">
                <span className="icon-print"></span> Imprimer
            </button>
            <button className="ToolbarERP-btn">
                <span className="icon-search"></span> Rechercher
            </button>
            <div className="ToolbarERP-separator"></div>
            <button className="ToolbarERP-btn" onClick={onTransform}>
                <span className="icon-doc"></span> Transformer
            </button>
            <button className="ToolbarERP-btn">
                <span className="icon-check"></span> Valider
            </button>
        </div>
    );
};

export default ToolbarERP;