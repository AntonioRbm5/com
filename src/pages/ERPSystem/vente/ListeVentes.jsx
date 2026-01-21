import React, { useState, useEffect } from 'react';
import { getAllVente, deleteVente } from '../../../services/venteService';
import Sidebar from '../../../composants/sidebar';
import Navbar from '../../../composants/navbar';

const ListeVentes = ({ onSelectVente, onCreateNew }) => {
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVentes();
    }, []);

    const fetchVentes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllVente();

            if (response.data.status === 'success') {
                setVentes(response.data.data || []);
            } else {
                setError('Erreur lors du chargement des ventes');
            }
        } catch (err) {
            console.error('Erreur chargement ventes:', err);
            setError('Impossible de charger les ventes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await deleteVente(id);

            if (response.data.status === 'success') {
                alert('✅ Vente supprimée avec succès');
                fetchVentes();
            } else {
                alert('❌ Erreur lors de la suppression');
            }
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert('❌ Impossible de supprimer la vente');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const getStatusBadge = (statusName) => {
        const statusColors = {
            'pending': 'warning',
            'validated': 'success',
            'in_progress': 'info',
            'cancelled': 'danger',
            'delivered': 'primary',
            'completed': 'success'
        };

        const statusLabels = {
            'pending': 'En attente',
            'validated': 'Validée',
            'in_progress': 'En cours',
            'cancelled': 'Annulée',
            'delivered': 'Livrée',
            'completed': 'Terminée'
        };

        const color = statusColors[statusName] || 'secondary';
        const label = statusLabels[statusName] || statusName || 'Inconnu';

        return (
            <span className={`badge bg-${color}`}>
                {label}
            </span>
        );
    };

    if (loading && ventes.length === 0) {
        return (
            <div className="d-flex">
                <div style={{ width: "8%" }}>
                    <Sidebar />
                </div>
                <div style={{ width: "92%" }}>
                    <Navbar />
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
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
                <div className="container-fluid p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">💼 Liste des Ventes</h4>
                        <button
                            className="btn btn-primary"
                            onClick={onCreateNew}
                        >
                            ➕ Nouvelle Vente
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '100px' }}>N° Vente</th>
                                    <th style={{ width: '180px' }}>Date Exécution</th>
                                    <th style={{ width: '180px' }}>Date Mise à jour</th>
                                    <th style={{ width: '200px' }}>Responsable</th>
                                    <th style={{ width: '120px' }}>Statut</th>
                                    <th style={{ width: '150px' }}>Mode Paiement</th>
                                    <th className="text-center" style={{ width: '100px' }}>Remise</th>
                                    <th className="text-end" style={{ width: '150px' }}>Total</th>
                                    <th className="text-center" style={{ width: '100px' }}>Produits</th>
                                    <th className="text-center" style={{ width: '150px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventes.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center p-5 text-muted">
                                            <i>Aucune vente trouvée</i>
                                            <br />
                                            <button
                                                className="btn btn-sm btn-outline-primary mt-3"
                                                onClick={onCreateNew}
                                            >
                                                Créer la première vente
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    ventes.map((vente) => (
                                        <tr key={vente.vente_id}>
                                            {/* N° Vente */}
                                            <td>
                                                <strong style={{ color: '#0d6efd' }}>
                                                    VEN{String(vente.vente_id).padStart(6, '0')}
                                                </strong>
                                            </td>

                                            {/* Date Exécution */}
                                            <td>
                                                <small>{formatDate(vente.vente_execute_date)}</small>
                                            </td>

                                            {/* Date Mise à jour */}
                                            <td>
                                                <small>{formatDate(vente.vente_updated_date)}</small>
                                            </td>

                                            {/* Responsable */}
                                            <td>
                                                <span title={vente.vente_responsable?.username}>
                                                    {vente.vente_responsable?.username || '-'}
                                                </span>
                                                <br />
                                                <small className="text-muted">
                                                    ID: {vente.vente_responsable?.user_id || '-'}
                                                </small>
                                            </td>

                                            {/* Statut */}
                                            <td>
                                                {getStatusBadge(vente.vente_status)}
                                            </td>

                                            {/* Mode Paiement */}
                                            <td>
                                                <span className="badge bg-info">
                                                    {vente.vente_mode_paiement || 'Non défini'}
                                                </span>
                                            </td>

                                            {/* Remise */}
                                            <td className="text-center">
                                                {vente.vente_has_discount ? (
                                                    <span className="badge bg-warning text-dark">Oui</span>
                                                ) : (
                                                    <span className="badge bg-light text-dark">Non</span>
                                                )}
                                            </td>

                                            {/* Total */}
                                            <td className="text-end">
                                                <strong style={{ color: '#198754' }}>
                                                    {formatCurrency(vente.vente_total_value)} Ar
                                                </strong>
                                            </td>

                                            {/* Nombre de Produits */}
                                            <td className="text-center">
                                                <span className="badge bg-secondary">
                                                    {vente.vente_products?.length || 0}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => onSelectVente(vente.vente_id)}
                                                        title="Voir/Modifier"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDelete(vente.vente_id)}
                                                        title="Supprimer"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            {/* Footer avec totaux */}
                            {ventes.length > 0 && (
                                <tfoot className="table-light">
                                    <tr>
                                        <td colSpan="7" className="text-end fw-bold">
                                            TOTAUX ({ventes.length} vente{ventes.length > 1 ? 's' : ''}) :
                                        </td>
                                        <td className="text-end fw-bold" style={{ color: '#198754' }}>
                                            {formatCurrency(
                                                ventes.reduce((sum, v) => sum + parseFloat(v.vente_total_value || 0), 0)
                                            )} Ar
                                        </td>
                                        <td colSpan="2"></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Statistiques supplémentaires */}
                    {ventes.length > 0 && (
                        <div className="row mt-3">
                            <div className="col-md-3">
                                <div className="card border-primary">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">Total des ventes</small>
                                        <h6 className="mb-0 text-primary">{ventes.length}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-success">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">CA Total</small>
                                        <h6 className="mb-0 text-success">
                                            {formatCurrency(
                                                ventes.reduce((sum, v) => sum + parseFloat(v.vente_total_value || 0), 0)
                                            )} Ar
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-info">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">Avec remise</small>
                                        <h6 className="mb-0 text-info">
                                            {ventes.filter(v => v.vente_has_discount).length}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-warning">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">Vendeurs uniques</small>
                                        <h6 className="mb-0 text-warning">
                                            {new Set(ventes.map(v => v.vente_responsable?.user_id).filter(Boolean)).size}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListeVentes;