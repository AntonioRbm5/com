
import React, { useState, useEffect } from 'react';
import { getStockState } from '../../../services/stockManagementService';

const InventoryView = () => {
    const [depots, setDepots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDepot, setSelectedDepot] = useState(null);

    useEffect(() => {
        fetchStockState();
    }, []);

    const fetchStockState = async () => {
        try {
            setLoading(true);
            const response = await getStockState();
            if (response.data.status === 'success') {
                setDepots(response.data.data.depots);
                // Sélectionner le premier dépôt par défaut
                if (response.data.data.depots.length > 0) {
                    setSelectedDepot(response.data.data.depots[0]);
                }
            }
        } catch (err) {
            setError('Erreur lors du chargement de l\'inventaire');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Chargement de l'inventaire...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                {error}
            </div>
        );
    }

    return (
        <>
            <div style={{ padding: '16px', background: 'white' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '14px', margin: 0 }}>
                        Inventaire du dépôt:
                    </h3>
                    <select 
                        className="form-control" 
                        style={{ maxWidth: '300px' }}
                        value={selectedDepot?.depot_id || ''}
                        onChange={(e) => {
                            const depot = depots.find(d => d.depot_id === parseInt(e.target.value));
                            setSelectedDepot(depot);
                        }}
                    >
                        {depots.map(depot => (
                            <option key={depot.depot_id} value={depot.depot_id}>
                                {depot.depot_name} ({depot.depot_code})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <button className="btn-primary">Nouveau</button>
                    <button className="btn-secondary" style={{ marginLeft: '8px' }}>
                        Enregistrer
                    </button>
                    <button className="btn-secondary" style={{ marginLeft: '8px' }} onClick={fetchStockState}>
                        Rafraîchir
                    </button>
                </div>

                {selectedDepot && (
                    <table className="document-table">
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Désignation</th>
                                <th style={{ textAlign: 'right' }}>Quantité totale</th>
                                <th style={{ textAlign: 'right' }}>Valeur totale</th>
                                <th>Nombre de lots</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedDepot.articles.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        Aucun article dans ce dépôt
                                    </td>
                                </tr>
                            ) : (
                                selectedDepot.articles.map((article) => (
                                    <React.Fragment key={article.article_id}>
                                        <tr>
                                            <td>{article.article_reference}</td>
                                            <td>{article.article_name}</td>
                                            <td style={{ textAlign: 'right' }}>{article.total_quantity?.toFixed(2)}</td>
                                            <td style={{ textAlign: 'right' }}>{article.total_value?.toFixed(2)}</td>
                                            <td>{article.lots.length} lot(s)</td>
                                        </tr>
                                        {/* Sous-lignes pour les lots */}
                                        {article.lots.map((lot) => (
                                            <tr key={lot.lot_id} style={{ background: '#f9f9f9', fontSize: '10px' }}>
                                                <td style={{ paddingLeft: '30px' }}>Lot #{lot.lot_id}</td>
                                                <td style={{ color: '#666' }}>
                                                    Entrée: {new Date(lot.date_entree).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>{lot.quantity_restante?.toFixed(2)}</td>
                                                <td style={{ textAlign: 'right' }}>{lot.prix_achat?.toFixed(2)}</td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {selectedDepot && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f0f0f0', borderRadius: '4px' }}>
                        <strong>Informations du dépôt:</strong>
                        <div style={{ marginTop: '8px', fontSize: '11px' }}>
                            <div>Responsable: {selectedDepot.responsable?.username || 'Non défini'}</div>
                            {selectedDepot.lieu && (
                                <div>
                                    Lieu: {selectedDepot.lieu.coordonnees_ville}, {selectedDepot.lieu.coordonnees_region}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="action-buttons">
                <button className="btn-secondary">Fermer</button>
            </div>
        </>
    );
};

export default InventoryView;


