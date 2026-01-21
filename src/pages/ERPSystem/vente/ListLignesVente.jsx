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
        quantity: '',
        unite_id: '',
        prix_unitaire: '',
        remise: '0',
        subtotal: '0.00'
    });

    useEffect(() => {
        if (autoOpen) {
            setShowAddForm(true);
        }
    }, [autoOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        console.log(`🔍 Changement: ${name} = "${value}"`);

        setNewLigne(prev => {
            const updated = { ...prev, [name]: value };

            // Récupérer le prix de vente de l'article sélectionné
            if (name === 'article_id' && value) {
                const article = articles.find(a => String(a.article_id) === String(value));
                console.log('📦 Article trouvé:', article);

                if (article) {
                    updated.article_name = article.article_name;
                    updated.prix_unitaire = article.article_prix_vente || '0';
                    updated.unite_id = String(article.unite_vente_defaut_id || '');
                }
            }

            // Calculs automatiques
            if (name === 'prix_unitaire' || name === 'quantity' || name === 'remise') {
                const prixUnitaire = parseFloat(updated.prix_unitaire) || 0;
                const qte = parseFloat(updated.quantity) || 0;
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
        console.log('🔥 Ajout ligne:', newLigne);

        // Validation
        if (!newLigne.article_id) {
            alert('❌ Veuillez sélectionner un article');
            return;
        }
        if (!newLigne.depot_id) {
            alert('❌ Veuillez sélectionner un dépôt');
            return;
        }
        if (!newLigne.quantity || parseFloat(newLigne.quantity) <= 0) {
            alert('❌ Veuillez saisir une quantité valide');
            return;
        }
        if (!newLigne.unite_id) {
            alert('❌ Veuillez sélectionner une unité');
            return;
        }

        onAddLigne(newLigne);

        // Réinitialiser
        setNewLigne({
            article_id: '',
            article_name: '',
            depot_id: '',
            quantity: '',
            unite_id: '',
            prix_unitaire: '',
            remise: '0',
            subtotal: '0.00'
        });
        setShowAddForm(false);
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR');
        } catch {
            return dateString;
        }
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
                        {/* ✅ CORRECTION: Affichage des 5 dernières ventes selon la vraie structure API */}
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
                                        {/* ID Vente */}
                                        <td style={{ fontWeight: '500', color: '#0d6efd' }}>
                                            VEN{String(vente.vente_id).padStart(6, '0')}
                                        </td>

                                        {/* Responsable - CORRECTION selon structure API */}
                                        <td style={{ color: '#6c757d' }}>
                                            {vente.vente_responsable?.username || 'Non assigné'}
                                        </td>

                                        {/* Colonnes vides pour alignement */}
                                        <td className="text-right" style={{ fontSize: '11px' }}>-</td>

                                        {/* Statut - CORRECTION */}
                                        <td style={{ fontSize: '11px' }}>
                                            <span style={{
                                                padding: '2px 6px',
                                                borderRadius: '3px',
                                                background: vente.vente_status === 'pending' ? '#fff3cd' : '#d1e7dd',
                                                color: vente.vente_status === 'pending' ? '#856404' : '#0f5132',
                                                fontSize: '10px'
                                            }}>
                                                {vente.vente_status || 'N/A'}
                                            </span>
                                        </td>

                                        {/* Mode paiement - CORRECTION */}
                                        <td className="text-right" style={{ fontSize: '11px' }}>
                                            {vente.vente_mode_paiement || '-'}
                                        </td>

                                        {/* Remise */}
                                        <td className="text-right" style={{ fontSize: '11px' }}>
                                            {vente.vente_has_discount ? '✓ Oui' : '-'}
                                        </td>

                                        {/* Total - CORRECTION */}
                                        <td className="text-right" style={{ fontWeight: '600', color: '#198754' }}>
                                            {formatCurrency(vente.vente_total_value || 0)} Ar
                                        </td>

                                        {/* Date - CORRECTION */}
                                        <td className="text-right" style={{
                                            fontSize: '11px',
                                            color: '#868e96',
                                            fontStyle: 'italic'
                                        }}>
                                            {formatDate(vente.vente_execute_date)}
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
                                        required
                                    >
                                        <option value="">-- Article --</option>
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
                                        required
                                    >
                                        <option value="">-- Dépôt --</option>
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
                                        name="quantity"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.quantity}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </td>
                                <td>
                                    <select
                                        name="unite_id"
                                        className="form-select form-select-sm"
                                        value={newLigne.unite_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Unité --</option>
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
                                        required
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
                                        step="0.01"
                                    />
                                </td>
                                <td className="text-right bg-light" style={{
                                    fontWeight: '600',
                                    color: '#198754',
                                    verticalAlign: 'middle'
                                }}>
                                    {formatCurrency(newLigne.subtotal)} Ar
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        className="btn btn-sm btn-success"
                                        style={{ fontSize: '10px', padding: '4px 10px' }}
                                        onClick={handleAddLigne}
                                        type="button"
                                    >
                                        ✓ Ajouter
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
                                    Aucune ligne de vente. Cliquez sur "Nouveau" pour ajouter une ligne.
                                </td>
                            </tr>
                        ) : (
                            lignes.map((ligne, index) => (
                                <tr key={index} style={{
                                    background: index % 2 === 0 ? '#fff' : '#f9f9f9'
                                }}>
                                    <td>{ligne.article_name || `Article #${ligne.article_id}`}</td>
                                    <td>{ligne.depot_name || `Dépôt #${ligne.depot_id}`}</td>
                                    <td className="text-right">{formatCurrency(ligne.quantity)}</td>
                                    <td>{ligne.unite_code || `Unité #${ligne.unite_id}`}</td>
                                    <td className="text-right">{formatCurrency(ligne.prix_unitaire)} Ar</td>
                                    <td className="text-right">{ligne.remise || '0'}%</td>
                                    <td className="text-right" style={{ fontWeight: '500', color: '#198754' }}>
                                        {formatCurrency(ligne.subtotal)} Ar
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
                                <td className="text-right" style={{ color: '#198754', fontSize: '16px' }}>
                                    {formatCurrency(
                                        lignes.reduce((sum, l) => sum + parseFloat(l.subtotal || 0), 0)
                                    )} Ar
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
                    disabled={!isValidated}
                    title={!isValidated ? "Veuillez d'abord valider l'en-tête" : ""}
                >
                    {showAddForm ? '❌ Annuler' : '➕ Nouveau'}
                </button>
                <button
                    className="btn-action btn-delete"
                    disabled={lignes.length === 0}
                    title="Supprimer toutes les lignes"
                >
                    🗑️ Tout supprimer
                </button>
                <button
                    className="btn-action"
                    disabled={lignes.length === 0}
                    onClick={onSave}
                    title="Enregistrer les modifications"
                >
                    💾 Enregistrer
                </button>
            </div>
        </div>
    );
};

export default ListLignesVente;