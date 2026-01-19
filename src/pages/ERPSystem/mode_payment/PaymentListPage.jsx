import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../familles/famille.css";

import { getAllModePaiement, updateModePaiement } from "../../../services/modePaiementService";
import Sidebar from "../../../composants/sidebar";
import Navbar from "../../../composants/navbar";
import Header from "../../Layout/Header";
import Toolbar from "../../Layout/Toolbar";


const PaymentListPage = () => {
    const navigate = useNavigate();

    const [modes, setModes] = useState([]);
    const [filteredModes, setFilteredModes] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null);
    const [selectedId, setSelectedId] = useState(null);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editedData, setEditedData] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadModesPaiement();
    }, []);


    const loadModesPaiement = async () => {
        try {
            setLoading(true);
            const res = await getAllModePaiement();
            if (res.data.status === "success") {
                setModes(res.data.data);
                setFilteredModes(res.data.data);
            }
        } catch {
            setError("Erreur de chargement des modes de paiement");
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (mode) => {
        setSelectedId(mode.mode_paiement_id);
        setSelectedMode(mode);
        setEditedData({
            mode_paiement_libelle: mode.mode_paiement_libelle,
            mode_paiement_description: mode.mode_paiement_description || ""
        });
        setShowDetails(true);
    };


    const handleSave = async () => {
        if (!editedData.mode_paiement_libelle) {
            setError("Libellé obligatoire");
            return;
        }

        try {
            setIsSaving(true);
            await updateModePaiement(editedData, selectedId);
            loadModesPaiement();
            setError(null);
        } catch {
            setError("Erreur de sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        if (!window.confirm("Supprimer ce client ?")) return;

        await deleteModePaiement(selectedId);
        setSelectedId(null);
        setShowDetails(false);
        loadModesPaiement();
    };

    return (
        <div className="d-flex">
            <div className="window">
                
                <Toolbar
                    customButtons={[
                        { label: "Tous", icon: "📋", onClick: loadModesPaiement },
                        { label: "Nouveau", icon: "➕", onClick: () => navigate("/mode_payement/new") }
                    ]}
                />


                {error && <div className="error-box">{error}</div>}

                <div style={{ display: "flex", gap: "10px" }}>
                    <div className="famille-list-container">
                        {loading ? (
                            <div>Chargement...</div>
                        ) : (
                            <table className="famille-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Code</th>
                                        <th>Libellé</th>
                                        <th>Date création</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredModes.map((m) => (
                                        <tr
                                            key={m.mode_paiement_id}
                                            onClick={() => handleRowClick(m)}
                                            className={selectedId === m.mode_paiement_id ? "selected" : ""}
                                        >
                                            <td>👤</td>
                                            <td>{m.mode_paiement_id}</td>
                                            <td>{m.mode_paiement_libelle}</td>
                                            <td>{new Date(m.mode_paiement_inserted_at).toLocaleString("fr-FR")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showDetails && selectedMode && (
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
                                <h3 style={{ margin: 0, color: '#007bff' }}>Détails client</h3>
                            </div>
                            <div style={{
                                display: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                margin: '20px 0px'
                            }}>
                                <label>Libellé</label>
                                <input
                                    className="form-input"
                                    value={editedData.mode_paiement_libelle}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            mode_paiement_libelle: e.target.value
                                        })
                                    }
                                />

                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    value={editedData.mode_paiement_description}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            mode_paiement_description: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={handleSave}>
                                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                                </button>
                                <button className="btn" onClick={handleDelete}>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button className="btn" onClick={() => navigate("/")}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentListPage;
