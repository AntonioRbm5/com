
import React, { useState } from 'react';

const ListFactureComptablisée = ({ lignes = [], onAddLigne, onDeleteLigne }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLigne, setNewLigne] = useState({
        referenceArticle: '',
        referenceFournisseur: '',
        designation: '',
        puHT: '',
        quantite: '',
        conditionneur: 'PIECE',
        remise: '',
        puNet: '',
        montantHT: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLigne(prev => {
            const updated = { ...prev, [name]: value };

            // Calculs automatiques
            if (name === 'puHT' || name === 'quantite' || name === 'remise') {
                const puHT = parseFloat(updated.puHT) || 0;
                const qte = parseFloat(updated.quantite) || 0;
                const remise = parseFloat(updated.remise) || 0;

                const montantBrut = puHT * qte;
                const montantRemise = (montantBrut * remise) / 100;
                const puNet = remise > 0 ? puHT * (1 - remise / 100) : puHT;
                const montantHT = montantBrut - montantRemise;

                updated.puNet = puNet.toFixed(2);
                updated.montantHT = montantHT.toFixed(2);
            }

            return updated;
        });
    };

    const handleAddLigne = () => {
        if (!newLigne.designation || !newLigne.quantite || !newLigne.puHT) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        onAddLigne(newLigne);

        // Réinitialiser le formulaire
        setNewLigne({
            referenceArticle: '',
            referenceFournisseur: '',
            designation: '',
            puHT: '',
            quantite: '',
            conditionneur: 'PIECE',
            remise: '',
            puNet: '',
            montantHT: ''
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
                            <th style={{ width: '100px' }}>Référence a...</th>
                            <th style={{ width: '100px' }}>Référence f...</th>
                            <th>Désignation</th>
                            <th className="text-right" style={{ width: '100px' }}>P.U. HT</th>
                            <th className="text-right" style={{ width: '100px' }}>Qté colisée</th>
                            <th style={{ width: '100px' }}>Conditionn...</th>
                            <th className="text-right" style={{ width: '80px' }}>Remise</th>
                            <th className="text-right" style={{ width: '100px' }}>P.U. net</th>
                            <th className="text-right" style={{ width: '120px' }}>Montant HT</th>
                            <th style={{ width: '80px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Formulaire d'ajout */}
                        {showAddForm && (
                            <tr style={{ background: '#fffbea' }}>
                                <td>
                                    <input
                                        type="text"
                                        name="referenceArticle"
                                        className="form-control form-control-sm"
                                        value={newLigne.referenceArticle}
                                        onChange={handleInputChange}
                                        placeholder="Réf. article"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="referenceFournisseur"
                                        className="form-control form-control-sm"
                                        value={newLigne.referenceFournisseur}
                                        onChange={handleInputChange}
                                        placeholder="Réf. fourn."
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="designation"
                                        className="form-control form-control-sm"
                                        value={newLigne.designation}
                                        onChange={handleInputChange}
                                        placeholder="Désignation *"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="puHT"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.puHT}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="quantite"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.quantite}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        required
                                    />
                                </td>
                                <td>
                                    <select
                                        name="conditionneur"
                                        className="form-select form-select-sm"
                                        value={newLigne.conditionneur}
                                        onChange={handleInputChange}
                                    >
                                        <option value="PIECE">PIECE</option>
                                        <option value="KG">KG</option>
                                        <option value="LITRE">LITRE</option>
                                        <option value="CARTON">CARTON</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="remise"
                                        className="form-control form-control-sm text-right"
                                        value={newLigne.remise}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="text-right bg-light">
                                    {formatCurrency(newLigne.puNet)}
                                </td>
                                <td className="text-right bg-light">
                                    {formatCurrency(newLigne.montantHT)}
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
                                <td colSpan="10" className="empty-row-text" style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#999',
                                    fontStyle: 'italic'
                                }}>
                                    Aucune ligne de document
                                </td>
                            </tr>
                        ) : (
                            lignes.map((ligne, index) => (
                                <tr key={index} style={{
                                    background: index % 2 === 0 ? '#fff' : '#f9f9f9'
                                }}>
                                    <td>{ligne.referenceArticle || '-'}</td>
                                    <td>{ligne.referenceFournisseur || '-'}</td>
                                    <td>{ligne.designation}</td>
                                    <td className="text-right">{formatCurrency(ligne.puHT)}</td>
                                    <td className="text-right">{formatCurrency(ligne.quantite)}</td>
                                    <td>{ligne.conditionneur}</td>
                                    <td className="text-right">{ligne.remise || '0'}%</td>
                                    <td className="text-right">{formatCurrency(ligne.puNet)}</td>
                                    <td className="text-right" style={{ fontWeight: '500' }}>
                                        {formatCurrency(ligne.montantHT)}
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
                                <td colSpan="8" style={{ textAlign: 'right', padding: '12px' }}>
                                    TOTAL HT:
                                </td>
                                <td className="text-right">
                                    {formatCurrency(
                                        lignes.reduce((sum, l) => sum + parseFloat(l.montantHT || 0), 0)
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
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default ListFactureComptablisée;