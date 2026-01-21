import React, { useEffect, useState } from 'react';

const ListLignesVente = ({
    lignes = [],
    onAddLigne,
    onDeleteLigne,
    onSave,
    onValidate,
    articles = [],
    depots = [],
    unites = [],
    autoOpen = false,
    dernieresVentes = [],
    isValidated = false
}) => {


    const [showAddForm, setShowAddForm] = useState(false);
    const [newLigne, setNewLigne] = useState({
        article_id: '',
        article_name: '',
        depot_id: '',
        quantite: '',
        unite_id: '',
        prix_unitaire: '',
        remise: '',
        subtotal: ''
    });
    useEffect(() => {
        if (autoOpen) {
            setShowAddForm(true);
        }
    }, [autoOpen]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLigne(prev => {
            const updated = { ...prev, [name]: value };

            // Récupérer le prix de vente de l'article sélectionné
            if (name === 'article_id' && value) {
                const article = articles.find(a => String(a.article_id) === String(value));
                if (article) {
                    updated.article_name = article.article_name;
                    updated.prix_unitaire = article.article_prix_vente || '';
                    updated.unite_id = article.unite_vente_defaut_id || '';
                }
            }

            // Calculs automatiques
            if (name === 'prix_unitaire' || name === 'quantite' || name === 'remise') {
                const prixUnitaire = parseFloat(updated.prix_unitaire) || 0;
                const qte = parseFloat(updated.quantite) || 0;
                const remise = parseFloat(updated.remise) || 0;

                const montantBrut = prixUnitaire * qte;
                const montantRemise = (montantBrut * remise) / 100;
                const subtotal = montantBrut - montantRemise;

                updated.subtotal = subtotal.toFixed(2);
            }

            return updated;
        });
    };

    const handleAddLigne = () => {
        if (!newLigne.article_id || !newLigne.quantite || !newLigne.depot_id || !newLigne.unite_id) {
            alert('Veuillez remplir tous les champs obligatoires (Article, Dépôt, Quantité, Unité)');
            return;
        }

        onAddLigne(newLigne);

        // Réinitialiser le formulaire
        setNewLigne({
            article_id: '',
            article_name: '',
            depot_id: '',
            quantite: '',
            unite_id: '',
            prix_unitaire: '',
            remise: '',
            subtotal: ''
        });
        setShowAddForm(false);
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="table-container">
            <div className="table-scroll">
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th style={{ width: '150px' }}>Article</th>
                            <th style={{ width: '120px' }}>Dépôt</th>
                            <th className="text-right" style={{ width: '80px' }}>Qté</th>
                            <th style={{ width: '100px' }}>Unité</th>
                            <th className="text-right" style={{ width: '100px' }}>P.U. HT</th>
                            <th className="text-right" style={{ width: '80px' }}>Remise %</th>
                            <th className="text-right" style={{ width: '120px' }}>Montant HT</th>
                            <th style={{ width: '80px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isValidated && dernieresVentes.length > 0 && (
                            <>
                                <tr>
                                    <td colSpan="8" style={{
                                        background: '#e7f3ff',
                                        padding: '8px 12px',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        color: '#0078d4',
                                        textAlign: 'left'
                                    }}>
                                        📊 5 Dernières ventes
                                    </td>
                                </tr>
                                {dernieresVentes.map((vente, index) => (
                                    <tr key={`vente-${vente.vente_id || index}`} style={{
                                        background: index % 2 === 0 ? '#f8f9fa' : '#fff',
                                        cursor: 'pointer'
                                    }}>
                                        {/* Article - Colonne 1 */}
                                        <td style={{ fontWeight: '500', color: '#0d6efd' }}>
                                            {vente.vente_numero || `VEN${String(vente.vente_id).padStart(6, '0')}`}
                                        </td>
                                        {/* Dépôt - Colonne 2 */}
                                        <td style={{ color: '#6c757d' }}>
                                            {vente.client?.client_name || 'Client inconnu'}
                                        </td>
                                        {/* Qté - Colonne 3 */}
                                        <td className="text-right" style={{ fontSize: '11px' }}>
                                            -
                                        </td>
                                        {/* Unité - Colonne 4 */}
                                        <td style={{ fontSize: '11px' }}>
                                            -
                                        </td>
                                        {/* P.U. HT - Colonne 5 */}
                                        <td className="text-right" style={{ fontSize: '11px' }}>
                                            -
                                        </td>
                                        {/* Remise % - Colonne 6 */}
                                        <td className="text-right" style={{ fontSize: '11px' }}>
                                            -
                                        </td>
                                        {/* Montant HT - Colonne 7 */}
                                        <td className="text-right" style={{ fontWeight: '600', color: '#198754' }}>
                                            {formatCurrency(vente.vente_total_amount || 0)} Ar
                                        </td>
                                        {/* Actions - Colonne 8 */}
                                        <td className="text-right" style={{
                                            fontSize: '11px',
                                            color: '#868e96',
                                            fontStyle: 'italic'
                                        }}>
                                            {new Date(vente.vente_date || vente.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="8" style={{ height: '10px', background: '#fff' }}></td>
                                </tr>
                            </>
                        )}
                        {/* Formulaire d'ajout */}
                        {showAddForm && (
                            <tr style={{ background: '#fffbea' }}>
                                <td>
                                    <select
                                        name="article_id"
                                        className="form-select form-select-sm"
                                        value={newLigne.article_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Sélectionner</option>
                                        {articles.map((article) => (
                                            <option key={article.article_id} value={article.article_id}>
                                                {article.article_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="depot_id"
                                        className="form-select form-select-sm"
                                        value={newLigne.depot_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Dépôt</option>
                                        {depots.map((depot) => (
                                            <option key={depot.depot_id} value={depot.depot_id}>
                                                {depot.depot_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="quantite"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.quantite}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </td>
                                <td>
                                    <select
                                        name="unite_id"
                                        className="form-select form-select-sm"
                                        value={newLigne.unite_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Unité</option>
                                        {unites.map((unite) => (
                                            <option key={unite.unite_id} value={unite.unite_id}>
                                                {unite.unite_code}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="prix_unitaire"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.prix_unitaire}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="remise"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.remise}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                </td>
                                <td className="text-right bg-light">
                                    {formatCurrency(newLigne.subtotal)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        className="btn btn-sm btn-success"
                                        style={{ fontSize: '10px', padding: '2px 8px' }}
                                        onClick={handleAddLigne}
                                    >
                                        ✓
                                    </button>
                                </td>
                            </tr>
                        )}

                        {/* Lignes existantes */}
                        {lignes.length === 0 && !showAddForm ? (
                            <tr>
                                <td colSpan="8" className="empty-row-text" style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#999',
                                    fontStyle: 'italic'
                                }}>
                                    Aucune ligne de vente
                                </td>
                            </tr>
                        ) : (
                            lignes.map((ligne, index) => (
                                <tr key={index} style={{
                                    background: index % 2 === 0 ? '#fff' : '#f9f9f9'
                                }}>
                                    <td>{ligne.article_name || `Article #${ligne.article_id}`}</td>
                                    <td>{ligne.depot_name || `Dépôt #${ligne.depot_id}`}</td>
                                    <td className="text-right">{formatCurrency(ligne.quantite)}</td>
                                    <td>{ligne.unite_code || `Unité #${ligne.unite_id}`}</td>
                                    <td className="text-right">{formatCurrency(ligne.prix_unitaire)}</td>
                                    <td className="text-right">{ligne.remise || '0'}%</td>
                                    <td className="text-right" style={{ fontWeight: '500' }}>
                                        {formatCurrency(ligne.subtotal)}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            style={{ fontSize: '10px', padding: '2px 8px' }}
                                            onClick={() => onDeleteLigne(index)}
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                    {lignes.length > 0 && (
                        <tfoot style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'right', padding: '12px' }}>
                                    TOTAL HT:
                                </td>
                                <td className="text-right">
                                    {formatCurrency(
                                        lignes.reduce((sum, l) => sum + parseFloat(l.subtotal || 0), 0)
                                    )}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <div className="table-actions">
                <button
                    className="btn-action"
                    onClick={() => setShowAddForm(!showAddForm)}
                    disabled={autoOpen}

                >
                    {showAddForm ? 'Annuler' : 'Nouveau'}
                </button>
                <button
                    className="btn-action btn-delete"
                    disabled={lignes.length === 0}
                >
                    Supprimer
                </button>
                <button
                    className="btn-action"
                    disabled={lignes.length === 0}
                    onClick={onSave}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default ListLignesVente;