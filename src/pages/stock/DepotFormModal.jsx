import React, { useState, useEffect } from 'react';
import {
    createStockageDepot,
    updateStockageDepot,
    prepareDepotData
} from '../../services/stockService';
import './stock.css';

const DepotFormModal = ({ show, onHide, depot, onSaveSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        responsableId: 1
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            if (depot) {
                // Mode édition
                setFormData({
                    name: depot.name || '',
                    code: depot.code || '',
                    responsableId: depot.responsableId || 1
                });
            } else {
                // Mode création
                setFormData({
                    name: '',
                    code: '',
                    responsableId: 1
                });
            }
            setErrors({});
        }
    }, [show, depot]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom du dépôt est obligatoire';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Le code du dépôt est obligatoire';
        } else if (formData.code.length > 10) {
            newErrors.code = 'Le code ne peut pas dépasser 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const apiData = prepareDepotData(formData);
            console.log('📤 Données à envoyer:', apiData);

            let response;
            if (depot) {
                // Mode modification
                console.log('🔄 Mise à jour du dépôt ID:', depot.id);
                response = await updateStockageDepot(depot.id, apiData);
            } else {
                // Mode création
                console.log('✨ Création d\'un nouveau dépôt');
                response = await createStockageDepot(apiData);
            }

            console.log('📨 Réponse API:', response?.data);

            if (response?.data?.status === 'success') {
                alert(depot 
                    ? '✅ Dépôt modifié avec succès' 
                    : '✅ Dépôt créé avec succès'
                );
                onSaveSuccess();
            } else {
                const errorMsg = response?.data?.message || 'Erreur lors de la sauvegarde';
                alert(`❌ ${errorMsg}`);
            }
        } catch (err) {
            console.error('❌ Erreur sauvegarde:', err);
            
            let errorMessage = 'Erreur lors de la sauvegarde du dépôt';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(`❌ Erreur: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            code: '',
            responsableId: 1
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
                    <button className="mouvement-toolbar-btn" disabled>
                        ⚙ Fonctions
                    </button>
                    <button className="mouvement-toolbar-btn" disabled>
                        📋 Aide
                    </button>
                </div>

                {/* Form Body */}
                <div style={{ padding: '30px' }}>
                    <div className="mouvement-form-header">
                        
                        {/* Nom du dépôt */}
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
                                        width: '100%', 
                                        padding: '10px',
                                        border: errors.name ? '2px solid red' : '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Code du dépôt */}
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
                                        width: '100%', 
                                        padding: '10px',
                                        border: errors.code ? '2px solid red' : '1px solid #ccc',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <small style={{ color: '#666', fontSize: '12px' }}>
                                    Maximum 10 caractères
                                </small>
                            </div>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className="mouvement-form-row">
                            <div className="mouvement-form-group" style={{ flex: 1 }}>
                                <label>Responsable ID</label>
                                <input
                                    type="number"
                                    name="responsableId"
                                    value={formData.responsableId}
                                    onChange={handleInputChange}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                />
                                <small style={{ color: '#666', fontSize: '12px' }}>
                                    ID du responsable du dépôt (par défaut: 1)
                                </small>
                            </div>
                        </div>

                        {/* Informations mode édition */}
                        {depot && (
                            <div style={{
                                marginTop: '20px',
                                padding: '15px',
                                backgroundColor: '#f0f8ff',
                                borderRadius: '4px',
                                border: '1px solid #b3d9ff'
                            }}>
                                <div style={{ fontSize: '13px', color: '#333' }}>
                                    <strong>📋 Informations du dépôt:</strong>
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                    <div>• ID: {depot.id}</div>
                                    <div>• Créé le: {new Date(depot.addedDate).toLocaleString('fr-FR')}</div>
                                    <div>• Modifié le: {new Date(depot.updatedDate).toLocaleString('fr-FR')}</div>
                                    <div>• Responsable actuel: {depot.responsable}</div>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div style={{
                            marginTop: '20px',
                            padding: '12px',
                            backgroundColor: '#fff3cd',
                            borderRadius: '4px',
                            border: '1px solid #ffc107',
                            fontSize: '13px'
                        }}>
                            <strong>💡 Astuce:</strong> Le code du dépôt doit être unique et court 
                            pour faciliter les saisies rapides. Utilisez des codes mnémoniques 
                            (ex: SIEGE, DP-N, ENT01).
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mouvement-modal-footer">
                    <button
                        className="btn-custom btn-primary-custom"
                        onClick={handleSubmit}
                        disabled={loading}
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