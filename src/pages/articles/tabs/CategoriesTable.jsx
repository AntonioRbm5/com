// import React, { useState } from 'react';
// import './CategoriesTable.css';

// const CategoriesTable = () => {
//     const [activeTab, setActiveTab] = useState('categories');
//     const [categories, setCategories] = useState([
//         { categorie: 'GROSSISTE', coefficient: '', prixVente: '', remise: '' },
//         { categorie: 'DETAILLANT', coefficient: '', prixVente: '', remise: '' }
//     ]);
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [showModal, setShowModal] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState(null);

//     const [editIndex, setEditIndex] = useState(null);
//     const [editData, setEditData] = useState(null);

//     const handleSort = () => {
//         const sorted = [...categories].sort((a, b) =>
//             sortOrder === 'asc'
//                 ? a.remise.localeCompare(b.remise)
//                 : b.remise.localeCompare(a.remise)
//         );
//         setCategories(sorted);
//         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     };

//     const handleDeleteCategory = (index) => {
//         setCategories(categories.filter((_, i) => i !== index));
//     };

//     const handleEditOpen = (index) => {
//         setShowModal(false);
//         setEditIndex(index);
//         setEditData({ ...categories[index] });
//     };

//     const handleEditSave = () => {
//         const updated = [...categories];
//         updated[editIndex] = editData;
//         setCategories(updated);
//         setEditIndex(null);
//         setEditData(null);
//     };


//     return (
//         <div className="categories-container">
//             {/* Onglets */}
//             <div className="tabs">
//                 {[
//                     ['categories', 'Catégories tarifaires'],
//                     ['tarifs-clients', 'Tarifs clients'],
//                     ['fournisseurs', 'Fournisseurs'],
//                     ['nouveau-tarif', 'Nouveau tarif']
//                 ].map(([key, label]) => (
//                     <button
//                         key={key}
//                         className={`tab ${activeTab === key ? 'active' : ''}`}
//                         onClick={() => setActiveTab(key)}
//                     >
//                         {label}
//                     </button>
//                 ))}
//             </div>

//             {/* Contenu */}
//             <div className="tab-content">
//                 {activeTab === 'categories' && (
//                     <table className="categories-table">
//                         <thead>
//                             <tr>
//                                 <th>Catégorie</th>
//                                 <th>Coefficient</th>
//                                 <th>Prix de vente</th>
//                                 <th className="sortable" onClick={handleSort}>
//                                     Remise {sortOrder === 'asc' ? '▲' : '▼'}
//                                 </th>
//                                 <th></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {categories.map((cat, index) => (
//                                 <tr key={index}>
//                                     <td className="bold clickable" onClick={() => handleEditOpen(index)}>
//                                         {cat.categorie}
//                                     </td>
//                                     <td className="clickable" onClick={() => handleEditOpen(index)}>
//                                         {cat.coefficient}
//                                     </td>
//                                     <td className="clickable" onClick={() => handleEditOpen(index)}>
//                                         {cat.prixVente}
//                                     </td>
//                                     <td className="clickable" onClick={() => handleEditOpen(index)}>
//                                         {cat.remise}
//                                     </td>
//                                     <td className="center">
//                                         <button
//                                             className="delete-btn"
//                                             onClick={() => handleDeleteCategory(index)}
//                                         >
//                                             🗑️
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>

//                     </table>
//                 )}

//                 {activeTab !== 'categories' && (
//                     <div className="empty-tab">
//                         Contenu {activeTab.replace('-', ' ')}
//                     </div>
//                 )}

//                 {/* Actions */}
//                 <div className="actions">
//                     <button onClick={() => setShowModal(true)}>Ouvrir…</button>
//                     <button>Défaut</button>
//                 </div>
//             </div>

//             {/* Modal */}
//             {showModal && (
//                 <>
//                     <div className="modal-overlay" onClick={() => setShowModal(false)} />
//                     <div className="modal">
//                         <div className="modal-header">
//                             Sélectionner une catégorie
//                             <button onClick={() => setShowModal(false)}>✕</button>
//                         </div>
//                         <div className="modal-body">
//                             {categories.map((cat, i) => (
//                                 <div
//                                     key={i}
//                                     className={`modal-item ${selectedCategory === cat.categorie ? 'selected' : ''}`}
//                                     onClick={() => setSelectedCategory(cat.categorie)}
//                                 >
//                                     {cat.categorie}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="modal-footer">
//                             <button onClick={() => setShowModal(false)}>Annuler</button>
//                             <button disabled={!selectedCategory}>OK</button>
//                         </div>
//                     </div>
//                 </>
//             )}
//             {editData && (
//                 <>
//                     <div className="modal-overlay" onClick={() => setEditData(null)} />
//                     <div className="modal" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             Modifier catégorie tarifaire
//                             <button onClick={() => setEditData(null)}>✕</button>
//                         </div>

//                         <div className="modal-body form-modal">
//                             <label>Catégorie</label>
//                             <input
//                                 value={editData.categorie}
//                                 onChange={(e) =>
//                                     setEditData({ ...editData, categorie: e.target.value })
//                                 }
//                             />

//                             <label>Coefficient</label>
//                             <input
//                                 value={editData.coefficient}
//                                 onChange={(e) =>
//                                     setEditData({ ...editData, coefficient: e.target.value })
//                                 }
//                             />

//                             <label>Prix de vente</label>
//                             <input
//                                 value={editData.prixVente}
//                                 onChange={(e) =>
//                                     setEditData({ ...editData, prixVente: e.target.value })
//                                 }
//                             />

//                             <label>Remise</label>
//                             <input
//                                 value={editData.remise}
//                                 onChange={(e) =>
//                                     setEditData({ ...editData, remise: e.target.value })
//                                 }
//                             />
//                         </div>

//                         <div className="modal-footer">
//                             <button onClick={() => setEditData(null)}>Annuler</button>
//                             <button onClick={handleEditSave}>Enregistrer</button>
//                         </div>
//                     </div>
//                 </>
//             )}


//         </div>
//     );
// };

// export default CategoriesTable;

import React, { useState, useEffect } from 'react';
import './CategoriesTable.css';

const CategoriesTable = ({ categories = [], onChange }) => {
    const [activeTab, setActiveTab] = useState('categories');
    const [localCategories, setLocalCategories] = useState(categories);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState(null);

    // Synchroniser avec les props
    useEffect(() => {
        if (categories.length === 0 && localCategories.length === 0) {
            // Initialiser avec des catégories par défaut
            setLocalCategories([
                { categorie: 'GROSSISTE', coefficient: '', prixVente: '', remise: '' },
                { categorie: 'DETAILLANT', coefficient: '', prixVente: '', remise: '' }
            ]);
        } else {
            setLocalCategories(categories);
        }
    }, [categories]);

    // Notifier le parent des changements
    const updateCategories = (newCategories) => {
        setLocalCategories(newCategories);
        if (onChange) {
            onChange(newCategories);
        }
    };

    const handleSort = () => {
        const sorted = [...localCategories].sort((a, b) => {
            const remiseA = a.remise || '';
            const remiseB = b.remise || '';
            return sortOrder === 'asc'
                ? remiseA.localeCompare(remiseB)
                : remiseB.localeCompare(remiseA);
        });
        updateCategories(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDeleteCategory = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            updateCategories(localCategories.filter((_, i) => i !== index));
        }
    };

    const handleEditOpen = (index) => {
        setShowModal(false);
        setEditIndex(index);
        setEditData({ ...localCategories[index] });
    };

    const handleEditSave = () => {
        const updated = [...localCategories];
        updated[editIndex] = editData;
        updateCategories(updated);
        setEditIndex(null);
        setEditData(null);
    };

    const handleAddCategory = () => {
        if (selectedCategory) {
            const exists = localCategories.some(cat => cat.categorie === selectedCategory);
            if (!exists) {
                updateCategories([
                    ...localCategories,
                    { categorie: selectedCategory, coefficient: '', prixVente: '', remise: '' }
                ]);
            }
            setShowModal(false);
            setSelectedCategory(null);
        }
    };

    const availableCategories = [
        'GROSSISTE',
        'DETAILLANT',
        'REVENDEUR',
        'PARTICULIER',
        'ENTREPRISE',
        'COLLECTIVITE'
    ];

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
                            {localCategories.length > 0 ? (
                                localCategories.map((cat, index) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '12px', color: '#666' }}>
                                        Aucune catégorie tarifaire définie
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {activeTab !== 'categories' && (
                    <div className="empty-tab">
                        Section "{activeTab.replace('-', ' ')}" en construction
                    </div>
                )}

                {/* Actions */}
                <div className="actions">
                    <button onClick={() => setShowModal(true)}>Ajouter…</button>
                    <button onClick={() => updateCategories([])}>Réinitialiser</button>
                </div>
            </div>

            {/* Modal de sélection */}
            {showModal && (
                <>
                    <div className="modal-overlay" onClick={() => setShowModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            Sélectionner une catégorie
                            <button onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {availableCategories.map((cat, i) => (
                                <div
                                    key={i}
                                    className={`modal-item ${selectedCategory === cat ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowModal(false)}>Annuler</button>
                            <button
                                onClick={handleAddCategory}
                                disabled={!selectedCategory}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal d'édition */}
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
                                type="number"
                                step="0.01"
                                value={editData.coefficient}
                                onChange={(e) =>
                                    setEditData({ ...editData, coefficient: e.target.value })
                                }
                            />

                            <label>Prix de vente</label>
                            <input
                                type="number"
                                step="0.01"
                                value={editData.prixVente}
                                onChange={(e) =>
                                    setEditData({ ...editData, prixVente: e.target.value })
                                }
                            />

                            <label>Remise (%)</label>
                            <input
                                type="number"
                                step="0.01"
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