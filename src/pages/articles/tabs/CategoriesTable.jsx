import React, { useState, useEffect, useRef } from 'react';
import './CategoriesTable.css';
import { getAllCategories, createCategorie, updateCategorie, deleteCategorie } from '../../../services/categorieService';
import UniteTab from './UniteTab';

const CategoriesTable = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showSelectModal, setShowSelectModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState(null);
    const uniteRef = useRef();

    // État pour la création de nouvelle catégorie
    const [newCategoryData, setNewCategoryData] = useState({
        categorie: '',
        coefficient: '',
        prixVente: '',
        remise: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCategories();
            if (response.data.status === 'success') {
                const mappedCategories = response.data.data.map(cat => ({
                    categorie_id: cat.categorie_id,
                    categorie: cat.categorie_name,
                    coefficient: cat.categorie_coefficient || '',
                    prixVente: cat.categorie_prix_vente || '',
                    remise: cat.categorie_remise || ''
                }));
                setCategories(mappedCategories);
            }
        } catch (err) {
            console.error('Erreur chargement catégories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = () => {
        const sorted = [...categories].sort((a, b) =>
            sortOrder === 'asc'
                ? a.remise.localeCompare(b.remise)
                : b.remise.localeCompare(a.remise)
        );
        setCategories(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDeleteCategory = async (index) => {
        const category = categories[index];
        if (category.categorie_id && window.confirm('Confirmer la suppression ?')) {
            try {
                await deleteCategorie(category.categorie_id);
                setCategories(categories.filter((_, i) => i !== index));
            } catch (err) {
                console.error('Erreur suppression:', err);
                alert('Erreur lors de la suppression');
            }
        } else {
            setCategories(categories.filter((_, i) => i !== index));
        }
    };

    const handleEditOpen = (index) => {
        setShowSelectModal(false);
        setEditIndex(index);
        setEditData({ ...categories[index] });
    };

    const handleEditSave = async () => {
        const updated = [...categories];
        updated[editIndex] = editData;
        setCategories(updated);

        if (editData.categorie_id) {
            try {
                await updateCategorie(editData.categorie_id, {
                    categorie_name: editData.categorie,
                    categorie_description: `Coef: ${editData.coefficient}, PV: ${editData.prixVente}, Remise: ${editData.remise}`
                });
            } catch (err) {
                console.error('Erreur mise à jour:', err);
            }
        }

        setEditIndex(null);
        setEditData(null);
    };

    // Ouvrir le modal de sélection d'une catégorie existante
    const handleOpenSelectModal = () => {
        setShowSelectModal(true);
        setSelectedCategory(null);
    };

    // Ouvrir le modal de création d'une nouvelle catégorie
    const handleOpenCreateModal = () => {
        if (activeTab === 'unite') {
            uniteRef.current.openCreateModal();
            return;
        }
        setShowSelectModal(false);
        setShowCreateModal(true);
        setNewCategoryData({
            categorie: '',
            coefficient: '',
            prixVente: '',
            remise: ''
        });
    };

    // Ajouter une catégorie existante depuis le modal de sélection
    const handleAddExistingCategory = () => {
        if (!selectedCategory) return;

        const existingCat = categories.find(cat => cat.categorie === selectedCategory);
        if (existingCat && !categories.some(cat => cat === existingCat)) {
            setCategories([...categories, existingCat]);
        }
        setShowSelectModal(false);
        setSelectedCategory(null);
    };

    // Créer une nouvelle catégorie
    const handleCreateCategory = async () => {
        if (!newCategoryData.categorie.trim()) {
            alert('Le nom de la catégorie est obligatoire');
            return;
        }

        try {
            const response = await createCategorie({
                categorie_name: newCategoryData.categorie,
                categorie_description: `Coef: ${newCategoryData.coefficient}, PV: ${newCategoryData.prixVente}, Remise: ${newCategoryData.remise}`
            });

            if (response.data.status === 'success') {
                const newCat = {
                    categorie_id: response.data.data.categorie_id,
                    categorie: newCategoryData.categorie,
                    coefficient: newCategoryData.coefficient,
                    prixVente: newCategoryData.prixVente,
                    remise: newCategoryData.remise
                };

                setCategories([...categories, newCat]);
                setShowCreateModal(false);
                setNewCategoryData({
                    categorie: '',
                    coefficient: '',
                    prixVente: '',
                    remise: ''
                });
            }
        } catch (err) {
            console.error('Erreur création:', err);
            alert('Erreur lors de la création de la catégorie');
        }
    };

    return (
        <div className="categories-container">
            <div className="tabs">
                {[
                    ['categories', 'Catégories tarifaires'],
                    ['tarifs-clients', 'Tarifs clients'],
                    ['fournisseurs', 'Fournisseurs'],
                    ['nouveau-tarif', 'Nouveau tarif'],
                    ['unite', 'unité'],
                ].map(([key, label]) => (
                    <button
                        key={key}
                        className={`tab ${activeTab === key ? 'active' : ''}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === 'categories' && (
                    <>
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                Chargement...
                            </div>
                        ) : (
                            <table className="categories-table">
                                <thead>
                                    <tr>
                                        <th>Catégorie</th>
                                        <th>Coefficient</th>
                                        <th>Prix de vente</th>
                                        <th className="sortable" onClick={handleSort}>
                                            Remise {sortOrder === 'asc' ? '▲' : '▼'}
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, index) => (
                                        <tr key={cat.categorie_id || index}>
                                            <td className="bold clickable" onClick={() => handleEditOpen(index)}>
                                                {cat.categorie}
                                            </td>
                                            <td className="clickable" onClick={() => handleEditOpen(index)}>
                                                {cat.coefficient}
                                            </td>
                                            <td className="clickable" onClick={() => handleEditOpen(index)}>
                                                {cat.prixVente}
                                            </td>
                                            <td className="clickable" onClick={() => handleEditOpen(index)}>
                                                {cat.remise}
                                            </td>
                                            <td className="center">
                                                <button
                                                    className="delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteCategory(index);
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
                {activeTab === 'unite' && (
                    <UniteTab ref={uniteRef} />
                )}
                {activeTab !== 'categories' && (
                    <div className="empty-tab">
                        Contenu {activeTab.replace('-', ' ')}
                    </div>
                )}

                <div className="actions">
                    <button onClick={handleOpenSelectModal}>Ouvrir…</button>
                    <button onClick={handleOpenCreateModal}
                        className="action-btn primary">Nouveau</button>
                    <button>Défaut</button>
                </div>
            </div>

            {/* Modal Sélection d'une catégorie existante */}
            {showSelectModal && (
                <>
                    <div className="categorie-modal-overlay" onClick={() => setShowSelectModal(false)} />
                    <div className="categorie-modal">
                        <div className="categorie-modal-header">
                            Sélectionner une catégorie existante
                            <button onClick={() => setShowSelectModal(false)} className='action-btn primary'>✕</button>
                        </div>
                        <div className="categorie-modal-body">
                            {categories.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                    Aucune catégorie disponible. Créez-en une nouvelle.
                                </div>
                            ) : (
                                categories.map((cat, i) => (
                                    <div
                                        key={i}
                                        className={`modal-item ${selectedCategory === cat.categorie ? 'selected' : ''}`}
                                        onClick={() => setSelectedCategory(cat.categorie)}
                                    >
                                        {cat.categorie}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="categorie-modal-footer">
                            <button onClick={() => setShowSelectModal(false)} className='action-btn'>Annuler</button>
                            <button onClick={handleAddExistingCategory} disabled={!selectedCategory}>
                                Ajouter
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Création d'une nouvelle catégorie */}
            {showCreateModal && (
                <>
                    <div className="categorie-modal-overlay" onClick={() => setShowCreateModal(false)} />
                    <div className="categorie-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="categorie-modal-header">
                            Créer une nouvelle catégorie tarifaire
                            <button onClick={() => setShowCreateModal(false)} className='action-btn primary'>✕</button>
                        </div>

                        <div className="categorie-modal-body form-modal">
                            <label className='form-label'>Catégorie *</label>
                            <input
                                className='form-input'
                                type="text"
                                placeholder="Nom de la catégorie"
                                value={newCategoryData.categorie}
                                onChange={(e) =>
                                    setNewCategoryData({ ...newCategoryData, categorie: e.target.value })
                                }
                                autoFocus
                            />

                            <label className='form-label'>Coefficient</label>
                            <input
                                className='form-input'
                                type="text"
                                placeholder="Ex: 1.5"
                                value={newCategoryData.coefficient}
                                onChange={(e) =>
                                    setNewCategoryData({ ...newCategoryData, coefficient: e.target.value })
                                }
                            />

                            <label className='form-label'>Prix de vente</label>
                            <input
                                className='form-input'
                                type="text"
                                placeholder="Ex: 100.00"
                                value={newCategoryData.prixVente}
                                onChange={(e) =>
                                    setNewCategoryData({ ...newCategoryData, prixVente: e.target.value })
                                }
                            />

                            <label className='form-label'>Remise</label>
                            <input
                                className='form-input'
                                type="text"
                                placeholder="Ex: 10%"
                                value={newCategoryData.remise}
                                onChange={(e) =>
                                    setNewCategoryData({ ...newCategoryData, remise: e.target.value })
                                }
                            />
                        </div>

                        <div className="categorie-modal-footer">
                            <button onClick={() => setShowCreateModal(false)} className='action-btn'>Annuler</button>
                            <button
                                onClick={handleCreateCategory}
                                disabled={!newCategoryData.categorie.trim()}
                                className='action-btn primary'
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Édition d'une catégorie */}
            {editData && (
                <>
                    <div className="categorie-modal-overlay" onClick={() => setEditData(null)} />
                    <div className="categorie-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="categorie-modal-header">
                            Modifier catégorie tarifaire
                            <button onClick={() => setEditData(null)}>✕</button>
                        </div>

                        <div className="categorie-modal-body form-modal">
                            <label className='form-label'>Catégorie</label>
                            <input
                                className='form-input'
                                value={editData.categorie}
                                onChange={(e) =>
                                    setEditData({ ...editData, categorie: e.target.value })
                                }
                            />

                            <label className='form-label'>Coefficient</label>
                            <input
                                className='form-input'
                                value={editData.coefficient}
                                onChange={(e) =>
                                    setEditData({ ...editData, coefficient: e.target.value })
                                }
                            />

                            <label className='form-label'>Prix de vente</label>
                            <input
                                value={editData.prixVente}
                                onChange={(e) =>
                                    setEditData({ ...editData, prixVente: e.target.value })
                                }
                            />

                            <label className='form-label'>Remise</label>
                            <input
                                className='form-input'
                                value={editData.remise}
                                onChange={(e) =>
                                    setEditData({ ...editData, remise: e.target.value })
                                }

                            />
                        </div>

                        <div className="categorie-modal-footer">
                            <button onClick={() => setEditData(null)} className='action-btn'>Annuler</button>
                            <button onClick={handleEditSave}>Enregistrer</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoriesTable;