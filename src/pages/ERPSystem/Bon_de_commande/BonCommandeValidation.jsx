import React, { useState, useEffect } from 'react';

const BonCommandeValidation = ({ articles = [], onAddLigne, disabled = false }) => {
    const [formData, setFormData] = useState({
        article_id: '',
        ref: '',
        designation: '',
        puht: '',
        qte: '',
        conditionner: 'PIECE',
        remise: '',
        totalBrut: 0,
        montantRemise: 0,
        montantNet: 0,
        unite_id: 1
    });

    const [saving, setSaving] = useState(false);

    // Recalcul automatique des montants
    useEffect(() => {
        const prix = parseFloat(formData.puht) || 0;
        const quantite = parseFloat(formData.qte) || 0;
        const remisePourcent = parseFloat(formData.remise) || 0;

        const totalBrut = prix * quantite;
        const valeurRemise = (totalBrut * remisePourcent) / 100;
        const montantNet = totalBrut - valeurRemise;

        setFormData(prev => ({
            ...prev,
            totalBrut: totalBrut.toFixed(2),
            montantRemise: valeurRemise.toFixed(2),
            montantNet: montantNet.toFixed(2)
        }));
    }, [formData.puht, formData.qte, formData.remise]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArticleChange = (e) => {
        const articleId = e.target.value;

        if (!articleId) {
            setFormData(prev => ({
                ...prev,
                article_id: '',
                ref: '',
                designation: '',
                puht: ''
            }));
            return;
        }

        const article = articles.find(a => String(a.article_id) === String(articleId));

        if (article) {
            setFormData(prev => ({
                ...prev,
                article_id: articleId,
                ref: article.article_reference || '',
                designation: article.article_name || '',
                puht: article.article_prix_vente || ''
            }));
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.article_id) {
            alert('Veuillez sélectionner un article');
            return;
        }

        if (!formData.qte || parseFloat(formData.qte) <= 0) {
            alert('Veuillez saisir une quantité valide');
            return;
        }

        if (!formData.puht || parseFloat(formData.puht) <= 0) {
            alert('Veuillez saisir un prix unitaire valide');
            return;
        }

        try {
            setSaving(true);

            // Appeler la fonction callback pour ajouter la ligne
            await onAddLigne(formData);

            // Réinitialiser le formulaire
            setFormData({
                article_id: '',
                ref: '',
                designation: '',
                puht: '',
                qte: '',
                conditionner: 'PIECE',
                remise: '',
                totalBrut: 0,
                montantRemise: 0,
                montantNet: 0,
                unite_id: 1
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
        } finally {
            setSaving(false);
        }
    };

    const conditionneurOptions = [
        { value: 'PIECE', label: 'PIECE' },
        { value: 'KG', label: 'KG' },
        { value: 'LITRE', label: 'LITRE' },
        { value: 'CARTON', label: 'CARTON' },
        { value: 'METRE', label: 'METRE' }
    ];

    return (
        <div className="saisie-ligne-container border-bottom bg-light">
            <div className="row g-0 align-items-center bg-white border">
                {/* 1. Sélection article */}
                <div style={{ width: '25%' }}>
                    <select
                        name="article_id"
                        className="form-select form-select-sm border-0 border-end custom-input"
                        value={formData.article_id}
                        onChange={handleArticleChange}
                        disabled={disabled}
                    >
                        <option value="">-- Sélectionner un article --</option>
                        {articles.map((article) => (
                            <option key={article.article_id} value={article.article_id}>
                                {article.article_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. Référence (auto-rempli) */}
                <div style={{ width: '10%' }}>
                    <input
                        type="text"
                        name="ref"
                        placeholder="Ref"
                        className="form-control form-control-sm border-0 border-end custom-input bg-light"
                        value={formData.ref}
                        readOnly
                    />
                </div>

                {/* 3. P.U. HT */}
                <div style={{ width: '10%' }}>
                    <input
                        type="number"
                        name="puht"
                        placeholder="P.U. HT"
                        className="form-control form-control-sm border-0 border-end text-end custom-input"
                        value={formData.puht}
                        onChange={handleChange}
                        disabled={disabled}
                        step="0.01"
                    />
                </div>

                {/* 4. Quantité */}
                <div style={{ width: '8%' }}>
                    <input
                        type="number"
                        name="qte"
                        placeholder="Qté"
                        className="form-control form-control-sm border-0 border-end text-center custom-input"
                        value={formData.qte}
                        onChange={handleChange}
                        disabled={disabled}
                        step="0.01"
                    />
                </div>

                {/* 5. Conditionneur */}
                <div style={{ width: '8%' }}>
                    <select
                        name="conditionner"
                        className="form-select form-select-sm border-0 border-end custom-input"
                        value={formData.conditionner}
                        onChange={handleChange}
                        disabled={disabled}
                        style={{ borderRadius: 0, fontSize: '11px' }}
                    >
                        {conditionneurOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 6. Pourcentage Remise */}
                <div style={{ width: '8%' }}>
                    <input
                        type="number"
                        name="remise"
                        placeholder="% Rem"
                        className="form-control form-control-sm border-0 border-end text-center custom-input"
                        value={formData.remise}
                        onChange={handleChange}
                        disabled={disabled}
                        step="0.01"
                        min="0"
                        max="100"
                    />
                </div>

                {/* 7. Total Brut (calculé) */}
                <div style={{ width: '13%' }} className="bg-light">
                    <input
                        type="text"
                        readOnly
                        className="form-control form-control-sm border-0 border-end text-end custom-input-readonly"
                        value={formData.totalBrut}
                    />
                </div>

                {/* 8. Montant Remise (calculé) */}
                <div style={{ width: '9%' }} className="bg-light">
                    <input
                        type="text"
                        readOnly
                        className="form-control form-control-sm border-0 border-end text-end custom-input-readonly"
                        value={formData.montantRemise}
                    />
                </div>

                {/* 9. Montant Net (calculé) */}
                <div style={{ width: '9%' }} className="bg-light">
                    <input
                        type="text"
                        readOnly
                        className="form-control form-control-sm border-0 text-end custom-input-readonly"
                        value={formData.montantNet}
                        style={{ fontWeight: 'bold' }}
                    />
                </div>
            </div>

            {/* Boutons d'actions */}
            <div className="d-flex justify-content-end gap-1 p-1 bg-light border border-top-0">
                <button
                    className="btn btn-sm btn-white border px-3 btn-erp"
                    onClick={() => setFormData({
                        article_id: '',
                        ref: '',
                        designation: '',
                        puht: '',
                        qte: '',
                        remise: '',
                        conditionner: 'PIECE',
                        totalBrut: 0,
                        montantRemise: 0,
                        montantNet: 0,
                        unite_id: 1
                    })}
                    disabled={disabled}
                >
                    Nouveau
                </button>
                <button
                    className="btn btn-sm btn-primary px-3 btn-erp-save"
                    onClick={handleSave}
                    disabled={saving || disabled || !formData.article_id || !formData.qte || !formData.puht}
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    );
};

export default BonCommandeValidation;