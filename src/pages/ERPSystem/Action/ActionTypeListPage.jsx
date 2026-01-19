import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../familles/famille.css";

import {
    getAllActionType,
    updateActionType,
    deleteActionType
} from "../../../services/actionTypeService";

import Toolbar from "../../Layout/Toolbar";

const ActionTypeListPage = () => {

    const navigate = useNavigate();

    const [types, setTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const [editedData, setEditedData] = useState({});
    const [showDetails, setShowDetails] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadActionTypes();
    }, []);

    const loadActionTypes = async () => {
        try {
            setLoading(true);

            const res = await getAllActionType();

            const list =
                res.data?.data ||
                res.data ||
                [];

            setTypes(Array.isArray(list) ? list : []);
            setFilteredTypes(Array.isArray(list) ? list : []);

        } catch (e) {
            console.log("Erreur API:", e);
            setError("Erreur de chargement des types d’action");
            setTypes([]);
            setFilteredTypes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (type) => {

        setSelectedId(type.action_type_id);
        setSelectedType(type);

        setEditedData({
            action_type_name: type.action_type_name,
            action_type_description: type.action_type_description || ""
        });

        setShowDetails(true);
    };

    const handleSave = async () => {

        if (!editedData.action_type_name) {
            setError("Nom obligatoire");
            return;
        }

        try {
            setIsSaving(true);

            await updateActionType(editedData, selectedId);

            loadActionTypes();
            setError(null);

        } catch {
            setError("Erreur de sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {

        if (!selectedId) return;

        if (!window.confirm("Supprimer ce type d’action ?")) return;

        await deleteActionType(selectedId);

        setSelectedId(null);
        setShowDetails(false);

        loadActionTypes();
    };

    return (
        <div className="d-flex">
            <div className="window">

                <Toolbar
                    customButtons={[
                        { label: "Tous", icon: "📋", onClick: loadActionTypes },
                        { label: "Nouveau", icon: "➕", onClick: () => navigate("/action_type/new") }
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
                                        <th>Date création</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.isArray(filteredTypes) && filteredTypes.map((t) => (

                                        <tr
                                            key={t.action_type_id}
                                            onClick={() => handleRowClick(t)}
                                            className={
                                                selectedId === t.action_type_id
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            <td>⚙️</td>
                                            <td>{t.action_type_id}</td>
                                            <td>{t.action_type_name}</td>
                                            <td>
                                                {new Date(
                                                    t.action_type_added_date
                                                ).toLocaleString("fr-FR")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showDetails && selectedType && (
                        <div className="details-panel" style={{ width: "350px" }}>

                            <h3>Détails type d’action</h3>

                            <label>Nom</label>
                            <input
                                className="form-input"
                                value={editedData.action_type_name}
                                onChange={(e) =>
                                    setEditedData({
                                        ...editedData,
                                        action_type_name: e.target.value
                                    })
                                }
                            />

                            <label>Description</label>
                            <textarea
                                className="form-input"
                                value={editedData.action_type_description}
                                onChange={(e) =>
                                    setEditedData({
                                        ...editedData,
                                        action_type_description: e.target.value
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
                    <button className="btn" onClick={() => navigate("/")}>
                        Fermer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ActionTypeListPage;
