import React, { useState, useEffect } from 'react';

const BonCommandeValidation = ({ onAddLigne, initialRef }) => {
    const [formData, setFormData] = useState({
        ref: initialRef || '',
        designation: '',
        puht: '', // Prix d'achat
        qte: '',  // Quantité
        conditionner: 'PIECE', // Unité par défaut
        remise: '', // % Remise
        totalBrut: 0,
        montantRemise: 0
    });

    // Calculs automatiques
    useEffect(() => {
        const prix = parseFloat(formData.puht) || 0;
        const quantite = parseFloat(formData.qte) || 0;
        const remisePourcent = parseFloat(formData.remise) || 0;

        const totalBrut = prix * quantite;
        const valeurRemise = (prix * quantite * remisePourcent) / 100;

        setFormData(prev => ({
            ...prev,
            totalBrut: totalBrut.toFixed(2),
            montantRemise: valeurRemise.toFixed(2)
        }));
    }, [formData.puht, formData.qte, formData.remise]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="saisie-ligne-container border-bottom bg-light">
            <div className="row g-0 align-items-center bg-white border">
                {/* 1. Référence */}
                <div style={{ width: '10%' }}>
                    <input type="text" name="ref" placeholder="Ref" className="form-control form-control-sm border-0 border-end custom-input" value={formData.ref}
                        onChange={(e) => setFormData({ ...formData, ref: e.target.value })} />
                </div>

                {/* 2. Désignation */}
                <div style={{ width: '30%' }}>
                    <input type="text" name="designation" placeholder="Désignation" className="form-control form-control-sm border-0 border-end custom-input" value={formData.designation} onChange={handleChange} />
                </div>

                {/* 3. P.U. HT */}
                <div style={{ width: '10%' }}>
                    <input type="number" name="puht" placeholder="P.U. HT" className="form-control form-control-sm border-0 border-end text-end custom-input" value={formData.puht} onChange={handleChange} />
                </div>

                {/* 4. Quantité */}
                <div style={{ width: '8%' }}>
                    <input type="number" name="qte" placeholder="Qté" className="form-control form-control-sm border-0 border-end text-center custom-input" value={formData.qte} onChange={handleChange} />
                </div>

                {/* 5. Conditionner (SELECT OPTION) */}
                <div style={{ width: '8%' }}>
                    <select
                        name="conditionner"
                        className="form-select form-select-sm border-0 border-end custom-input"
                        value={formData.conditionner}
                        onChange={handleChange}
                        style={{ borderRadius: 0, fontSize: '11px' }}
                    >
                        <option value="PIECE">PIECE</option>
                        <option value="KG">KG</option>
                        <option value="LITRE">LITRE</option>
                        <option value="CARTON">CARTON</option>
                    </select>
                </div>

                {/* 7. Pourcentage Remise */}
                <div style={{ width: '8%' }}>
                    <input type="number" name="remise" placeholder="% Rem" className="form-control form-control-sm border-0 border-end text-center custom-input" value={formData.remise} onChange={handleChange} />
                </div>

                {/* 8. Total Brut (Quantité * Prix) */}
                <div style={{ width: '13%' }} className="bg-light">
                    <input type="text" readOnly className="form-control form-control-sm border-0 border-end text-end custom-input-readonly" value={formData.totalBrut} />
                </div>

                {/* 9. Calcul Remise (Montant de la réduction) */}
                <div style={{ width: '13%' }} className="bg-light">
                    <input type="text" readOnly className="form-control form-control-sm border-0 text-end custom-input-readonly" value={formData.montantRemise} />
                </div>
            </div>

            {/* Boutons d'actions */}
            <div className="d-flex justify-content-end gap-1 p-1 bg-light border border-top-0">
                <button className="btn btn-sm btn-white border px-3 btn-erp" onClick={() => setFormData({ ...formData, ref: '', designation: '', puht: '', qte: '', remise: '' })}>Nouveau</button>
                <button className="btn btn-sm btn-white border px-3 btn-erp text-muted" disabled>Supprimer</button>
                <button className="btn btn-sm btn-primary px-3 btn-erp-save" onClick={() => onAddLigne(formData)}>
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default BonCommandeValidation;