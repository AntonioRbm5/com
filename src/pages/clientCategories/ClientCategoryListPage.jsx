import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../familles/famille.css";

import Sidebar from "../../composants/sidebar";
import Navbar from "../../composants/navbar";
import Header from "../Layout/Header";
import Toolbar from "../Layout/Toolbar";

import {
    getAllClientCategory,
    deleteClientCategory
} from "../../services/clientCategoryService";

const ClientCategoryListPage = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const res = await getAllClientCategory();
            if (res.data.status === "success") {
                setCategories(res.data.data);
            }
        } catch {
            setError("Erreur de chargement des catégories");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette catégorie ?")) return;
        await deleteClientCategory(id);
        loadCategories();
        setSelectedCategory(null);
    };

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>

            <div style={{ width: "92%" }}>
                <Navbar />

                <div className="window">
                    <Header title="Catégories Clients" showWindowControls />

                    <Toolbar
                        customButtons={[
                            { label: "Actualiser", icon: "🔄", onClick: loadCategories },
                            { label: "Nouvelle catégorie", icon: "➕", onClick: () => navigate("/clients-categories/new") },
                            { label: "Clients", icon: "🏷️", onClick: () => navigate("/clients") }
                        ]}
                    />

                    {error && <div className="error-box">{error}</div>}

                    <div style={{ display: "flex", gap: "10px" }}>
                        {/* LISTE */}
                        <div className="famille-list-container">
                            {loading ? (
                                <div>Chargement...</div>
                            ) : (
                                <table className="famille-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>ID</th>
                                            <th>Nom catégorie</th>
                                            <th>Description</th>
                                            <th>Nb clients</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c) => (
                                            <tr
                                                key={c.category_id}
                                                onClick={() => setSelectedCategory(c)}
                                                className={
                                                    selectedCategory?.category_id === c.category_id
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                <td>🏷️</td>
                                                <td>{c.category_id}</td>
                                                <td>{c.category_name}</td>
                                                <td>{c.category_description || "-"}</td>
                                                <td>{c.clients.length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* DETAILS */}
                        {selectedCategory && (
                            <div className="details-panel" style={{
                                width: '350px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '15px',
                                backgroundColor: '#fff',
                                overflowY: 'auto'
                            }}>
                                <div style={{

                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #007bff',
                                    paddingBottom: '10px'
                                }}>
                                    <h3>Détails catégorie</h3>
                                </div>
                                <div style={{
                                    display: 'row',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    margin: '20px 0px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        margin: '20px 0px'

                                    }}>
                                        <label className="form-label" >ID</label>
                                        <div className="form-input">{selectedCategory.category_id}</div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        margin: '20px 0px'

                                    }}>
                                        <label className="form-label" >Nom</label>
                                        <div className="form-input">{selectedCategory.category_name}</div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        margin: '20px 0px'

                                    }}>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        margin: ' 0px'

                                    }}>

                                        <label className="form-label" >Description</label>
                                        <div className="form-input">{selectedCategory.category_description || "-"}</div>
                                    </div>
                                </div>
                                <div style={{

                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #007bff',
                                    paddingBottom: '10px'
                                }}>
                                    <h4 style={{ marginTop: "15px" }}>
                                        Clients ({selectedCategory.clients.length})
                                    </h4>
                                </div>

                                {selectedCategory.clients.length === 0 ? (
                                    <div style={{
                                        display: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        margin: '20px 0px'
                                    }}>Aucun client</div>
                                ) : (
                                    <ul style={{
                                        display: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                    }}>
                                        {selectedCategory.clients.map((cl) => (
                                            <li style={{
                                                display: 'flex',
                                                margin: '10px 0px'
                                            }} key={cl.client_id}>
                                                👤 {cl.client_name}
                                                <small style={{

                                                    margin: '0px 10px'
                                                }}>
                                                    Créé le{" "}
                                                    {new Date(
                                                        cl.client_insertion_date
                                                    ).toLocaleString("fr-FR")}
                                                </small>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="form-actions">
                                    <button
                                        className="btn"
                                        onClick={() =>
                                            handleDelete(selectedCategory.category_id)
                                        }
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn"
                            onClick={() => navigate("/clients")}
                        >
                            Retour clients
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientCategoryListPage;
