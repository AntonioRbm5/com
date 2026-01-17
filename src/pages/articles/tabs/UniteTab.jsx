import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createUnites, deleteUnites, getAllUnites, updateUnites }
    from '../../../services/uniteService';

const UniteTab = forwardRef((props, ref) => {

    const [unites, setUnites] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showCreate, setShowCreate] = useState(false);
    const [editData, setEditData] = useState(null);

    const [newData, setNewData] = useState({
        unite_libelle: '',
        unite_code: '',
        unite_type: '',
        unite_facteur_base: '',
        unite_is_base: false
    });

    // 👉 ICI ON EXPOSE AU PARENT
    useImperativeHandle(ref, () => ({
        openCreateModal() {
            setShowCreate(true);
        }
    }));

    useEffect(() => {
        loadUnites();
    }, []);

    const loadUnites = async () => {
        try {
            setLoading(true);
            const res = await getAllUnites();

            if (res.data.status === 'success') {
                setUnites(res.data.data);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await createUnites(newData);

            if (res.data.status === 'success') {
                setUnites([...unites, res.data.data]);
                setShowCreate(false);
            }
        } catch (e) {
            alert("Erreur création unité");
        }
    };

    // const handleUpdate = async () => {
    //     try {
    //         await updateUnites(editData.unite_id, editData);
    //         loadUnites();
    //         setEditData(null);
    //     } catch (e) {
    //         alert("Erreur modification");
    //     }
    // };


    const handleUpdate = async () => {
        try {
            await updateUnites(editData, editData.unite_id);

            // Recharge depuis l'API pour être sûr
            loadUnites();

            setEditData(null);

        } catch (e) {
            console.error(e);
            alert("Erreur modification");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ?")) return;

        await deleteUnites(id);
        setUnites(unites.filter(u => u.unite_id !== id));
    };

    return (
        <div>

            {/* TABLEAU */}
            {loading ? (
                <div style={{ padding: 20 }}>Chargement...</div>
            ) : (

                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>Libellé</th>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Facteur</th>
                            <th>Base</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {unites.map((u, i) => (
                            <tr key={i}>
                                <td
                                    className="clickable"
                                    onClick={() => setEditData(u)}>
                                    {u.unite_libelle}
                                </td>

                                <td>{u.unite_code}</td>
                                <td>{u.unite_type}</td>
                                <td>{u.unite_facteur_base}</td>
                                <td>{u.unite_is_base ? "Oui" : "Non"}</td>

                                <td className="center">
                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(u.unite_id)
                                        }>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}


            {showCreate && (
                <>
                    <div
                        className="categorie-modal-overlay"
                        onClick={() => setShowCreate(false)}
                    />

                    <div className="categorie-modal">

                        <div className="categorie-modal-header">
                            Nouvelle unité
                        </div>

                        <div className="categorie-modal-body">

                            <label className="form-label">Libellé *</label>
                            <input
                                className="form-input"
                                placeholder="Ex: Kilogramme"
                                value={newData.unite_libelle}
                                onChange={e =>
                                    setNewData({
                                        ...newData,
                                        unite_libelle: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Code *</label>
                            <input
                                className="form-input"
                                placeholder="Ex: KG, L, PCS"
                                value={newData.unite_code}
                                onChange={e =>
                                    setNewData({
                                        ...newData,
                                        unite_code: e.target.value.toUpperCase()
                                    })
                                }
                            />
                            <label className="form-label">Unité type</label>

                            <input
                                className="form-input"
                                placeholder="Code"
                                value={newData.unite_type}
                                onChange={e =>
                                    setNewData({
                                        ...newData,
                                        unite_type: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Facteur de base</label>
                            <input
                                className="form-input"
                                placeholder="1.0"
                                value={newData.unite_facteur_base}
                                onChange={e =>
                                    setNewData({
                                        ...newData,
                                        unite_facteur_base: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={newData.unite_is_base}
                                    onChange={e =>
                                        setNewData({
                                            ...newData,
                                            unite_is_base: e.target.checked
                                        })
                                    }
                                />
                                Unité de base
                            </label>

                        </div>

                        <div className="categorie-modal-footer">
                            <button
                                className="action-btn"
                                onClick={() => setShowCreate(false)}
                            >
                                Annuler
                            </button>

                            <button
                                className="action-btn primary"
                                onClick={handleCreate}
                                disabled={
                                    !newData.unite_libelle.trim() ||
                                    !newData.unite_code.trim()
                                }
                            >
                                Créer
                            </button>
                        </div>

                    </div>
                </>
            )}

            {editData && (
                <>
                    <div
                        className="categorie-modal-overlay"
                        onClick={() => setEditData(null)}
                    />

                    <div className="categorie-modal">

                        <div className="categorie-modal-header">
                            Modifier unité
                        </div>

                        <div className="categorie-modal-body">

                            <label className="form-label">Libellé *</label>
                            <input
                                className="form-input"
                                value={editData.unite_libelle}
                                onChange={e =>
                                    setEditData({
                                        ...editData,
                                        unite_libelle: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">Code *</label>
                            <input
                                className="form-input"
                                value={editData.unite_code}
                                onChange={e =>
                                    setEditData({
                                        ...editData,
                                        unite_code: e.target.value.toUpperCase()
                                    })
                                }
                            />

                            <label className="form-label">Unité type</label>

                            <input
                                className="form-input"
                                placeholder="Code"
                                value={editData.unite_type}
                                onChange={e =>
                                    setEditData({
                                        ...editData,
                                        unite_type: e.target.value.toUpperCase()
                                    })
                                }
                            />

                            <label className="form-label">Facteur de base</label>
                            <input
                                className="form-input"
                                value={editData.unite_facteur_base}
                                onChange={e =>
                                    setEditData({
                                        ...editData,
                                        unite_facteur_base: e.target.value
                                    })
                                }
                            />

                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={editData.unite_is_base}
                                    onChange={e =>
                                        setEditData({
                                            ...editData,
                                            unite_is_base: e.target.checked
                                        })
                                    }
                                />
                                Unité de base
                            </label>

                        </div>

                        <div className="categorie-modal-footer">
                            <button
                                className="action-btn"
                                onClick={() => setEditData(null)}
                            >
                                Annuler
                            </button>

                            <button
                                className="action-btn primary"
                                onClick={handleUpdate}
                                disabled={
                                    !editData.unite_libelle?.trim() ||
                                    !editData.unite_code?.trim()
                                }
                            >
                                Enregistrer
                            </button>
                        </div>

                    </div>
                </>
            )}


        </div>
    );
});

export default UniteTab;
