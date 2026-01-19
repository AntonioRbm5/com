import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListBonCommande from './ListBonCommande';
import FormBonCommande from './FormBonCommande';
import BonCommandeValidation from './BonCommandeValidation';
import {
    createCommande,
    getCommandeById,
    updateCommande
} from '../../../services/commandeService';
import { getAllClient } from '../../../services/clientService';
import { getAllArticles } from '../../../services/articleService';

const BonCommande = ({ document, onClose }) => {
    const [isValidated, setIsValidated] = useState(false);
    const [commandeId, setCommandeId] = useState(null);
    const [lignes, setLignes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [articles, setArticles] = useState([]);
    const [actions, setActions] = useState([]);

    const [formData, setFormData] = useState({
        commande_client_id: '',
        commande_user_id: 1,
        commande_status_id: 1,
        commande_action_id: '',
        mode_paiement_id: null,
        reference: '',
        date: new Date().toISOString().split('T')[0],
        dateLivraison: '',
        affaire: '',
        expedition: ''
    });

    const [totaux, setTotaux] = useState({
        totalHT: 0,
        totalTTC: 0,
        poidsNet: 0,
        poidsBrut: 0
    });

    useEffect(() => {
        fetchInitialData();
        if (document?.id) {
            loadExistingCommande(document.id);
        }
    }, [document]);

    useEffect(() => {
        calculateTotaux();
    }, [lignes]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [clientsRes, articlesRes] = await Promise.all([
                getAllClient(),
                getAllArticles()
            ]);

            if (clientsRes.data.status === 'success') {
                setClients(clientsRes.data.data || []);
            }

            if (articlesRes.data.status === 'success') {
                setArticles(articlesRes.data.data || []);
            }

            setFormData(prev => ({
                ...prev,
                commande_action_id: 1
            }));

        } catch (error) {
            console.error('Erreur chargement données:', error);
            alert('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const loadExistingCommande = async (id) => {
        try {
            setLoading(true);
            const response = await getCommandeById(id);

            if (response.data.status === 'success') {
                const commande = response.data.data;
                setCommandeId(commande.commande_id);
                setFormData({
                    commande_client_id: commande.client?.client_id || '',
                    commande_user_id: commande.user?.id || 1,
                    commande_status_id: commande.commande_status?.commande_status_id || 1,
                    commande_action_id: commande.action?.action_id || 1,
                    mode_paiement_id: commande.mode_paiement?.mode_paiement_id || null,
                    reference: `BC${String(commande.commande_id).padStart(6, '0')}`,
                    date: new Date(commande.commande_added_date).toISOString().split('T')[0]
                });

                if (commande.details && commande.details.length > 0) {
                    setLignes(commande.details.map(d => ({
                        article_id: d.article.article_id,
                        ref: d.article.article_reference || '',
                        designation: d.article.article_name,
                        puht: d.article.article_prix_vente || 0,
                        qte: d.commande_detail_quantity,
                        conditionner: d.conditionner || 'PIECE',
                        remise: d.commande_detail_remise || 0,
                        totalBrut: (d.article.article_prix_vente * d.commande_detail_quantity).toFixed(2),
                        montantNet: d.commande_detail_subtotal.toFixed(2)
                    })));
                    setIsValidated(true);
                }
            }
        } catch (error) {
            console.error('Erreur chargement commande:', error);
            alert('Erreur lors du chargement de la commande');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotaux = () => {
        const totalHT = lignes.reduce((sum, ligne) => {
            return sum + parseFloat(ligne.montantNet || 0);
        }, 0);

        const totalTTC = totalHT * 1.2;

        setTotaux({
            totalHT: totalHT.toFixed(2),
            totalTTC: totalTTC.toFixed(2),
            poidsNet: 0,
            poidsBrut: 0
        });
    };

    const handleValidation = async () => {
        if (!formData.commande_client_id) {
            alert('Veuillez sélectionner un client');
            return;
        }

        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne avant de valider');
            return;
        }

        if (!formData.commande_action_id) {
            alert('❌ Action non définie. Veuillez vérifier la configuration.');
            console.error('commande_action_id est requis mais non défini');
            return;
        }

        try {
            setLoading(true);

            const details = lignes.map(ligne => ({
                article_id: parseInt(ligne.article_id),
                commande_detail_quantity: parseFloat(ligne.qte),
                commande_detail_remise: parseFloat(ligne.remise) || 0,
                commande_detail_subtotal: parseFloat(ligne.montantNet)
            }));

            const commandeData = {
                commande_action_id: parseInt(formData.commande_action_id),
                commande_client_id: parseInt(formData.commande_client_id),
                commande_user_id: parseInt(formData.commande_user_id),
                commande_status_id: parseInt(formData.commande_status_id),
                mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null,
                details: details
            };

            console.log('📤 Données envoyées à l\'API:', JSON.stringify(commandeData, null, 2));

            if (!commandeId) {
                const response = await createCommande(commandeData);

                console.log('📥 Réponse de l\'API:', response);

                if (response.data.status === 'success') {
                    const newCommandeId = response.data.data.commande_id;
                    setCommandeId(newCommandeId);
                    setFormData(prev => ({
                        ...prev,
                        reference: `BC${String(newCommandeId).padStart(6, '0')}`
                    }));
                    setIsValidated(true);
                    alert('✅ Commande créée avec succès !');
                } else {
                    throw new Error(response.data.message || 'Erreur lors de la création de la commande');
                }
            } else {
                setIsValidated(true);
                alert('Commande validée avec succès !');
            }
        } catch (error) {
            console.error('❌ Erreur complète:', error);
            console.error('❌ Réponse erreur:', error.response);
            console.error('❌ Données erreur:', error.response?.data);

            // CORRECTION: Gérer les différents formats d'erreur
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;

                // Si detail est un tableau (erreurs de validation FastAPI)
                if (Array.isArray(detail)) {
                    const errorMessages = detail.map(err => {
                        const field = err.loc ? err.loc.join('.') : 'inconnu';
                        return `• ${field}: ${err.msg}`;
                    }).join('\n');
                    alert(`❌ Erreur de validation:\n\n${errorMessages}`);
                }
                // Si detail est un objet avec message d'erreur
                else if (typeof detail === 'object' && detail.message) {
                    alert(`❌ ${detail.message}\n\nCode: ${detail.error_code || 'INCONNU'}\n\n⚠️ Vérifiez les logs du serveur pour plus de détails.`);
                }
                // Si detail est un autre type d'objet
                else if (typeof detail === 'object') {
                    alert(`❌ Erreur:\n\n${JSON.stringify(detail, null, 2)}`);
                }
                // Si detail est une chaîne
                else {
                    alert(`❌ Erreur: ${detail}`);
                }
            } else if (error.response?.data?.message) {
                alert(`❌ Erreur: ${error.response.data.message}`);
            } else if (error.response?.data) {
                alert(`❌ Erreur: ${JSON.stringify(error.response.data)}`);
            } else {
                alert(error.message || 'Erreur lors de la validation de la commande');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddLigne = async (ligneData) => {
        if (isValidated) {
            alert('La commande est déjà validée. Impossible d\'ajouter des lignes.');
            return;
        }

        setLignes([...lignes, {
            article_id: ligneData.article_id,
            ref: ligneData.ref,
            designation: ligneData.designation,
            puht: ligneData.puht,
            qte: ligneData.qte,
            conditionner: ligneData.conditionner,
            remise: ligneData.remise,
            totalBrut: ligneData.totalBrut,
            montantNet: ligneData.montantNet
        }]);
    };

    const handleDeleteLigne = async (index) => {
        if (isValidated) {
            alert('Impossible de supprimer une ligne après validation de la commande');
            return;
        }

        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            return;
        }

        setLignes(lignes.filter((_, i) => i !== index));
    };

    const handleSaveDocument = async () => {
        if (!commandeId) {
            alert('Veuillez d\'abord valider la commande');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                commande_status_id: parseInt(formData.commande_status_id),
                mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null
            };

            const response = await updateCommande(commandeId, updateData);

            if (response.data.status === 'success') {
                alert('Bon de commande mis à jour avec succès !');
                if (onClose) onClose();
            } else {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    const errorMessages = detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n');
                    alert(`Erreur de validation:\n${errorMessages}`);
                } else {
                    alert(`Erreur: ${JSON.stringify(detail)}`);
                }
            } else {
                alert(error.message || 'Erreur lors de l\'enregistrement du bon de commande');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div>
            <div className="invoice-wrapper">
                <DocumentHeader
                    title={`Bon de commande: ${isValidated ? 'Validé' : 'Brouillon'} N° ${formData.reference || 'Nouveau'}`}
                    onClose={onClose}
                />

                <DocumentToolbar
                    onSave={handleSaveDocument}
                    onPrint={handlePrint}
                    disabled={loading || !isValidated}
                />

                <div className="invoice-body">
                    <FormBonCommande
                        formData={formData}
                        setFormData={setFormData}
                        clients={clients}
                        onValidate={handleValidation}
                        isReadOnly={isValidated}
                        hasLignes={lignes.length > 0}
                        lignesCount={lignes.length}
                    />

                    {!isValidated && (
                        <BonCommandeValidation
                            articles={articles}
                            onAddLigne={handleAddLigne}
                            disabled={loading || !formData.commande_client_id}
                        />
                    )}

                    <ListBonCommande
                        lignes={lignes}
                        onDeleteLigne={handleDeleteLigne}
                        isReadOnly={isValidated}
                    />

                    <DocumentFooter
                        poidsNet={totaux.poidsNet}
                        poidsBrut={totaux.poidsBrut}
                        totalHT={formatCurrency(totaux.totalHT)}
                        totalTTC={formatCurrency(totaux.totalTTC)}
                    />
                </div>

                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BonCommande;