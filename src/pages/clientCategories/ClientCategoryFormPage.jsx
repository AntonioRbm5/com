import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../familles/famille.css";

import Sidebar from "../../composants/sidebar";
import Navbar from "../../composants/navbar";
import Header from "../Layout/Header";

import {
    createClientCategory,
    getClientCategoryById,
    updateClientCategory
} from "../../services/clientCategoryService";

const ClientCategoryFormPage = ({ mode = "new" }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        category_name: "",
        category_description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mode === "edit" && id) {
            loadCategory();
        }
    }, []);

    const loadCategory = async () => {
        try {
            const res = await getClientCategoryById(id);
            const c = res.data.data[0];

            setFormData({
                category_name: c.category_name || "",
                category_description: c.category_description || ""
            });
        } catch {
            setError("Erreur de chargement de la catégorie");
        }
    };

    const handleSubmit = async () => {
        if (!formData.category_name) {
            setError("Nom de catégorie obligatoire");
            return;
        }

        setLoading(true);
        try {
            mode === "edit"
                ? await updateClientCategory(id, formData)
                : await createClientCategory(formData);

            navigate("/clients-categories");
        } catch {
            setError("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>

            <div style={{ width: "92%" }}>
                <Navbar />

                <div className="window">
                    <Header
                        title={
                            mode === "edit"
                                ? "Modifier catégorie client"
                                : "Nouvelle catégorie client"
                        }
                        showWindowControls
                    />

                    <div className="famille-window">
                        <h2>Catégorie client</h2>

                        {error && <div className="error-box">{error}</div>}

                        <div className="form-section">
                            <label>Nom catégorie *</label>
                            <input
                                className="form-input"
                                value={formData.category_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category_name: e.target.value
                                    })
                                }
                            />

                            <label>Description</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={formData.category_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category_description: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Enregistrement..." : "OK"}
                            </button>

                            <button
                                className="btn"
                                onClick={() => navigate("/clients-categories")}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientCategoryFormPage;
