import React, { useState, useEffect } from 'react';
import CategoriesTable from './CategoriesTable';

const IdentificationTab = ({ formData, handleInputChange, familles = [] }) => {
    const [categories, setCategories] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [unitesStock, setUnitesStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);

            // Importer les services nécessaires
            const { getAllCategories } = await import('../../../services/categorieService');
            const { getAllFournisseurs } = await import('../../../services/fournisseurService');
            const { getAllUnites } = await import('../../../services/uniteService');

            const [categoriesRes, fournisseursRes, unitesRes] = await Promise.all([
                getAllCategories().catch(() => ({ data: { data: [] } })),
                getAllFournisseurs().catch(() => ({ data: { data: [] } })),
                getAllUnites().catch(() => ({ data: { data: [] } }))
            ]);

            if (categoriesRes.data?.status === 'success') {
                setCategories(categoriesRes.data.data || []);
            }
            if (fournisseursRes.data?.status === 'success') {
                setFournisseurs(fournisseursRes.data.data || []);
            }
            if (unitesRes.data?.status === 'success') {
                setUnitesStock(unitesRes.data.data || []);
            }
        } catch (err) {
            console.error('Erreur chargement données:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="article-form-section">
                <div className="article-form-section-title">Identification</div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Référence *</label>
                        <input
                            type="text"
                            className="article-form-input"
                            value={formData.article_reference || ''}
                            onChange={(e) => handleInputChange('article_reference', e.target.value)}
                            required
                        />
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Type</label>
                        <select
                            className="form-select"
                            value={formData.type || 'Standard'}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                        >
                            <option>Standard</option>
                            <option>Détail</option>
                        </select>
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Désignation *</label>
                        <input
                            type="text"
                            className="article-form-input"
                            value={formData.article_name || ''}
                            onChange={(e) => handleInputChange('article_name', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Famille *</label>
                        <select
                            className="form-select"
                            value={formData.famille_id || ''}
                            onChange={(e) => handleInputChange('famille_id', parseInt(e.target.value) || null)}
                            required
                        >
                            <option value="">-- Sélectionner --</option>
                            {familles.map(famille => (
                                <option key={famille.famille_id} value={famille.famille_id}>
                                    {famille.famille_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Catégorie *</label>
                        <select
                            className="form-select"
                            value={formData.categorie_id || ''}
                            onChange={(e) => handleInputChange('categorie_id', parseInt(e.target.value) || null)}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Sélectionner --</option>
                            {categories.map(cat => (
                                <option key={cat.categorie_id} value={cat.categorie_id}>
                                    {cat.categorie_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Fournisseur *</label>
                        <select
                            className="form-select"
                            value={formData.fournisseur_id || ''}
                            onChange={(e) => handleInputChange('fournisseur_id', parseInt(e.target.value) || null)}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Sélectionner --</option>
                            {fournisseurs.map(f => (
                                <option key={f.fournisseur_id} value={f.fournisseur_id}>
                                    {f.fournisseur_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Unité de stock *</label>
                        <select
                            className="form-select"
                            value={formData.unite_stock_id || ''}
                            onChange={(e) => handleInputChange('unite_stock_id', parseInt(e.target.value) || null)}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Sélectionner --</option>
                            {unitesStock.map(u => (
                                <option key={u.unite_id} value={u.unite_id}>
                                    {u.unite_libelle} ({u.unite_code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Suivi de stock</label>
                        <select
                            className="form-select"
                            value={formData.suiviStock || 'Aucun'}
                            onChange={(e) => handleInputChange('suiviStock', e.target.value)}
                        >
                            <option>Aucun</option>
                            <option>CMUP</option>
                            <option>FIFO</option>
                        </select>
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Nomenclature</label>
                        <input
                            type="text"
                            className="article-form-input"
                            value={formData.nomenclature || 'Aucune'}
                            disabled
                        />
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Description</label>
                        <textarea
                            className="article-form-input"
                            rows="3"
                            value={formData.article_description || ''}
                            onChange={(e) => handleInputChange('article_description', e.target.value)}
                        />
                    </div>
                </div>
                <div className="article-form-row">
                    <label className="form-checkbox-label">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={formData.article_is_serialized || false}
                            onChange={(e) => handleInputChange('article_is_serialized', e.target.checked)}
                        />
                        Article sérialisé
                    </label>
                </div>
            </div>

            <div className="article-form-section">
                <div className="article-form-section-title">Tarif</div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Prix d'achat</label>
                        <input
                            type="number"
                            step="0.01"
                            className="article-form-input"
                            value={formData.prix_achat || ''}
                            onChange={(e) => handleInputChange('prix_achat', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Dernier Prix d'achat</label>
                        <input
                            type="number"
                            step="0.01"
                            className="article-form-input"
                            value={formData.dernier_prix_achat || ''}
                            onChange={(e) => handleInputChange('dernier_prix_achat', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Nomenclature</label>
                        <input
                            type="text"
                            className="article-form-input"
                            value={formData.nomenclature_tarif || ''}
                            onChange={(e) => handleInputChange('nomenclature_tarif', e.target.value)}
                        />
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Coût standard</label>
                        <input
                            type="number"
                            step="0.01"
                            className="article-form-input"
                            value={formData.cout_standard || ''}
                            onChange={(e) => handleInputChange('cout_standard', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className="article-form-row">
                    <div className="article-form-group">
                        <label className="article-form-label">Prix de vente *</label>
                        <input
                            type="number"
                            step="0.01"
                            className="article-form-input"
                            value={formData.article_prix_vente || ''}
                            onChange={(e) => handleInputChange('article_prix_vente', parseFloat(e.target.value) || 0)}
                            required
                        />
                        <select
                            className="form-select"
                            style={{ flex: '0 0 100px' }}
                            value={formData.type_prix_vente || 'PV HT'}
                            onChange={(e) => handleInputChange('type_prix_vente', e.target.value)}
                        >
                            <option>PV HT</option>
                            <option>PV TTC</option>
                        </select>
                    </div>
                    <div className="article-form-group">
                        <label className="article-form-label">Unité de vente</label>
                        <select
                            className="form-select"
                            value={formData.unitVente || 'PIECE'}
                            onChange={(e) => handleInputChange('unitVente', e.target.value)}
                        >
                            <option>PIECE</option>
                            <option>METRE</option>
                            <option>KG</option>
                            <option>LITRE</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="article-form-section">
                <div className="article-form-row">
                    <CategoriesTable
                        categories={formData.categories_tarifaires || []}
                        onChange={(categories) => handleInputChange('categories_tarifaires', categories)}
                    />
                </div>
            </div>
        </>
    );
};

export default IdentificationTab;