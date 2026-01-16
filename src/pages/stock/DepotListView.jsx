import React, { useState, useEffect } from 'react';
import Sidebar from '../../composants/sidebar';
import Navbar from '../../composants/navbar';
import DepotFormModal from './DepotFormModal';
import {
    searchStockageDepot,
    deleteStockageDepot,
    transformDepotResponse
} from '../../services/stockService';
import './stock.css';

const DepotListView = () => {
    const [depots, setDepots] = useState([]);
    const [filteredDepots, setFilteredDepots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        loadDepots();
    }, []);

    useEffect(() => {
        filterDepots();
    }, [searchTerm, depots]);

    const loadDepots = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await searchStockageDepot();

            if (response?.data?.status === 'success') {
                const transformedDepots = transformDepotResponse(response);
                setDepots(transformedDepots);
                setFilteredDepots(transformedDepots);
            }
        } catch (err) {
            console.error('Erreur chargement dépôts:', err);
            setError(err.response?.data?.message || 'Erreur lors du chargement des dépôts');
        } finally {
            setLoading(false);
        }
    };

    const filterDepots = () => {
        if (!searchTerm) {
            setFilteredDepots(depots);
            return;
        }

        const search = searchTerm.toLowerCase();
        const filtered = depots.filter(depot =>
            depot.name.toLowerCase().includes(search) ||
            depot.code.toLowerCase().includes(search) ||
            depot.responsable.toLowerCase().includes(search)
        );
        setFilteredDepots(filtered);
    };

    const handleNew = () => {
        setSelectedDepot(null);
        setShowModal(true);
    };

    const handleEdit = (depot) => {
        setSelectedDepot(depot);
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
                await loadDepots();
                setSelectedRow(null);
            }
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert(`Erreur: ${err.response?.data?.message || 'Erreur lors de la suppression'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSuccess = () => {
        loadDepots();
        setShowModal(false);
        setSelectedDepot(null);
    };

    const handleRowClick = (depot, index) => {
        setSelectedRow(index);
        setSelectedDepot(depot);
    };

    const handleRowDoubleClick = (depot) => {
        handleEdit(depot);
    };

    if (loading && depots.length === 0) {
        return (
            <div className="d-flex">
                <div style={{ width: "8%" }}>
                    <Sidebar />
                </div>
                <div style={{ width: "92%" }}>
                    <Navbar />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80vh'
                    }}>
                        Chargement des dépôts...
                    </div>
                </div>
            </div>
        );
    }

    if (error && depots.length === 0) {
        return (
            <div className="d-flex">
                <div style={{ width: "8%" }}>
                    <Sidebar />
                </div>
                <div style={{ width: "92%" }}>
                    <Navbar />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80vh',
                        gap: '20px'
                    }}>
                        <div style={{ color: 'red' }}>Erreur: {error}</div>
                        <button
                            className="btn-custom btn-primary-custom"
                            onClick={loadDepots}
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="stock-container">
                    {loading && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '20px 40px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                Chargement...
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mouvement-modal-header" style={{
                        position: 'static',
                        padding: '15px 20px',
                        borderBottom: '1px solid #ddd',
                        marginBottom: '10px'
                    }}>
                        <span className="mouvement-modal-title">
                            Gestion des Dépôts de Stock
                        </span>
                    </div>

                    {/* Toolbar */}
                    <div className="mouvement-toolbar" style={{ marginBottom: '15px' }}>
                        <button className="mouvement-toolbar-btn" onClick={handleNew}>
                            ➕ Nouveau dépôt
                        </button>
                        <button
                            className="mouvement-toolbar-btn"
                            onClick={loadDepots}
                            disabled={loading}
                        >
                            🔄 Actualiser
                        </button>
                        <button
                            className="mouvement-toolbar-btn"
                            onClick={() => selectedDepot && handleEdit(selectedDepot)}
                            disabled={!selectedDepot}
                        >
                            ✏️ Modifier
                        </button>
                        <button
                            className="mouvement-toolbar-btn"
                            onClick={() => selectedDepot && handleDelete(selectedDepot.id)}
                            disabled={!selectedDepot}
                        >
                            🗑️ Supprimer
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div style={{
                        padding: '10px 20px',
                        marginBottom: '15px',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, code ou responsable..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            className="btn-custom btn-secondary-custom"
                            onClick={() => setSearchTerm('')}
                            disabled={!searchTerm}
                        >
                            ✖ Effacer
                        </button>
                    </div>

                    {/* Statistics */}
                    <div style={{
                        padding: '10px 20px',
                        marginBottom: '15px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        display: 'flex',
                        gap: '20px',
                        fontSize: '14px'
                    }}>
                        <span><strong>Total:</strong> {depots.length} dépôt(s)</span>
                        <span><strong>Affichés:</strong> {filteredDepots.length} dépôt(s)</span>
                        {selectedDepot && (
                            <span style={{ color: '#007bff' }}>
                                <strong>Sélectionné:</strong> {selectedDepot.name}
                            </span>
                        )}
                    </div>

                    {/* Table */}
                    <div className="stock-table-wrapper" style={{ padding: '0 20px' }}>
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>ID</th>
                                    <th>Nom du Dépôt</th>
                                    <th style={{ width: '120px' }}>Code</th>
                                    <th>Responsable</th>
                                    <th style={{ width: '150px' }}>Date de création</th>
                                    <th style={{ width: '150px' }}>Dernière modif.</th>
                                    <th style={{ width: '30px' }}>▶</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepots.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{
                                            textAlign: 'center',
                                            padding: '50px',
                                            color: '#999'
                                        }}>
                                            {searchTerm
                                                ? '🔍 Aucun dépôt trouvé avec ces critères'
                                                : '📦 Aucun dépôt enregistré. Cliquez sur "Nouveau dépôt" pour créer.'
                                            }
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDepots.map((depot, index) => (
                                        <tr
                                            key={depot.id}
                                            className={selectedRow === index ? 'selected' : ''}
                                            onClick={() => handleRowClick(depot, index)}
                                            onDoubleClick={() => handleRowDoubleClick(depot)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{depot.id}</td>
                                            <td><strong>{depot.name}</strong></td>
                                            <td>{depot.code}</td>
                                            <td>{depot.responsable}</td>
                                            <td>
                                                {new Date(depot.addedDate).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                {new Date(depot.updatedDate).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="stock-footer-actions" style={{ marginTop: '20px' }}>
                        <button className="stock-footer-left">
                            {filteredDepots.length} dépôt(s) affiché(s)
                        </button>
                        <div className="stock-footer-right">
                            <button
                                className="btn-custom btn-secondary"
                                onClick={() => selectedDepot && handleEdit(selectedDepot)}
                                disabled={!selectedDepot}
                            >
                                Ouvrir
                            </button>
                            <button
                                className="btn-custom btn-primary"
                                onClick={handleNew}
                            >
                                Nouveau
                            </button>
                            <button
                                className="btn-custom btn-secondary"
                                onClick={() => selectedDepot && handleDelete(selectedDepot.id)}
                                disabled={!selectedDepot}
                            >
                                Supprimer
                            </button>
                            <button
                                className="btn-custom btn-secondary"
                                onClick={() => window.history.back()}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>

                    {/* Modal */}
                    <DepotFormModal
                        show={showModal}
                        onHide={() => {
                            setShowModal(false);
                            setSelectedDepot(null);
                        }}
                        depot={selectedDepot}
                        onSaveSuccess={handleSaveSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepotListView;