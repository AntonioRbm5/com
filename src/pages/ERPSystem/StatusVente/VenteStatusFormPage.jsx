import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../familles/famille.css";

import {
    createVenteStatus,
    getVenteStatusById,
    updateVenteStatus
} from "../../../services/venteStatusService";

const VenteStatusFormPage = ({ mode = "new" }) => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        vente_status_name: "",
        vente_status_description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mode === "edit" && id) {
            loadStatus();
        }
    }, []);

    const loadStatus = async () => {
        const res = await getVenteStatusById(id);
        const s = res.data;

        setFormData({
            vente_status_name: s.vente_status_name,
            vente_status_description: s.vente_status_description
        });
    };

    const handleSubmit = async () => {

        setError(null);

        const payload = {
            vente_status_name: formData.vente_status_name?.trim(),
            vente_status_description: formData.vente_status_description?.trim()
        };

        // 👉 VALIDATION FRONT identique BACK
        if (!payload.vente_status_name) {
            setError("Le nom du status est obligatoire");
            return;
        }

        if (!payload.vente_status_description) {
            setError("La description est obligatoire");
            return;
        }

        setLoading(true);

        try {
            if (mode === "edit") {
                await updateVenteStatus(payload, id);
            } else {
                await createVenteStatus(payload);
            }

            // 👉 ICI tu avais /mouvement → pas logique
            navigate("/vente_status");

        } catch (err) {

            console.log("ERREUR BACK =", err.response?.data);

            if (err.response?.status === 422) {
                setError("Données invalides : vérifiez les champs");
            }
            else if (err.response?.status === 400) {
                setError(
                    err.response?.data?.detail ||
                    "Format des données non valide"
                );
            }
            else {
                setError("Erreur lors de l’enregistrement");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <div className="window">

                <div className="famille-window">
                    <h2>Status Vente</h2>

                    {error && <div className="error-box">{error}</div>}

                    <div className="form-section">

                        <label>Nom *</label>
                        <input
                            className="form-input"
                            value={formData.vente_status_name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    vente_status_name: e.target.value
                                })
                            }
                        />

                        <label>Description *</label>
                        <textarea
                            className="form-input"
                            value={formData.vente_status_description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    vente_status_description: e.target.value
                                })
                            }
                        />

                    </div>

                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {loading ? "Enregistrement..." : "OK"}
                        </button>

                        <button
                            className="btn"
                            onClick={() => navigate("/mouvement")}
                        >
                            Annuler
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VenteStatusFormPage;
