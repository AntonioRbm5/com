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
    updateCommande,
    createCommandeDetail,
    deleteCommandeDetail,
    searchCommandeDetail
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

    const [formData, setFormData] = useState({
        commande_client_id: '',
        commande_user_id: 1, // À récupérer depuis le contexte utilisateur
        commande_status_id: 1, // "A préparer" par défaut
        commande_action_id: 1, // À définir selon votre logique
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

    // Chargement initial des données
    useEffect(() => {
        fetchInitialData();
        if (document?.id) {
            loadExistingCommande(document.id);
        }
    }, [document]);

    // Calcul des totaux
    useEffect(() => {
        calculateTotaux();
    }, [lignes]);

    /**
     * Chargement des données de base (clients, articles)
     */
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
        } catch (error) {
            console.error('Erreur chargement données:', error);
            alert('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Chargement d'une commande existante
     */
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

                // Charger les lignes de commande
                if (commande.details && commande.details.length > 0) {
                    setLignes(commande.details.map(d => ({
                        id: d.commande_detail_id,
                        article_id: d.article.article_id,
                        ref: d.article.article_reference || '',
                        designation: d.article.article_name,
                        puht: d.article.article_prix_vente || 0,
                        qte: d.commande_detail_quantity,
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

    /**
     * Calcul des totaux
     */
    const calculateTotaux = () => {
        const totalHT = lignes.reduce((sum, ligne) => {
            return sum + parseFloat(ligne.montantNet || 0);
        }, 0);

        const totalTTC = totalHT * 1.2; // TVA 20%

        setTotaux({
            totalHT: totalHT.toFixed(2),
            totalTTC: totalTTC.toFixed(2),
            poidsNet: 0,
            poidsBrut: 0
        });
    };

    /**
     * Validation du formulaire et création de la commande
     */
    const handleValidation = async () => {
        if (!formData.commande_client_id) {
            alert('Veuillez sélectionner un client');
            return;
        }

        try {
            setLoading(true);

            // Créer la commande si elle n'existe pas
            if (!commandeId) {
                const commandeData = {
                    commande_client_id: parseInt(formData.commande_client_id),
                    commande_user_id: parseInt(formData.commande_user_id),
                    commande_status_id: parseInt(formData.commande_status_id),
                    commande_action_id: parseInt(formData.commande_action_id),
                    mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null
                };

                const response = await createCommande(commandeData);

                if (response.data.status === 'success') {
                    const newCommandeId = response.data.data.commande_id;
                    setCommandeId(newCommandeId);
                    setFormData(prev => ({
                        ...prev,
                        reference: `BC${String(newCommandeId).padStart(6, '0')}`
                    }));
                    setIsValidated(true);
                    alert('Commande créée avec succès !');
                } else {
                    throw new Error('Erreur lors de la création de la commande');
                }
            } else {
                setIsValidated(true);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la validation de la commande');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Ajout d'une ligne de commande
     */
    const handleAddLigne = async (ligneData) => {
        if (!commandeId) {
            alert('Veuillez d\'abord valider la commande');
            return;
        }

        try {
            setLoading(true);

            const detailData = {
                commande_id: commandeId,
                article_id: parseInt(ligneData.article_id),
                commande_detail_quantity: parseFloat(ligneData.qte),
                commande_detail_remise: parseFloat(ligneData.remise) || 0,
                commande_detail_subtotal: parseFloat(ligneData.montantNet)
            };

            const response = await createCommandeDetail(detailData);

            if (response.data.status === 'success') {
                const newDetail = response.data.data;

                setLignes([...lignes, {
                    id: newDetail.commande_detail_id,
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

                alert('Ligne ajoutée avec succès !');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de la ligne');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Suppression d'une ligne de commande
     */
    const handleDeleteLigne = async (index) => {
        const ligne = lignes[index];

        if (!ligne.id) {
            setLignes(lignes.filter((_, i) => i !== index));
            return;
        }

        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await deleteCommandeDetail(ligne.id);

            if (response.data.status === 'success') {
                setLignes(lignes.filter((_, i) => i !== index));
                alert('Ligne supprimée avec succès !');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de la ligne');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Sauvegarde finale du document
     */
    const handleSaveDocument = async () => {
        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne au bon de commande');
            return;
        }

        try {
            setLoading(true);

            // Mettre à jour le statut ou d'autres informations si nécessaire
            const updateData = {
                commande_status_id: formData.commande_status_id,
                mode_paiement_id: formData.mode_paiement_id
            };

            await updateCommande(commandeId, updateData);

            alert('Bon de commande enregistré avec succès !');
            if (onClose) onClose();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement du bon de commande');
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
                    title={`Bon de commande: ${isValidated ? 'Validé' : 'A préparer'} N° ${formData.reference || 'Nouveau'}`}
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
                    />

                    {isValidated && (
                        <BonCommandeValidation
                            articles={articles}
                            onAddLigne={handleAddLigne}
                            disabled={loading}
                        />
                    )}

                    <ListBonCommande
                        lignes={lignes}
                        onDeleteLigne={handleDeleteLigne}
                        isReadOnly={!isValidated}
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