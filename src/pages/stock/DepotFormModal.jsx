import React, { useState, useEffect } from 'react';
import {
    createStockageDepot,
    updateStockageDepot,
} from '../../services/stockService';
import './stock.css';
import { getAllTelecommunication } from '../../services/telecommunicationService';
import { getAllCoordonnees } from '../../services/coordonneeService';
import { getAllUsers } from '../../services/userService';

const DepotFormModal = ({ show, onHide, depot, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        depot_coordonnees_id: '',
        depot_telecommunication_id: '',
        depot_responsable_id: ''
    });
    const [errors, setErrors] = useState({});

    const [coordonneesList, setCoordonneesList] = useState([]);
    const [telecommunicationsList, setTelecommunicationsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // ─── Chargement des listes ─────────────────────────────────────────────────
    useEffect(() => {
        const fetchSelectData = async () => {
            try {
                setLoadingData(true);

                const [coordonneesRes, telecomsRes, usersRes] = await Promise.all([
                    getAllCoordonnees().catch(() => ({ data: { data: [] } })),
                    getAllTelecommunication().catch(() => ({ data: { data: [] } })),
                    getAllUsers().catch(() => ({ data: { data: [] } }))
                ]);

                const coordonnees = Array.isArray(coordonneesRes?.data?.data)
                    ? coordonneesRes.data.data
                    : Array.isArray(coordonneesRes?.data) ? coordonneesRes.data : [];

                const telecoms = Array.isArray(telecomsRes?.data?.data)
                    ? telecomsRes.data.data
                    : Array.isArray(telecomsRes?.data) ? telecomsRes.data : [];

                const allUsers = Array.isArray(usersRes?.data?.data)
                    ? usersRes.data.data
                    : Array.isArray(usersRes?.data) ? usersRes.data : [];

                // ── Log pour déboguer la structure exacte ──
                console.log("🔑 Premier user:", JSON.stringify(allUsers[0], null, 2));

                // ── Filtrer uniquement les responsables ──
                // role_id === 4 correspond à "responsable" selon votre API des rôles
                const responsables = allUsers.filter(u =>
                    u.role_id === 4 ||
                    u.role?.role_id === 4 ||
                    u.role?.role_name === "responsable" ||
                    u.roles?.some(r => r.role_name === "responsable" || r.role_id === 4)
                );

                setCoordonneesList(coordonnees);
                setTelecommunicationsList(telecoms);
                // Si aucun responsable trouvé → afficher tous les users en fallback
                setUsersList(responsables.length > 0 ? responsables : allUsers);

            } catch (error) {
                console.error('❌ Erreur chargement données:', error);
                alert('⚠️ Erreur lors du chargement des données de référence');
            } finally {
                setLoadingData(false);
            }
        };

        if (show) fetchSelectData();
    }, [show]);

    // ─── Remplir en mode édition ───────────────────────────────────────────────
    useEffect(() => {
        if (show) {
            if (depot) {
                // ── Le backend retourne coordonne{} et telecom{} et responsable{}
                // ── pas directement les IDs → il faut les extraire
                console.log("📋 Depot reçu en édition:", depot);

                setFormData({
                    name: depot.name || depot.depot_name || '',
                    code: depot.code || depot.depot_code || '',

                    // Extraire l'ID depuis l'objet imbriqué OU depuis le champ plat
                    depot_coordonnees_id: String(
                        depot.depot_coordonnees_id ||
                        depot.coordonne?.coordonnees_id ||
                        ''
                    ),
                    depot_telecommunication_id: String(
                        depot.depot_telecommunication_id ||
                        depot.telecom?.telecom_info_id ||
                        ''
                    ),
                    depot_responsable_id: String(
                        depot.depot_responsable_id ||
                        depot.responsable?.id ||
                        ''
                    ),
                });
            } else {
                setFormData({
                    name: '',
                    code: '',
                    depot_coordonnees_id: '',
                    depot_telecommunication_id: '',
                    depot_responsable_id: ''
                });
            }
            setErrors({});
        }
    }, [show, depot]);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim())
            newErrors.name = 'Le nom du dépôt est obligatoire';
        if (!formData.code.trim())
            newErrors.code = 'Le code du dépôt est obligatoire';
        else if (formData.code.length > 10)
            newErrors.code = 'Le code ne peut pas dépasser 10 caractères';
        if (!formData.depot_coordonnees_id)
            newErrors.depot_coordonnees_id = 'Veuillez sélectionner une coordonnée';
        if (!formData.depot_telecommunication_id)
            newErrors.depot_telecommunication_id = 'Veuillez sélectionner une télécommunication';
        if (!formData.depot_responsable_id)
            newErrors.depot_responsable_id = 'Veuillez sélectionner un responsable';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const apiData = {
                depot_name: formData.name,
                depot_code: formData.code,
                depot_coordonnees_id: parseInt(formData.depot_coordonnees_id),
                depot_telecommunication_id: parseInt(formData.depot_telecommunication_id),
                depot_responsable_id: parseInt(formData.depot_responsable_id)
            };

            console.log('📤 Données envoyées au backend:', apiData);

            let response;
            if (depot) {
                response = await updateStockageDepot(depot.id, apiData);
            } else {
                response = await createStockageDepot(apiData);
            }

            console.log('📨 Réponse backend:', response?.data);

            if (response?.data?.status === 'success') {
                alert(depot ? '✅ Dépôt modifié avec succès' : '✅ Dépôt créé avec succès');
                onSaveSuccess();
            } else {
                alert(`❌ ${response?.data?.message || 'Erreur lors de la sauvegarde'}`);
            }
        } catch (err) {
            console.error('❌ Erreur sauvegarde:', err);
            // ── Afficher le détail de l'erreur 500 du backend ──
            console.error('❌ Détail erreur backend:', err.response?.data);
            alert(`❌ Erreur: ${err.response?.data?.detail || err.response?.data?.message || err.message || 'Erreur inconnue'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            code: '',
            depot_coordonnees_id: '',
            depot_telecommunication_id: '',
            depot_responsable_id: ''
        });
        setErrors({});
        onHide();
    };

    if (!show) return null;

    return (
        <div className="mouvement-modal-overlay">
            <div className="mouvement-modal-container" style={{ maxWidth: '600px' }}>

                {/* Header */}
                <div className="mouvement-modal-header">
                    <span className="mouvement-modal-title">
                        {depot ? '✏️ Modifier le Dépôt' : '➕ Nouveau Dépôt'}
                    </span>
                    <button className="close-btn" onClick={handleCancel}>×</button>
                </div>

                {/* Toolbar */}
                <div className="mouvement-toolbar">
                    <button className="mouvement-toolbar-btn" disabled>⚙ Fonctions</button>
                    <button className="mouvement-toolbar-btn" disabled>📋 Aide</button>
                </div>

                {/* Body */}
                <div style={{ padding: '30px' }}>
                    {loadingData ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                            <div>Chargement des données...</div>
                        </div>
                    ) : (
                        <div className="mouvement-form-header">

                            {/* ── Nom du dépôt ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label>
                                        Nom du Dépôt *
                                        {errors.name && (
                                            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>
                                                {errors.name}
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Dépôt principal, Entrepôt nord..."
                                        style={{
                                            width: '100%', padding: '10px',
                                            border: errors.name ? '2px solid red' : '1px solid #ccc',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ── Code du dépôt ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label>
                                        Code du Dépôt *
                                        {errors.code && (
                                            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>
                                                {errors.code}
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="Ex: DP01, ENT-N, SIEGE..."
                                        maxLength={10}
                                        style={{
                                            width: '100%', padding: '10px',
                                            border: errors.code ? '2px solid red' : '1px solid #ccc',
                                            borderRadius: '4px', textTransform: 'uppercase'
                                        }}
                                    />
                                    <small style={{ color: '#666', fontSize: '12px' }}>
                                        Maximum 10 caractères
                                    </small>
                                </div>
                            </div>

                            {/* ── Coordonnées ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label>
                                        Coordonnées *
                                        {errors.depot_coordonnees_id && (
                                            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>
                                                {errors.depot_coordonnees_id}
                                            </span>
                                        )}
                                    </label>
                                    <select
                                        name="depot_coordonnees_id"
                                        value={formData.depot_coordonnees_id}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%', padding: '10px',
                                            border: errors.depot_coordonnees_id ? '2px solid red' : '1px solid #ccc',
                                            borderRadius: '4px', backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="">-- Sélectionner une coordonnée --</option>
                                        {coordonneesList.map((coord, index) => (
                                            <option
                                                key={`coord-${coord.coordonnees_id ?? index}`}
                                                value={String(coord.coordonnees_id)}
                                            >
                                                {coord.coordonnees_ville} - {coord.coordonnees_address} ({coord.coordonnees_pays})
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: '#666', fontSize: '12px' }}>
                                        {coordonneesList.length === 0
                                            ? '⚠️ Aucune coordonnée disponible'
                                            : `${coordonneesList.length} coordonnée(s) disponible(s)`}
                                    </small>
                                </div>
                            </div>

                            {/* ── Télécommunication ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label>
                                        Télécommunication *
                                        {errors.depot_telecommunication_id && (
                                            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>
                                                {errors.depot_telecommunication_id}
                                            </span>
                                        )}
                                    </label>
                                    <select
                                        name="depot_telecommunication_id"
                                        value={formData.depot_telecommunication_id}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%', padding: '10px',
                                            border: errors.depot_telecommunication_id ? '2px solid red' : '1px solid #ccc',
                                            borderRadius: '4px', backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="">-- Sélectionner une télécommunication --</option>
                                        {telecommunicationsList.map((telecom, index) => (
                                            <option
                                                key={`telecom-${telecom.telecom_info_id ?? index}`}
                                                value={String(telecom.telecom_info_id)}
                                            >
                                                {telecom.telecom_info_tel} — {telecom.telecom_info_email}
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: '#666', fontSize: '12px' }}>
                                        {telecommunicationsList.length === 0
                                            ? '⚠️ Aucune télécommunication disponible'
                                            : `${telecommunicationsList.length} télécommunication(s) disponible(s)`}
                                    </small>
                                </div>
                            </div>

                            {/* ── Responsable ── */}
                            <div className="mouvement-form-row">
                                <div className="mouvement-form-group" style={{ flex: 1 }}>
                                    <label>
                                        Responsable *
                                        {errors.depot_responsable_id && (
                                            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>
                                                {errors.depot_responsable_id}
                                            </span>
                                        )}
                                    </label>
                                    <select
                                        name="depot_responsable_id"
                                        value={formData.depot_responsable_id}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%', padding: '10px',
                                            border: errors.depot_responsable_id ? '2px solid red' : '1px solid #ccc',
                                            borderRadius: '4px', backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="">-- Sélectionner un responsable --</option>
                                        {usersList.map((user) => (
                                            <option
                                                key={user.id}
                                                value={String(user.id)}  // ✅ String obligatoire
                                            >
                                                {user.username || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
                                                {user.role?.role_name ? ` — ${user.role.role_name}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: '#666', fontSize: '12px' }}>
                                        {usersList.length === 0
                                            ? '⚠️ Aucun responsable disponible'
                                            : `${usersList.length} responsable(s) disponible(s)`}
                                    </small>
                                </div>
                            </div>

                            {/* ── Infos mode édition ── */}
                            {depot && (
                                <div style={{
                                    marginTop: '20px', padding: '15px',
                                    backgroundColor: '#f0f8ff', borderRadius: '4px',
                                    border: '1px solid #b3d9ff'
                                }}>
                                    <div style={{ fontSize: '13px', color: '#333' }}>
                                        <strong>📋 Informations du dépôt:</strong>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                        <div>• ID: {depot.id}</div>
                                        <div>• Créé le: {new Date(depot.addedDate).toLocaleString('fr-FR')}</div>
                                        <div>• Modifié le: {new Date(depot.updatedDate).toLocaleString('fr-FR')}</div>
                                    </div>
                                </div>
                            )}

                            {/* ── Astuce ── */}
                            <div style={{
                                marginTop: '20px', padding: '12px',
                                backgroundColor: '#fff3cd', borderRadius: '4px',
                                border: '1px solid #ffc107', fontSize: '13px'
                            }}>
                                <strong>💡 Astuce:</strong> Le code du dépôt doit être unique et court
                                pour faciliter les saisies rapides. Utilisez des codes mnémoniques
                                (ex: SIEGE, DP-N, ENT01).
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mouvement-modal-footer">
                    <button
                        className="btn-custom btn-primary-custom"
                        onClick={handleSubmit}
                        disabled={loading || loadingData}
                    >
                        {loading
                            ? '⏳ Enregistrement...'
                            : depot
                                ? '💾 Enregistrer les modifications'
                                : '✅ Créer le dépôt'
                        }
                    </button>
                    <button
                        className="btn-custom btn-secondary-custom"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DepotFormModal;