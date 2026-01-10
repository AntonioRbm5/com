// SidebarERP.jsx
import React from 'react';

const SidebarERP = ({ currentView, onViewChange }) => {
    const menuItems = [
        { id: 'cours', label: 'Documents en cours' },
        { id: 'devis', label: 'Devis' },
        { id: 'commande', label: 'Bon de commande' },
        { id: 'livraison', label: 'Préparation de livraison' },
        { id: 'retour', label: 'Bon de retour' },
        { id: 'financier', label: 'Bon d\'avoir financier' },
        { id: 'purchases', label: 'Documents des achats' },
        { id: 'facture', label: 'Facture' },
        { id: 'comptabiliée', label: 'Facture comptabilisée' },
        { id: 'tous', label: 'Tous les documents' },

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