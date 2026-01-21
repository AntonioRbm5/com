import React, { useState, useEffect } from 'react';
import { getAllCommandes, deleteCommande } from '../../../services/commandeService';

const ListeCommandes = ({ onSelectCommande, onCreateNew }) => {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCommandes();
    }, []);

    const fetchCommandes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCommandes();

            if (response.data.status === 'success') {
                setCommandes(response.data.data || []);
            } else {
                setError('Erreur lors du chargement des commandes');
            }
        } catch (err) {
            console.error('Erreur chargement commandes:', err);
            setError('Impossible de charger les commandes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await deleteCommande(id);

            if (response.data.status === 'success') {
                alert('✅ Commande supprimée avec succès');
                fetchCommandes(); // Recharger la liste
            } else {
                alert('❌ Erreur lors de la suppression');
            }
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert('❌ Impossible de supprimer la commande');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const getStatusBadge = (statusId) => {
        const statuses = {
            1: { label: 'A préparer', color: 'warning' },
            2: { label: 'En cours', color: 'info' },
            3: { label: 'Préparé', color: 'primary' },
            4: { label: 'Livré', color: 'success' }
        };
        const status = statuses[statusId] || { label: 'Inconnu', color: 'secondary' };
        return (
            <span className={`badge bg-${status.color}`}>
                {status.label}
            </span>
        );
    };

    if (loading && commandes.length === 0) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">📋 Liste des Bons de Commande</h4>
                <button
                    className="btn btn-primary"
                    onClick={onCreateNew}
                >
                    ➕ Nouvelle Commande
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
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Client</th>
                            <th>Statut</th>
                            <th className="text-end">Montant HT</th>
                            <th className="text-end">Montant TTC</th>
                            <th>Utilisateur</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center p-5 text-muted">
                                    <i>Aucune commande trouvée</i>
                                    <br />
                                    <button
                                        className="btn btn-sm btn-outline-primary mt-3"
                                        onClick={onCreateNew}
                                    >
                                        Créer la première commande
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            commandes.map((commande) => (
                                <tr key={commande.commande_id}>
                                    <td>
                                        <strong>BC{String(commande.commande_id).padStart(6, '0')}</strong>
                                    </td>
                                    <td>{formatDate(commande.commande_added_date)}</td>
                                    <td>{commande.client?.client_name || '-'}</td>
                                    <td>
                                        {getStatusBadge(commande.commande_status?.commande_status_id)}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(commande.commande_total_ht)} Ar
                                    </td>
                                    <td className="text-end">
                                        <strong>{formatCurrency(commande.commande_total_ttc)} Ar</strong>
                                    </td>
                                    <td>{commande.user?.username || '-'}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-1"
                                            onClick={() => onSelectCommande(commande.commande_id)}
                                            title="Voir/Modifier"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(commande.commande_id)}
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {commandes.length > 0 && (
                <div className="text-muted small mt-2">
                    Total: {commandes.length} commande(s)
                </div>
            )}
        </div>
    );
};

export default ListeCommandes;