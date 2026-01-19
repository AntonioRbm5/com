import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../familles/famille.css";

import { createModePaiement, getModePaiementById, updateModePaiement } from "../../../services/modePaiementService";
import Sidebar from "../../../composants/sidebar";
import Navbar from "../../../composants/navbar";
import Header from "../../Layout/Header";



const PaymentFormPage = ({ mode = "new" }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        mode_paiement_libelle: "",
        mode_paiement_description: ""
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mode === "edit" && id) loadModePaiement();
    }, []);


    const loadModePaiement = async () => {
        const res = await getModePaiementById(id);
        const mp = res.data.data;

        setFormData({
            mode_paiement_libelle: mp.mode_paiement_libelle,
            mode_paiement_description: mp.mode_paiement_description || ""
        });
    };



    const handleSubmit = async () => {
        setError(null);

        if (!formData.mode_paiement_libelle) {
            setError("Libellé obligatoire");
            return;
        }

        setLoading(true);
        try {
            mode === "edit"
                ? await updateModePaiement(formData, id)
                : await createModePaiement(formData);

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
                    <h2>Mode de payment</h2>

                    {error && <div className="error-box">{error}</div>}

                    <div className="form-section">
                        <label>Libellé *</label>
                        <input
                            className="form-input"
                            value={formData.mode_paiement_libelle}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    mode_paiement_libelle: e.target.value
                                })
                            }
                        />

                        <label>Description</label>
                        <textarea
                            className="form-input"
                            value={formData.mode_paiement_description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    mode_paiement_description: e.target.value
                                })
                            }
                        />
                    </div>


                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {loading ? "Enregistrement..." : "OK"}
                        </button>
                        <button className="btn" onClick={() => navigate("/mouvement")}>
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PaymentFormPage;
