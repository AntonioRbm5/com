import React, { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import Toolbar from '../Layout/Toolbar';
import {
    searchStockageDepot,
    createStockageDepot,
    updateStockageDepot,
    deleteStockageDepot,
    prepareDepotData,
    transformDepotResponse
} from '../../services/stockService';
import '../stock/stock.css';

const DepotManager = () => {
    const [depots, setDepots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        responsableId: 1
    });

    useEffect(() => {
        loadDepots();
    }, []);

    const loadDepots = async (searchQuery = '') => {
        try {
            setLoading(true);
            const response = await searchStockageDepot(searchQuery);

            if (response?.data?.status === 'success') {
                const transformedDepots = transformDepotResponse(response);
                setDepots(transformedDepots);
            }
        } catch (err) {
            console.error('Erreur chargement dépôts:', err);
            alert('Erreur lors du chargement des dépôts');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadDepots(searchTerm);
    };

    const handleNew = () => {
        setSelectedDepot(null);
        setFormData({
            name: '',
            code: '',
            responsableId: 1
        });
        setShowModal(true);
    };

    const handleEdit = (depot) => {
        setSelectedDepot(depot);
        setFormData({
            name: depot.name,
            code: depot.code,
            responsableId: depot.responsableId || 1
        });
        setShowModal(true);
    };

    const handleDelete = async (depotId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await deleteStockageDepot(depotId);

            if (response?.data?.status === 'success') {
                alert('Dépôt supprimé avec succès');
                loadDepots();
            }
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert(`Erreur: ${err.response?.data?.message || 'Erreur lors de la suppression'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.code) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            setLoading(true);
            const apiData = prepareDepotData(formData);

            let response;
            if (selectedDepot) {
                response = await updateStockageDepot(selectedDepot.id, apiData);
            } else {
                response = await createStockageDepot(apiData);
            }

            if (response?.data?.status === 'success') {
                alert(selectedDepot ? 'Dépôt modifié avec succès' : 'Dépôt créé avec succès');
                setShowModal(false);
                loadDepots();
            }
        } catch (err) {
            console.error('Erreur sauvegarde:', err);
            alert(`Erreur: ${err.response?.data?.message || 'Erreur lors de la sauvegarde'}`);
        } finally {
            setLoading(false);
        }
    };

    const toolbarButtons = [
        { icon: '🔍', label: 'Rechercher', onClick: handleSearch },
        { icon: '➕', label: 'Nouveau', onClick: handleNew },
        { icon: '🔄', label: 'Actualiser', onClick: () => loadDepots() }
    ];

    return (
        <div className="window">
            <Header
                title="Gestion des Dépôts de Stock"
                showWindowControls={true}
            />

            <Toolbar customButtons={toolbarButtons} />

            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Rechercher un dépôt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <button
                        className="btn-custom btn-primary-custom"
                        onClick={handleSearch}
                    >
                        Rechercher
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        Chargement...
                    </div>
                ) : (
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom du Dépôt</th>
                                <th>Code</th>
                                <th>Responsable</th>
                                <th>Date d'ajout</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depots.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        Aucun dépôt trouvé
                                    </td>
                                </tr>
                            ) : (
                                depots.map(depot => (
                                    <tr key={depot.id}>
                                        <td>{depot.id}</td>
                                        <td>{depot.name}</td>
                                        <td>{depot.code}</td>
                                        <td>{depot.responsable}</td>
                                        <td>{new Date(depot.addedDate).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn-custom btn-secondary-custom"
                                                onClick={() => handleEdit(depot)}
                                                style={{ marginRight: '8px' }}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="btn-custom btn-secondary-custom"
                                                onClick={() => handleDelete(depot.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal de création/modification */}
            {showModal && (
                <div className="mouvement-modal-overlay">
                    <div className="mouvement-modal-container" style={{ maxWidth: '500px' }}>
                        <div className="mouvement-modal-header">
                            <span className="mouvement-modal-title">
                                {selectedDepot ? 'Modifier le Dépôt' : 'Nouveau Dépôt'}
                            </span>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div className="mouvement-form-group" style={{ marginBottom: '15px' }}>
                                <label>Nom du Dépôt *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>

                            <div className="mouvement-form-group" style={{ marginBottom: '15px' }}>
                                <label>Code du Dépôt *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>
                        </div>

                        <div className="mouvement-modal-footer">
                            <button
                                className="btn-custom btn-primary-custom"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button
                                className="btn-custom btn-secondary-custom"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepotManager;