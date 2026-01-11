// HeaderErp.jsx
import React from 'react';

const HeaderErp = () => {
    return (
        <>
            {/* Top Bar */}
            <div className="top-bar">
                <span className="icon-gear icon-blue"></span>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>
                    Sage 100 Gestion commerciale Premium 8.00
                </span>
            </div>

            {/* Menu Bar */}
            <div className="menu-bar">
                <div className="menu-item">Fichier</div>
                <div className="menu-item">Edition</div>
                <div className="menu-item">Structure</div>
                <div className="menu-item">Traitement</div>
                <div className="menu-item">État</div>
                <div className="menu-item">Fenêtre</div>
                <div className="menu-item">?</div>
            </div>
        </>
    );
};

export default HeaderErp;