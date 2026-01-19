import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../familles/famille.css";

import {
    getAllVenteStatus,
    updateVenteStatus,
    deleteVenteStatus
} from "../../../services/venteStatusService";

import Toolbar from "../../Layout/Toolbar";

const VenteStatusListPage = () => {

    const navigate = useNavigate();

    const [status, setStatus] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState([]);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [editedData, setEditedData] = useState({});
    const [showDetails, setShowDetails] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            setLoading(true);

            const res = await getAllVenteStatus();

            const list =
                res.data?.data ||
                res.data ||
                [];

            setStatus(Array.isArray(list) ? list : []);
            setFilteredStatus(Array.isArray(list) ? list : []);

        } catch {
            setError("Erreur de chargement des status vente");
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (s) => {

        setSelectedId(s.vente_status_id);
        setSelectedStatus(s);

        setEditedData({
            vente_status_name: s.vente_status_name,
            vente_status_description: s.vente_status_description
        });

        setShowDetails(true);
    };

    const handleSave = async () => {

        if (!editedData.vente_status_name) {
            setError("Nom obligatoire");
            return;
        }

        try {
            setIsSaving(true);

            await updateVenteStatus(editedData, selectedId);

            loadStatus();
            setError(null);

        } catch {
            setError("Erreur de sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {

        if (!selectedId) return;

        if (!window.confirm("Supprimer ce status ?")) return;

        await deleteVenteStatus(selectedId);

        setSelectedId(null);
        setShowDetails(false);

        loadStatus();
    };

    return (
        <div className="d-flex">
            <div className="window">

                <Toolbar
                    customButtons={[
                        { label: "Tous", icon: "📋", onClick: loadStatus },
                        { label: "Nouveau", icon: "➕", onClick: () => navigate("/vente_status/new") }
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
                                        <th>Nom</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.isArray(filteredStatus) &&
                                        filteredStatus.map((t) => (
                                            <tr
                                                key={t.vente_status_id}
                                                onClick={() => handleRowClick(t)}
                                                className={
                                                    selectedId === t.vente_status_id
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                <td>📌</td>
                                                <td>{t.vente_status_id}</td>
                                                <td>{t.vente_status_name}</td>
                                                <td>{t.vente_status_description}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showDetails && selectedStatus && (
                        <div className="details-panel" style={{ width: "350px" }}>

                            <h3>Détails status</h3>

                            <label>Nom</label>
                            <input
                                className="form-input"
                                value={editedData.vente_status_name}
                                onChange={(e) =>
                                    setEditedData({
                                        ...editedData,
                                        vente_status_name: e.target.value
                                    })
                                }
                            />

                            <label>Description</label>
                            <textarea
                                className="form-input"
                                value={editedData.vente_status_description}
                                onChange={(e) =>
                                    setEditedData({
                                        ...editedData,
                                        vente_status_description: e.target.value
                                    })
                                }
                            />

                            <div className="form-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                >
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
                    <button className="btn" onClick={() => navigate("/mouvement")}>
                        Fermer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VenteStatusListPage;
