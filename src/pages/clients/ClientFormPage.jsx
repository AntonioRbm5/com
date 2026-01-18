import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../familles/famille.css";
import { getAllClientCategory } from "../../services/clientCategoryService";
import { createClient, getClientById, updateClient } from "../../services/clientService";
import Sidebar from "../../composants/sidebar";
import Header from "../Layout/Header";
import Navbar from "../../composants/navbar";



const ClientFormPage = ({ mode = "new" }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        client_name: "",
        category_id: ""
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategories();
        if (mode === "edit" && id) loadClient();
    }, []);

    const loadCategories = async () => {
        const res = await getAllClientCategory();
        setCategories(res.data.data);
    };

    const loadClient = async () => {
        const res = await getClientById(id);
        const c = res.data.data[0];
        setFormData({
            client_name: c.client_name,
            category_id: c.category_id
        });
    };

    const handleSubmit = async () => {
        if (!formData.client_name) {
            setError("Nom obligatoire");
            return;
        }

        setLoading(true);
        try {
            mode === "edit"
                ? await updateClient(formData, id)
                : await createClient(formData);

            navigate("/clients");
        } catch {
            setError("Erreur sauvegarde");
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
                    <Header title="Clients" showWindowControls />
                    <div className="famille-window">
                        <h2>Client</h2>

                        {error && <div className="error-box">{error}</div>}

                        <div className="form-section">
                            <label>Nom client *</label>
                            <input
                                className="form-input"
                                value={formData.client_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, client_name: e.target.value })
                                }
                            />

                            <label>Catégorie</label>
                            <select
                                className="form-input"
                                value={formData.category_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, category_id: e.target.value })
                                }
                            >
                                <option value="">-- Sélectionner --</option>
                                {categories.map((c) => (
                                    <option key={c.category_id} value={c.category_id}>
                                        {c.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                {loading ? "Enregistrement..." : "OK"}
                            </button>
                            <button className="btn" onClick={() => navigate("/clients")}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default ClientFormPage;
