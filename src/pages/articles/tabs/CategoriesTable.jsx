import React, { useState } from 'react';
import './CategoriesTable.css';

const CategoriesTable = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([
        { categorie: 'GROSSISTE', coefficient: '', prixVente: '', remise: '' },
        { categorie: 'DETAILLANT', coefficient: '', prixVente: '', remise: '' }
    ]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState(null);

    const handleSort = () => {
        const sorted = [...categories].sort((a, b) =>
            sortOrder === 'asc'
                ? a.remise.localeCompare(b.remise)
                : b.remise.localeCompare(a.remise)
        );
        setCategories(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDeleteCategory = (index) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    const handleEditOpen = (index) => {
        setShowModal(false);
        setEditIndex(index);
        setEditData({ ...categories[index] });
    };

    const handleEditSave = () => {
        const updated = [...categories];
        updated[editIndex] = editData;
        setCategories(updated);
        setEditIndex(null);
        setEditData(null);
    };


    return (
        <div className="categories-container">
            {/* Onglets */}
            <div className="tabs">
                {[
                    ['categories', 'Catégories tarifaires'],
                    ['tarifs-clients', 'Tarifs clients'],
                    ['fournisseurs', 'Fournisseurs'],
                    ['nouveau-tarif', 'Nouveau tarif']
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

            {/* Contenu */}
            <div className="tab-content">
                {activeTab === 'categories' && (
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
                                <tr key={index}>
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
                                            onClick={() => handleDeleteCategory(index)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

                {activeTab !== 'categories' && (
                    <div className="empty-tab">
                        Contenu {activeTab.replace('-', ' ')}
                    </div>
                )}

                {/* Actions */}
                <div className="actions">
                    <button onClick={() => setShowModal(true)}>Ouvrir…</button>
                    <button>Défaut</button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal-overlay" onClick={() => setShowModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            Sélectionner une catégorie
                            <button onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {categories.map((cat, i) => (
                                <div
                                    key={i}
                                    className={`modal-item ${selectedCategory === cat.categorie ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory(cat.categorie)}
                                >
                                    {cat.categorie}
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowModal(false)}>Annuler</button>
                            <button disabled={!selectedCategory}>OK</button>
                        </div>
                    </div>
                </>
            )}
            {editData && (
                <>
                    <div className="modal-overlay" onClick={() => setEditData(null)} />
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            Modifier catégorie tarifaire
                            <button onClick={() => setEditData(null)}>✕</button>
                        </div>

                        <div className="modal-body form-modal">
                            <label>Catégorie</label>
                            <input
                                value={editData.categorie}
                                onChange={(e) =>
                                    setEditData({ ...editData, categorie: e.target.value })
                                }
                            />

                            <label>Coefficient</label>
                            <input
                                value={editData.coefficient}
                                onChange={(e) =>
                                    setEditData({ ...editData, coefficient: e.target.value })
                                }
                            />

                            <label>Prix de vente</label>
                            <input
                                value={editData.prixVente}
                                onChange={(e) =>
                                    setEditData({ ...editData, prixVente: e.target.value })
                                }
                            />

                            <label>Remise</label>
                            <input
                                value={editData.remise}
                                onChange={(e) =>
                                    setEditData({ ...editData, remise: e.target.value })
                                }
                            />
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setEditData(null)}>Annuler</button>
                            <button onClick={handleEditSave}>Enregistrer</button>
                        </div>
                    </div>
                </>
            )}


        </div>
    );
};

export default CategoriesTable;
