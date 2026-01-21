import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import FormVenteHeader from './FormVenteHeader';
import ListLignesVente from './ListLignesVente';

import { getAllClient } from '../../../services/clientService';
import { createVente, getAllVente, getVenteByID } from '../../../services/venteService';
import { getAllUsers } from '../../../services/userService';
import { getAllArticles } from '../../../services/articleService';
import { getAllDepots } from '../../../services/depotService';
import { getAllUnites } from '../../../services/uniteService';
import Sidebar from '../../../composants/sidebar';
import Navbar from '../../../composants/navbar';
import { getAllVenteStatus } from '../../../services/venteStatusService';
import { getAllModePaiement } from '../../../services/modePaiementService';

const VenteForm = ({ document, onClose }) => {
    const [lignes, setLignes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [venteId, setVenteId] = useState(null);

    const [clients, setClients] = useState([]);
    const [venteStatuses, setVenteStatuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [depots, setDepots] = useState([]);
    const [unites, setUnites] = useState([]);
    const [isValidated, setIsValidated] = useState(false);
    const [modesPaiement, setModesPaiement] = useState([]);
    const [dernieresVentes, setDernieresVentes] = useState([]);

    const [formData, setFormData] = useState({
        client_id: '',
        client_name: '',
        status_id: '',
        user_id: '',
        mode_paiement_id: '',
        date: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        numeroVente: document?.id || 'VEN000001',
        reference: '',
        validationCode: '',
        vente_has_discount: false,
        notes: '',
        totalHT: '0.00',
        totalTTC: '0.00'
    });

    const [totaux, setTotaux] = useState({
        totalHT: 0,
        totalTTC: 0,
        poidsNet: 0,
        poidsBrut: 0
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (document?.id) {
            loadDocumentData(document);
        }
    }, [document]);

    useEffect(() => {
        calculateTotaux();
    }, [lignes]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [
                clientsRes,
                statusRes,
                usersRes,
                articlesRes,
                depotsRes,
                unitesRes,
                modesPaiementRes,
                ventesRes
            ] = await Promise.all([
                getAllClient(),
                getAllVenteStatus(),
                getAllUsers(),
                getAllArticles(),
                getAllDepots(),
                getAllUnites(),
                getAllModePaiement(),
                getAllVente()
            ]);

            console.log('📦 Données chargées:', {
                clients: clientsRes.data,
                statuses: statusRes.data,
                ventes: ventesRes.data
            });

            if (clientsRes.data.status === 'success') setClients(clientsRes.data.data || []);
            if (statusRes.data.status === 'success') setVenteStatuses(statusRes.data.data || []);
            if (usersRes.data.status === 'success') setUsers(usersRes.data.data || []);
            if (articlesRes.data.status === 'success') setArticles(articlesRes.data.data || []);
            if (depotsRes.data.status === 'success') setDepots(depotsRes.data.data || []);
            if (unitesRes.data.status === 'success') setUnites(unitesRes.data.data || []);
            if (modesPaiementRes.data.status === 'success') setModesPaiement(modesPaiementRes.data.data || []);

            // ✅ CORRECTION: Adapter à la structure réelle de l'API
            if (ventesRes.data.status === 'success') {
                const allVentes = ventesRes.data.data || [];
                const last5 = allVentes.slice(-5).reverse();
                setDernieresVentes(last5);
            }
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
            alert('Erreur lors du chargement des données de référence');
        } finally {
            setLoading(false);
        }
    };

    const loadDocumentData = async (doc) => {
        if (!doc?.id) return;

        try {
            setLoading(true);
            console.log('📖 Chargement vente ID:', doc.id);

            const response = await getVenteByID(doc.id);
            console.log('📥 Réponse API:', response.data);

            if (response.data.status === 'success') {
                const vente = response.data.data;
                setVenteId(vente.vente_id);

                setFormData({
                    numeroVente: `VEN${String(vente.vente_id).padStart(6, '0')}`,
                    client_id: vente.client?.client_id || '',
                    client_name: vente.client?.client_name || '',
                    status_id: vente.status?.vente_status_id || '',
                    user_id: vente.user?.id || '',
                    mode_paiement_id: vente.mode_paiement?.mode_paiement_id || '',
                    vente_has_discount: vente.vente_has_discount || false,
                    date: vente.vente_execute_date ?
                        new Date(vente.vente_execute_date).toISOString().split('T')[0] :
                        new Date().toISOString().split('T')[0],
                    reference: vente.vente_reference || '',
                    notes: vente.vente_notes || '',
                    totalHT: vente.vente_total_amount || '0.00',
                    totalTTC: (parseFloat(vente.vente_total_amount || 0) * 1.2).toFixed(2),
                    validationCode: ''
                });

                // ✅ Charger les détails (vente_products)
                if (vente.details && vente.details.length > 0) {
                    const enrichedLignes = vente.details.map(detail => ({
                        article_id: detail.article?.article_id,
                        article_name: detail.article?.article_name || '',
                        depot_id: detail.depot?.depot_id,
                        depot_name: detail.depot?.depot_name || '',
                        quantity: detail.vente_detail_quantity,
                        unite_id: detail.unite?.unite_id,
                        unite_code: detail.unite?.unite_code || '',
                        prix_unitaire: detail.vente_detail_prix_unitaire,
                        remise: detail.vente_detail_remise || 0,
                        subtotal: detail.vente_detail_subtotal
                    }));
                    setLignes(enrichedLignes);
                }

                setIsValidated(true);
            }
        } catch (error) {
            console.error('❌ Erreur chargement vente:', error);
            alert('Erreur lors du chargement de la vente');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotaux = () => {
        const totalHT = lignes.reduce((sum, ligne) => sum + parseFloat(ligne.subtotal || 0), 0);
        const totalTTC = totalHT * 1.2;

        setTotaux({
            totalHT: totalHT.toFixed(2),
            totalTTC: totalTTC.toFixed(2),
            poidsNet: 0,
            poidsBrut: 0
        });

        setFormData(prev => ({
            ...prev,
            totalHT: totalHT.toFixed(2),
            totalTTC: totalTTC.toFixed(2)
        }));
    };

    const handleAddLigne = (ligneData) => {
        const article = articles.find(a => String(a.article_id) === String(ligneData.article_id));
        const depot = depots.find(d => String(d.depot_id) === String(ligneData.depot_id));
        const unite = unites.find(u => String(u.unite_id) === String(ligneData.unite_id));

        const enrichedLigne = {
            ...ligneData,
            article_name: article?.article_name || '',
            depot_name: depot?.depot_name || '',
            unite_code: unite?.unite_code || ''
        };

        setLignes([...lignes, enrichedLigne]);
    };

    const handleDeleteLigne = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            setLignes(lignes.filter((_, i) => i !== index));
        }
    };

    // ✅ VALIDATION EN-TÊTE - Crée la vente dans l'API
    const handleValidation = async () => {
        console.log('🔥 VALIDATION EN-TÊTE - Création vente');

        try {
            // Validation des champs obligatoires
            if (!formData.client_id) {
                alert('⚠️ Veuillez sélectionner un client');
                return;
            }
            if (!formData.user_id) {
                alert('⚠️ Veuillez sélectionner un vendeur');
                return;
            }
            if (!formData.status_id) {
                alert('⚠️ Veuillez sélectionner un statut');
                return;
            }

            setLoading(true);

            // ✅ CORRECTION: Structure selon votre API
            const payload = {
                user_id: parseInt(formData.user_id),
                status_id: parseInt(formData.status_id),
                client_id: parseInt(formData.client_id),
                mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null,
                vente_has_discount: formData.vente_has_discount
            };

            // Pour la création initiale, envoyer un tableau vide
            const details = [];

            console.log('📤 Envoi API createVente:', { payload, details });

            const response = await createVente({ payload, details });

            console.log('📥 Réponse création:', response.data);

            if (response.data.status === 'success' || response.data.vente_id) {
                const createdVente = response.data.data || response.data;
                const newVenteId = createdVente.vente_id || createdVente.id;

                setVenteId(newVenteId);
                setFormData(prev => ({
                    ...prev,
                    numeroVente: `VEN${String(newVenteId).padStart(6, '0')}`
                }));
                setIsValidated(true);

                alert('✅ Vente créée avec succès ! Vous pouvez maintenant ajouter des lignes.');
            } else {
                alert('❌ Erreur: ' + (response.data.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('❌ ERREUR création vente:', error);
            console.error('Détails:', error.response?.data);
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // ✅ ENREGISTREMENT DES LIGNES - Met à jour la vente existante
    const handleSave = async () => {
        console.log('💾 ENREGISTREMENT DES LIGNES');

        if (!venteId) {
            alert('⚠️ Aucune vente validée. Veuillez d\'abord valider l\'en-tête.');
            return;
        }

        if (lignes.length === 0) {
            alert('⚠️ Aucune ligne à enregistrer');
            return;
        }

        try {
            setLoading(true);

            const details = lignes.map(ligne => ({
                article_id: parseInt(ligne.article_id),
                depot_id: parseInt(ligne.depot_id),
                quantity: parseFloat(ligne.quantity),
                unite_id: parseInt(ligne.unite_id),
                prix_unitaire: parseFloat(ligne.prix_unitaire),
                remise: parseFloat(ligne.remise || 0),
                subtotal: parseFloat(ligne.subtotal)
            }));

            console.log('📤 Mise à jour vente ID:', venteId);
            console.log('📦 Détails à envoyer:', details);

            // Utiliser l'endpoint de mise à jour
            const payload = {
                status_id: parseInt(formData.status_id),
                mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null
            };

            const response = await createVente({
                payload: { ...payload, user_id: parseInt(formData.user_id), client_id: parseInt(formData.client_id) },
                details
            });

            console.log('📥 Réponse mise à jour:', response.data);

            if (response.data.status === 'success') {
                alert('✅ Lignes enregistrées avec succès !');
                // Recharger les données
                if (venteId) {
                    await loadDocumentData({ id: venteId });
                }
            } else {
                alert('❌ Erreur: ' + (response.data.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('❌ ERREUR enregistrement:', error);
            alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = () => {
        alert('📊 Fonction comptabilisation à implémenter');
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="invoice-wrapper">
                    <DocumentHeader
                        title={`Vente N° ${formData.numeroVente} - ${isValidated ? '✅ Validé' : '📝 Brouillon'}`}
                        onClose={onClose}
                    />

                    <DocumentToolbar
                        onSave={handleSave}
                        onPrint={() => window.print()}
                        onComptabiliser={handleValidate}
                        disabled={loading || !isValidated || lignes.length === 0}
                    />

                    <div className="invoice-body">
                        <FormVenteHeader
                            onValidate={handleValidation}
                            formData={formData}
                            setFormData={setFormData}
                            clients={clients}
                            users={users}
                            venteStatuses={venteStatuses}
                            modesPaiement={modesPaiement}
                            isReadOnly={isValidated}
                        />

                        {isValidated ? (
                            <ListLignesVente
                                lignes={lignes}
                                onAddLigne={handleAddLigne}
                                onDeleteLigne={handleDeleteLigne}
                                onSave={handleSave}
                                onValidate={handleValidate}
                                articles={articles}
                                depots={depots}
                                unites={unites}
                                isReadOnly={false}
                                autoOpen={isValidated}
                                dernieresVentes={dernieresVentes}
                                isValidated={isValidated}
                            />
                        ) : (
                            <div style={{
                                padding: '60px 20px',
                                textAlign: 'center',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                margin: '20px 0',
                                border: '2px dashed #dee2e6'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                                <p style={{ color: '#6c757d', fontSize: '14px' }}>
                                    ⚠️ Veuillez valider l'en-tête pour afficher les lignes de vente
                                </p>
                            </div>
                        )}

                        <DocumentFooter
                            poidsNet={totaux.poidsNet}
                            poidsBrut={totaux.poidsBrut}
                            totalHT={formatCurrency(totaux.totalHT)}
                            totalTTC={formatCurrency(totaux.totalTTC)}
                        />
                    </div>

                    {loading && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000
                        }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VenteForm;