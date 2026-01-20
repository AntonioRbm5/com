import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import FormVenteHeader from './FormVenteHeader';
import ListLignesVente from './ListLignesVente';

import { getAllClient } from '../../../services/clientService';
import { createVente } from '../../../services/venteService';
import { getAllUsers } from '../../../services/userService';
import { getAllArticles } from '../../../services/articleService';
import { getAllDepots } from '../../../services/depotService';
import { getAllUnites } from '../../../services/uniteService';
import Sidebar from '../../../composants/sidebar';
import Navbar from '../../../composants/navbar';
import { getAllVenteStatus, getVenteStatusById } from '../../../services/venteStatusService';
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

    const [formData, setFormData] = useState({
        client_id: '',
        client_name: '',
        status_id: '',
        user_id: '',
        mode_paiement_id: '',
        date: new Date().toLocaleDateString('fr-FR'),
        numeroVente: document?.id || 'VEN0001',
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
                usersRes, articlesRes, depotsRes, unitesRes, modesPaiementRes,
            ] =
                await Promise.all([
                    getAllClient(),
                    getAllVenteStatus(),
                    getAllUsers(),
                    getAllArticles(),
                    getAllDepots(),
                    getAllUnites(),
                    getAllModePaiement()
                ]);

            if (clientsRes.data.status === 'success') setClients(clientsRes.data.data || []);
            if (statusRes.data.status === 'success') setVenteStatuses(statusRes.data.data || []);
            if (usersRes.data.status === 'success') setUsers(usersRes.data.data || []);
            if (articlesRes.data.status === 'success') setArticles(articlesRes.data.data || []);
            if (depotsRes.data.status === 'success') setDepots(depotsRes.data.data || []);
            if (unitesRes.data.status === 'success') setUnites(unitesRes.data.data || []);
            if (modesPaiementRes.data.status === 'success') setModesPaiement(modesPaiementRes.data.data || []);  // ✅ AJOUT ICI

        } catch (error) {
            console.error('Erreur chargement données:', error);
            alert('Erreur lors du chargement des données de référence');
        } finally {
            setLoading(false);
        }
    };

    const loadDocumentData = async (doc) => {
        try {
            setLoading(true);
            const response = await getVenteStatusById(doc.id);

            if (response.data.status === 'success') {
                const vente = response.data.data;
                setVenteId(vente.vente_id);
                setFormData({
                    numeroVente: vente.vente_id,
                    client_id: vente.client?.client_id || '',
                    client_name: vente.client?.client_name || '',
                    status_id: vente.status?.vente_status_id || '',
                    user_id: vente.user?.id || '',
                    mode_paiement_id: vente.mode_paiement?.mode_paiement_id || '',
                    vente_has_discount: vente.vente_has_discount || false,
                    totalHT: vente.vente_total_amount || '0.00',
                    date: new Date().toLocaleDateString('fr-FR'),
                    reference: '',
                    validationCode: '',
                    notes: '',
                    totalTTC: '0.00'
                });
                setLignes(vente.details || []);
                setIsValidated(true);
            }
        } catch (error) {
            console.error('Erreur chargement vente:', error);
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

    // ✅ BOUTON VALIDER - ENVOIE API + AFFICHE TABLEAU
    const handleValidation = async () => {
        console.log('🔥 BOUTON VALIDER CLIQUÉ !');
        console.log('FormData:', formData);

        try {
            if (!formData.client_id) {
                alert('Veuillez sélectionner un client');
                return;
            }
            if (!formData.user_id) {
                alert('Veuillez sélectionner un vendeur');
                return;
            }
            if (!formData.status_id) {
                alert('Veuillez sélectionner un statut');
                return;
            }

            setLoading(true);

            const payload = {
                user_id: parseInt(formData.user_id),
                status_id: parseInt(formData.status_id),
                client_id: parseInt(formData.client_id),
                mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null,
                vente_has_discount: formData.vente_has_discount,
                vente_date: formData.date,
                vente_reference: formData.reference,
                vente_notes: formData.notes
            };
            // const payload = {
            //     user_id: parseInt(formData.user_id),
            //     status_id: parseInt(formData.status_id),
            //     client_id: parseInt(formData.client_id),
            //     mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null,
            //     vente_has_discount: formData.vente_has_discount
            // };

            const details = lignes.map(ligne => ({
                article_id: parseInt(ligne.article_id),
                depot_id: parseInt(ligne.depot_id),
                quantite: parseFloat(ligne.quantite),
                unite_id: parseInt(ligne.unite_id),
                prix_unitaire: parseFloat(ligne.prix_unitaire),
                remise: parseFloat(ligne.remise || 0),
                subtotal: parseFloat(ligne.subtotal)
            }));
            console.log('📤 Envoi API:', { payload, details });

            const response = await createVente({ payload, details });

            console.log('📥 Réponse:', response.data);

            if (response.data.status === 'success') {
                const createdVente = response.data.data;
                setVenteId(createdVente.vente_id || createdVente.id);
                setFormData(prev => ({
                    ...prev,
                    numeroVente: createdVente.vente_numero || createdVente.vente_id || prev.numeroVente
                }));
                setIsValidated(true);
                alert('✅ Vente créée ! Ajoutez maintenant vos lignes.');
            } else {
                alert('❌ Erreur: ' + (response.data.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('❌ ERREUR:', error);
            console.error('Réponse serveur:', error.response?.data);
            alert('Erreur: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // ✅ ENREGISTREMENT DES LIGNES
    const handleSave = async () => {
        console.log('💾 ENREGISTRER CLIQUÉ !');
        alert('Fonction à implémenter : mise à jour avec les lignes');
    };

    const handleValidate = () => {
        alert('Fonction à implémenter : comptabilisation');
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
                        disabled={loading || !isValidated}
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

                        <ListLignesVente
                            lignes={lignes}
                            onAddLigne={handleAddLigne}
                            onDeleteLigne={handleDeleteLigne}
                            onSave={handleSave}
                            onValidate={handleValidate}
                            articles={articles}
                            depots={depots}
                            unites={unites}
                            isReadOnly={!isValidated}
                            autoOpen={isValidated}
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