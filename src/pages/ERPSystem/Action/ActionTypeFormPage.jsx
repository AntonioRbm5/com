import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../familles/famille.css";

import {
    createActionType,
    getActionTypeById,
    updateActionType
} from "../../../services/actionTypeService";

const ActionTypeFormPage = ({ mode = "new" }) => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        action_type_name: "",
        action_type_description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mode === "edit" && id) {
            loadActionType();
        }
    }, []);

    const loadActionType = async () => {
        const res = await getActionTypeById(id);
        const at = res.data;

        setFormData({
            action_type_name: at.action_type_name,
            action_type_description: at.action_type_description || ""
        });
    };

    const handleSubmit = async () => {
        setError(null);

        if (!formData.action_type_name) {
            setError("Nom du type d’action obligatoire");
            return;
        }

        setLoading(true);

        try {
            mode === "edit"
                ? await updateActionType(formData, id)
                : await createActionType(formData);

            navigate("/mouvement");

        } catch (err) {
            if (err.response?.status === 422) {
                setError("Données invalides");
            } else {
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
                    <h2>Type d’action</h2>

                    {error && <div className="error-box">{error}</div>}

                    <div className="form-section">

                        <label>Nom *</label>
                        <input
                            className="form-input"
                            value={formData.action_type_name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    action_type_name: e.target.value
                                })
                            }
                        />

                        <label>Description</label>
                        <textarea
                            className="form-input"
                            value={formData.action_type_description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    action_type_description: e.target.value
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

export default ActionTypeFormPage;
