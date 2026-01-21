import React, { useState } from 'react';
import ListeVentes from './ListeVentes';
import VenteForm from './VenteForm';

const GestionVentes = () => {
    const [currentView, setCurrentView] = useState('list'); // 'list' ou 'form'
    const [selectedVenteId, setSelectedVenteId] = useState(null);

    const handleCreateNew = () => {
        setSelectedVenteId(null);
        setCurrentView('form');
    };

    const handleSelectVente = (id) => {
        setSelectedVenteId(id);
        setCurrentView('form');
    };

    const handleClose = () => {
        setSelectedVenteId(null);
        setCurrentView('list');
    };

    return (
        <div>
            {currentView === 'list' ? (
                <ListeVentes
                    onSelectVente={handleSelectVente}
                    onCreateNew={handleCreateNew}
                />
            ) : (
                <VenteForm
                    document={{ id: selectedVenteId }}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default GestionVentes;