import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../familles/famille.css";

import Sidebar from "../../composants/sidebar";
import Navbar from "../../composants/navbar";
import Header from "../Layout/Header";
import Toolbar from "../Layout/Toolbar";

import {
    getAllClient,
    deleteClient,
    updateClient
} from "../../services/clientService";

const ClientListPage = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editedData, setEditedData] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const res = await getAllClient();
            if (res.data.status === "success") {
                setClients(res.data.data);
                setFilteredClients(res.data.data);
            }
        } catch (e) {
            setError("Erreur de chargement des clients");
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (client) => {
        setSelectedId(client.client_id);
        setSelectedClient(client);
        setEditedData({ client_name: client.client_name });
        setShowDetails(true);
    };

    const handleSave = async () => {
        if (!editedData.client_name) {
            setError("Nom client obligatoire");
            return;
        }

        try {
            setIsSaving(true);
            await updateClient(editedData, selectedId);
            loadClients();
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

        await deleteClient(selectedId);
        setSelectedId(null);
        setSelectedClient(null);
        setShowDetails(false);
        loadClients();
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

                    <Toolbar
                        customButtons={[
                            { label: "Tous", icon: "📋", onClick: loadClients },
                            { label: "Nouveau", icon: "➕", onClick: () => navigate("/clients/new") },
                            { label: "Catégories", icon: "🏷️", onClick: () => navigate("/clients-categories") }
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
                                            <th>Nom client</th>
                                            <th>Date création</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.map((c) => (
                                            <tr
                                                key={c.client_id}
                                                onClick={() => handleRowClick(c)}
                                                className={selectedId === c.client_id ? "selected" : ""}
                                            >
                                                <td>👤</td>
                                                <td>{c.client_id}</td>
                                                <td>{c.client_name}</td>
                                                <td>{new Date(c.client_insertion_date).toLocaleString("fr-FR")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {showDetails && selectedClient && (
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
                                    <div style={{
                                        display: 'flex',
                                        margin: '20px 0px'

                                    }}>
                                        <label className="form-label" >Code</label>
                                        <div className="form-input">{selectedClient.client_id}</div>
                                    </div>


                                    <label className="form-label">Nom</label>
                                    <input
                                        className="form-input"
                                        value={editedData.client_name}
                                        onChange={(e) =>
                                            setEditedData({ ...editedData, client_name: e.target.value })
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
        </div>
    );
};

export default ClientListPage;
