import React, { useState, useEffect } from 'react';
import { getAllCommandes, deleteCommande } from '../../../services/commandeService';
import Sidebar from '../../../composants/sidebar';
import Navbar from '../../../composants/navbar';

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

            console.log('📥 Réponse API getAllCommandes:', response.data);

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
                fetchCommandes();
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
        try {
            return new Date(dateString).toLocaleDateString('fr-FR');
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // ✅ CORRECTION: Gestion du statut selon la vraie structure API
    const getStatusBadge = (commande) => {
        // Essayer de récupérer le statut depuis différentes sources possibles
        const statusId = commande.commande_status?.commande_status_id || commande.commande_status_id;
        const statusName = commande.commande_status?.commande_status_name;

        const statuses = {
            1: { label: 'A préparer', color: 'warning' },
            2: { label: 'En cours', color: 'info' },
            3: { label: 'Préparé', color: 'primary' },
            4: { label: 'Livré', color: 'success' }
        };

        // Utiliser le nom si disponible, sinon l'ID
        const status = statusName 
            ? { label: statusName, color: 'info' }
            : (statuses[statusId] || { label: 'Inconnu', color: 'secondary' });

        return (
            <span className={`badge bg-${status.color}`}>
                {status.label}
            </span>
        );
    };

    // ✅ CORRECTION: Calcul des totaux si non fournis par l'API
    const calculateTotaux = (commande) => {
        // Vérifier si les totaux sont déjà dans la réponse
        if (commande.commande_total_ht && commande.commande_total_ttc) {
            return {
                totalHT: commande.commande_total_ht,
                totalTTC: commande.commande_total_ttc
            };
        }

        // Sinon, calculer depuis les détails
        if (commande.details && commande.details.length > 0) {
            const totalHT = commande.details.reduce((sum, detail) => {
                return sum + parseFloat(detail.commande_detail_subtotal || 0);
            }, 0);
            const totalTTC = totalHT * 1.2;

            return {
                totalHT: totalHT.toFixed(2),
                totalTTC: totalTTC.toFixed(2)
            };
        }

        return { totalHT: 0, totalTTC: 0 };
    };

    if (loading && commandes.length === 0) {
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
                                    <th style={{ width: '120px' }}>N° Commande</th>
                                    <th style={{ width: '150px' }}>Date</th>
                                    <th style={{ width: '250px' }}>Client</th>
                                    <th style={{ width: '130px' }}>Statut</th>
                                    <th className="text-end" style={{ width: '150px' }}>Montant HT</th>
                                    <th className="text-end" style={{ width: '150px' }}>Montant TTC</th>
                                    <th style={{ width: '150px' }}>Utilisateur</th>
                                    <th className="text-center" style={{ width: '120px' }}>Actions</th>
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
                                    commandes.map((commande) => {
                                        const totaux = calculateTotaux(commande);
                                        
                                        return (
                                            <tr key={commande.commande_id}>
                                                {/* N° Commande */}
                                                <td>
                                                    <strong style={{ color: '#0d6efd' }}>
                                                        BC{String(commande.commande_id).padStart(6, '0')}
                                                    </strong>
                                                </td>

                                                {/* Date */}
                                                <td>
                                                    <small>{formatDate(commande.commande_added_date)}</small>
                                                </td>

                                                {/* Client */}
                                                <td>
                                                    {commande.client?.client_name || '-'}
                                                    <br />
                                                    <small className="text-muted">
                                                        ID: {commande.client?.client_id || '-'}
                                                    </small>
                                                </td>

                                                {/* Statut */}
                                                <td>
                                                    {getStatusBadge(commande)}
                                                </td>

                                                {/* Montant HT */}
                                                <td className="text-end">
                                                    <span style={{ color: '#6c757d' }}>
                                                        {formatCurrency(totaux.totalHT)} Ar
                                                    </span>
                                                </td>

                                                {/* Montant TTC */}
                                                <td className="text-end">
                                                    <strong style={{ color: '#198754' }}>
                                                        {formatCurrency(totaux.totalTTC)} Ar
                                                    </strong>
                                                </td>

                                                {/* Utilisateur */}
                                                <td>
                                                    {commande.user?.username || '-'}
                                                </td>

                                                {/* Actions */}
                                                <td className="text-center">
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => onSelectCommande(commande.commande_id)}
                                                            title="Voir/Modifier"
                                                        >
                                                            👁️
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(commande.commande_id)}
                                                            title="Supprimer"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>

                            {/* Footer avec totaux */}
                            {commandes.length > 0 && (
                                <tfoot className="table-light">
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold">
                                            TOTAUX ({commandes.length} commande{commandes.length > 1 ? 's' : ''}) :
                                        </td>
                                        <td className="text-end fw-bold" style={{ color: '#6c757d' }}>
                                            {formatCurrency(
                                                commandes.reduce((sum, c) => {
                                                    const totaux = calculateTotaux(c);
                                                    return sum + parseFloat(totaux.totalHT || 0);
                                                }, 0)
                                            )} Ar
                                        </td>
                                        <td className="text-end fw-bold" style={{ color: '#198754' }}>
                                            {formatCurrency(
                                                commandes.reduce((sum, c) => {
                                                    const totaux = calculateTotaux(c);
                                                    return sum + parseFloat(totaux.totalTTC || 0);
                                                }, 0)
                                            )} Ar
                                        </td>
                                        <td colSpan="2"></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Statistiques */}
                    {commandes.length > 0 && (
                        <div className="row mt-3">
                            <div className="col-md-3">
                                <div className="card border-primary">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">Total des commandes</small>
                                        <h6 className="mb-0 text-primary">{commandes.length}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-success">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">CA Total HT</small>
                                        <h6 className="mb-0 text-success">
                                            {formatCurrency(
                                                commandes.reduce((sum, c) => {
                                                    const totaux = calculateTotaux(c);
                                                    return sum + parseFloat(totaux.totalHT || 0);
                                                }, 0)
                                            )} Ar
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-info">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">CA Total TTC</small>
                                        <h6 className="mb-0 text-info">
                                            {formatCurrency(
                                                commandes.reduce((sum, c) => {
                                                    const totaux = calculateTotaux(c);
                                                    return sum + parseFloat(totaux.totalTTC || 0);
                                                }, 0)
                                            )} Ar
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card border-warning">
                                    <div className="card-body p-2 text-center">
                                        <small className="text-muted d-block">Clients uniques</small>
                                        <h6 className="mb-0 text-warning">
                                            {new Set(commandes.map(c => c.client?.client_id).filter(Boolean)).size}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
      
        </div>
    );
};

export default ListeCommandes;