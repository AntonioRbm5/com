import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListFactureComptablisée from './ListFactureComptablisée';
import FormFactureComptabilise from './FormFactureComptabilise';
import { createVente, getVenteByID, updateVente } from '../../../services/venteService';
import { getAllFournisseurs } from '../../../services/fournisseurService';
import { getAllArticles } from '../../../services/articleService';
import { getAllModePaiement } from '../../../services/modePaiementService';

const InvoiceForm = ({ document, onClose }) => {
    const [factureId, setFactureId] = useState(null);
    const [lignes, setLignes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [articles, setArticles] = useState([]);
    const [modesPaiement, setModesPaiement] = useState([]);

    const [formData, setFormData] = useState({
        fournisseur_id: '',
        fournisseur_name: '',
        statut: 'A comptabiliser',
        status_id: 1, // "A comptabiliser"
        user_id: 1, // À récupérer depuis le contexte utilisateur
        mode_paiement_id: null,
        date: new Date().toISOString().split('T')[0],
        numeroDocument: 'Nouveau',
        reference: '',
        affaire: '',
        expedition: '',
        dateLivraison: '',
        acheteur: '',
        entete1: ''
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
            loadExistingFacture(document.id);
        }
    }, [document]);

    // Calcul des totaux
    useEffect(() => {
        calculateTotaux();
    }, [lignes]);

    /**
     * Chargement des données de base
     */
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [fournisseursRes, articlesRes, modesPaiementRes] = await Promise.all([
                getAllFournisseurs(),
                getAllArticles(),
                getAllModePaiement()
            ]);

            if (fournisseursRes.data.status === 'success') {
                setFournisseurs(fournisseursRes.data.data || []);
            }

            if (articlesRes.data.status === 'success') {
                setArticles(articlesRes.data.data || []);
            }

            if (modesPaiementRes.data.status === 'success') {
                setModesPaiement(modesPaiementRes.data.data || []);
            }
        } catch (error) {
            console.error('Erreur chargement données:', error);
            alert('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Chargement d'une facture existante
     */
    const loadExistingFacture = async (id) => {
        try {
            setLoading(true);
            const response = await getVenteByID(id);

            if (response.data.status === 'success') {
                const vente = response.data.data;
                setFactureId(vente.vente_id);

                setFormData({
                    fournisseur_id: vente.fournisseur_id || '',
                    status_id: vente.status?.vente_status_id || 1,
                    user_id: vente.user?.id || 1,
                    mode_paiement_id: vente.mode_paiement?.mode_paiement_id || null,
                    numeroDocument: `FACT${String(vente.vente_id).padStart(6, '0')}`,
                    date: new Date(vente.vente_execute_date).toISOString().split('T')[0],
                    reference: vente.reference || ''
                });

                // Charger les lignes de la facture
                if (vente.details && vente.details.length > 0) {
                    setLignes(vente.details.map(d => ({
                        id: d.detail_id,
                        article_id: d.article_id,
                        referenceArticle: d.article_reference || '',
                        designation: d.article_name || '',
                        puHT: d.prix_unitaire || 0,
                        quantite: d.quantite || 0,
                        remise: d.remise || 0,
                        puNet: d.prix_net || 0,
                        montantHT: d.montant_total || 0,
                        conditionneur: d.conditionneur || 'PIECE'
                    })));
                }
            }
        } catch (error) {
            console.error('Erreur chargement facture:', error);
            alert('Erreur lors du chargement de la facture');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calcul des totaux
     */
    const calculateTotaux = () => {
        const totalHT = lignes.reduce((sum, ligne) => {
            return sum + parseFloat(ligne.montantHT || 0);
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
     * Ajout d'une ligne de facture
     */
    const handleAddLigne = async (ligneData) => {
        try {
            setLoading(true);

            // Si la facture n'existe pas encore, la créer
            if (!factureId) {
                await handleCreateFacture();
            }

            // Ajouter la ligne localement (l'API vente gère les détails via payload complet)
            const newLigne = {
                article_id: parseInt(ligneData.article_id),
                referenceArticle: ligneData.referenceArticle,
                referenceFournisseur: ligneData.referenceFournisseur,
                designation: ligneData.designation,
                puHT: parseFloat(ligneData.puHT),
                quantite: parseFloat(ligneData.quantite),
                conditionneur: ligneData.conditionneur,
                remise: parseFloat(ligneData.remise) || 0,
                puNet: parseFloat(ligneData.puNet),
                montantHT: parseFloat(ligneData.montantHT)
            };

            setLignes([...lignes, newLigne]);
            alert('Ligne ajoutée avec succès !');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de la ligne');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Création de la facture
     */
    const handleCreateFacture = async () => {
        if (!formData.fournisseur_id) {
            alert('Veuillez sélectionner un fournisseur');
            return;
        }

        try {
            setLoading(true);

            const venteData = {
                payload: {
                    user_id: parseInt(formData.user_id),
                    status_id: parseInt(formData.status_id),
                    mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null,
                    vente_has_discount: lignes.some(l => parseFloat(l.remise) > 0)
                },
                details: lignes.map(ligne => ({
                    article_id: ligne.article_id,
                    quantite: ligne.quantite,
                    prix_unitaire: ligne.puHT,
                    remise: ligne.remise,
                    montant_total: ligne.montantHT
                }))
            };

            const response = await createVente(venteData);

            if (response.data.status === 'success') {
                const newFactureId = response.data.data.vente_id;
                setFactureId(newFactureId);
                setFormData(prev => ({
                    ...prev,
                    numeroDocument: `FACT${String(newFactureId).padStart(6, '0')}`
                }));
                return newFactureId;
            } else {
                throw new Error('Erreur lors de la création de la facture');
            }
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Suppression d'une ligne de facture
     */
    const handleDeleteLigne = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            const newLignes = lignes.filter((_, i) => i !== index);
            setLignes(newLignes);
        }
    };

    /**
     * Sauvegarde de la facture
     */
    const handleSave = async () => {
        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne à la facture');
            return;
        }

        try {
            setLoading(true);

            if (!factureId) {
                await handleCreateFacture();
            } else {
                // Mettre à jour la facture existante
                const updateData = {
                    status_id: formData.status_id,
                    mode_paiement_id: formData.mode_paiement_id
                };

                await updateVente(updateData, factureId);
            }

            alert('Facture enregistrée avec succès !');
            if (onClose) onClose();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement de la facture');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Comptabiliser la facture
     */
    const handleComptabiliser = async () => {
        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne avant de comptabiliser');
            return;
        }

        if (!window.confirm('Êtes-vous sûr de vouloir comptabiliser cette facture ?')) {
            return;
        }

        try {
            setLoading(true);

            // Créer ou sauvegarder d'abord
            if (!factureId) {
                await handleCreateFacture();
            }

            // Mettre à jour le statut à "Comptabilisé"
            const updateData = {
                status_id: 2 // Statut "Comptabilisé"
            };

            await updateVente(updateData, factureId);

            alert('Facture comptabilisée avec succès !');
            if (onClose) onClose();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la comptabilisation');
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
                    title={`Facture : ${formData.statut} N° ${formData.numeroDocument}`}
                    onClose={onClose}
                />

                <DocumentToolbar
                    onSave={handleSave}
                    onPrint={handlePrint}
                    onComptabiliser={handleComptabiliser}
                    disabled={loading}
                />

                <div className="invoice-body">
                    <FormFactureComptabilise
                        formData={formData}
                        setFormData={setFormData}
                        fournisseurs={fournisseurs}
                        modesPaiement={modesPaiement}
                        isReadOnly={loading}
                    />

                    <ListFactureComptablisée
                        lignes={lignes}
                        articles={articles}
                        onAddLigne={handleAddLigne}
                        onDeleteLigne={handleDeleteLigne}
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

export default InvoiceForm;