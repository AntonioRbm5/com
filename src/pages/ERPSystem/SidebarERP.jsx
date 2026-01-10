// SidebarERP.jsx
import React from 'react';

const SidebarERP = ({ currentView, onViewChange }) => {
    const menuItems = [
        { id: 'sales', label: 'Documents des ventes' },
        { id: 'purchases', label: 'Documents des achats' },
        { id: 'stock', label: 'Mouvements de stock' },
        { id: 'analysis', label: 'Analyse clients' },
        { id: 'stats', label: 'Statistiques clients' },
        { id: 'inventory', label: "Saisie d'inventaire" }
    ];

    return (
        <div className="SidebarERP">
            {menuItems.map((item) => (
                <div
                    key={item.id}
                    className={`SidebarERP-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange(item.id)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default SidebarERP;