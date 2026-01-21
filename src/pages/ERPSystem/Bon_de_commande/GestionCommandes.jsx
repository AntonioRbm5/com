import React, { useState } from 'react';
import ListeCommandes from './ListeCommandes';
import BonCommande from './BonCommande';

const GestionCommandes = () => {
    const [currentView, setCurrentView] = useState('list'); // 'list' ou 'form'
    const [selectedCommandeId, setSelectedCommandeId] = useState(null);

    const handleCreateNew = () => {
        setSelectedCommandeId(null);
        setCurrentView('form');
    };

    const handleSelectCommande = (id) => {
        setSelectedCommandeId(id);
        setCurrentView('form');
    };

    const handleClose = () => {
        setSelectedCommandeId(null);
        setCurrentView('list');
    };

    return (
        <div>
            {currentView === 'list' ? (
                <ListeCommandes
                    onSelectCommande={handleSelectCommande}
                    onCreateNew={handleCreateNew}
                />
            ) : (
                <BonCommande
                    document={{ id: selectedCommandeId }}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default GestionCommandes;