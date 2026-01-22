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

    // ✅ CORRECTION 1: Charger d'abord les données de référence
    useEffect(() => {
        fetchInitialData();
    }, []);

    // ✅ CORRECTION 2: Charger la commande APRÈS que les données soient disponibles
    useEffect(() => {
        if (document?.id && clients.length > 0 && articles.length > 0) {
            loadExistingCommande(document.id);
        }
    }, [document, clients, articles]);

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

            console.log('📦 Données chargées:', {
                clients: clientsRes.data,
                articles: articlesRes.data
            });

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
            console.log('📖 Chargement commande ID:', id);

            const response = await getCommandeById(id);
            console.log('📥 Réponse API complète:', response.data);

            if (response.data.status === 'success') {
                const commande = response.data.data;
                console.log('🔍 Données commande:', commande);

                setCommandeId(commande.commande_id);

                // ✅ CORRECTION 3: Formatter correctement la date
                let formattedDate = new Date().toISOString().split('T')[0];
                if (commande.commande_added_date) {
                    try {
                        const dateObj = new Date(commande.commande_added_date);
                        if (!isNaN(dateObj.getTime())) {
                            formattedDate = dateObj.toISOString().split('T')[0];
                        }
                    } catch (e) {
                        console.error('Erreur formatage date:', e);
                    }
                }

                // ✅ CORRECTION 4: Extraire les IDs correctement
                const clientId = commande.client?.client_id || commande.commande_client_id || '';
                const userId = commande.user?.id || commande.commande_user_id || 1;
                const statusId = commande.commande_status?.commande_status_id || commande.commande_status_id || 1;
                const actionId = commande.action?.action_id || commande.commande_action_id || 1;
                const modePaiementId = commande.mode_paiement?.mode_paiement_id || commande.mode_paiement_id || null;

                console.log('🔧 Mapping des IDs:', {
                    clientId,
                    userId,
                    statusId,
                    actionId,
                    modePaiementId
                });

                setFormData({
                    commande_client_id: String(clientId),
                    commande_user_id: userId,
                    commande_status_id: statusId,
                    commande_action_id: actionId,
                    mode_paiement_id: modePaiementId,
                    reference: `BC${String(commande.commande_id).padStart(6, '0')}`,
                    date: formattedDate,
                    dateLivraison: commande.commande_date_livraison || '',
                    affaire: commande.commande_affaire || '',
                    expedition: commande.commande_expedition || ''
                });

                // ✅ CORRECTION 5: Charger les lignes de détails
                if (commande.details && commande.details.length > 0) {
                    const enrichedLignes = commande.details.map(d => {
                        const article = d.article || {};
                        const puht = parseFloat(article.article_prix_vente || 0);
                        const qte = parseFloat(d.commande_detail_quantity || 0);
                        const remise = parseFloat(d.commande_detail_remise || 0);
                        
                        const totalBrut = puht * qte;
                        const montantRemise = (totalBrut * remise) / 100;
                        const montantNet = totalBrut - montantRemise;

                        return {
                            article_id: article.article_id,
                            ref: article.article_reference || '',
                            designation: article.article_name || '',
                            puht: puht,
                            qte: qte,
                            conditionner: d.conditionner || 'PIECE',
                            remise: remise,
                            totalBrut: totalBrut.toFixed(2),
                            montantRemise: montantRemise.toFixed(2),
                            montantNet: montantNet.toFixed(2)
                        };
                    });

                    setLignes(enrichedLignes);
                    console.log('📦 Lignes chargées:', enrichedLignes);
                }

                setIsValidated(true);
            }
        } catch (error) {
            console.error('❌ Erreur chargement commande:', error);
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

            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    const errorMessages = detail.map(err => {
                        const field = err.loc ? err.loc.join('.') : 'inconnu';
                        return `• ${field}: ${err.msg}`;
                    }).join('\n');
                    alert(`❌ Erreur de validation:\n\n${errorMessages}`);
                } else if (typeof detail === 'object' && detail.message) {
                    alert(`❌ ${detail.message}\n\nCode: ${detail.error_code || 'INCONNU'}`);
                } else if (typeof detail === 'object') {
                    alert(`❌ Erreur:\n\n${JSON.stringify(detail, null, 2)}`);
                } else {
                    alert(`❌ Erreur: ${detail}`);
                }
            } else if (error.response?.data?.message) {
                alert(`❌ Erreur: ${error.response.data.message}`);
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
            montantRemise: ligneData.montantRemise,
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
                alert('✅ Bon de commande mis à jour avec succès !');
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
                        isReadOnly={false}
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