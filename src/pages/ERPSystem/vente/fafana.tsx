import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import FormVenteHeader from './FormVenteHeader';
import ListLignesVente from './ListLignesVente';
import { createVente, getVenteByID } from '../../../services/venteService';
import { getAllClient } from '../../../services/clientService';
import { getAllVenteStatus } from '../../../services/venteStatusService';
import { getAllUsers } from '../../../services/userService';
import { getAllModePaiement } from '../../../services/modePaiementService';
import { getAllArticles } from '../../../services/articleService';
import { getAllDepots } from '../../../services/depotService';
import { getAllUnites } from '../../../services/uniteService';

const VenteForm = ({ document, onClose }) => {
    const [lignes, setLignes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Données de référence
    const [clients, setClients] = useState([]);
    const [venteStatuses, setVenteStatuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [modesPaiement, setModesPaiement] = useState([]);
    const [articles, setArticles] = useState([]);
    const [depots, setDepots] = useState([]);
    const [unites, setUnites] = useState([]);

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
        if (document) {
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
                paiementRes,
                articlesRes,
                depotsRes,
                unitesRes
            ] = await Promise.all([
                getAllClient(),
                getAllVenteStatus(),
                getAllUsers(),
                getAllModePaiement(),
                getAllArticles(),
                getAllDepots(),
                getAllUnites()
            ]);

            if (clientsRes.data.status === 'success') {
                setClients(clientsRes.data.data || []);
            }
            if (statusRes.data.status === 'success') {
                setVenteStatuses(statusRes.data.data || []);
            }
            if (usersRes.data.status === 'success') {
                setUsers(usersRes.data.data || []);
            }
            if (paiementRes.data.status === 'success') {
                setModesPaiement(paiementRes.data.data || []);
            }
            if (articlesRes.data.status === 'success') {
                setArticles(articlesRes.data.data || []);
            }
            if (depotsRes.data.status === 'success') {
                setDepots(depotsRes.data.data || []);
            }
            if (unitesRes.data.status === 'success') {
                setUnites(unitesRes.data.data || []);
            }
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
            const response = await getVenteByID(doc.id);

            if (response.data.status === 'success') {
                const vente = response.data.data;

                setFormData({
                    ...formData,
                    numeroVente: vente.vente_id,
                    client_id: vente.client?.client_id || '',
                    client_name: vente.client?.client_name || '',
                    status_id: vente.status?.vente_status_id || '',
                    user_id: vente.user?.id || '',
                    mode_paiement_id: vente.mode_paiement?.mode_paiement_id || '',
                    vente_has_discount: vente.vente_has_discount || false,
                    totalHT: vente.vente_total_amount || '0.00'
                });

                setLignes(vente.details || []);
            }
        } catch (error) {
            console.error('Erreur chargement vente:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotaux = () => {
        const totalHT = lignes.reduce((sum, ligne) => {
            return sum + parseFloat(ligne.subtotal || 0);
        }, 0);

        const totalTTC = totalHT * 1.2; // TVA 20%

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

    const handleAddLigne = async (ligneData) => {
        try {
            // Enrichir les données de la ligne avec les noms
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

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de la ligne');
        }
    };

    const handleDeleteLigne = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            const newLignes = lignes.filter((_, i) => i !== index);
            setLignes(newLignes);
        }
    };

    const handleSave = async () => {
        try {
            // Validation
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
            if (lignes.length === 0) {
                alert('Veuillez ajouter au moins une ligne de vente');
                return;
            }

            setLoading(true);

            // Préparer le payload
            const payload = {
                user_id: parseInt(formData.user_id),
                status_id: parseInt(formData.status_id),
                client_id: parseInt(formData.client_id),
                mode_paiement_id: formData.mode_paiement_id ? parseInt(formData.mode_paiement_id) : null,
                vente_has_discount: formData.vente_has_discount
            };

            const details = lignes.map(ligne => ({
                article_id: parseInt(ligne.article_id),
                depot_id: parseInt(ligne.depot_id),
                quantite: parseFloat(ligne.quantite),
                unite_id: parseInt(ligne.unite_id),
                prix_unitaire: parseFloat(ligne.prix_unitaire),
                remise: parseFloat(ligne.remise || 0),
                subtotal: parseFloat(ligne.subtotal)
            }));

            const response = await createVente({ payload, details });

            if (response.data.status === 'success') {
                alert('Vente enregistrée avec succès !');
                if (onClose) onClose();
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement de la vente');
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async () => {
        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne avant de valider');
            return;
        }

        if (window.confirm('Êtes-vous sûr de vouloir valider cette vente ?')) {
            try {
                setLoading(true);
                // Ici, vous devrez d'abord sauvegarder la vente
                // Puis appeler l'endpoint de validation
                alert('Fonctionnalité de validation à implémenter avec l\'API');
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la validation');
            } finally {
                setLoading(false);
            }
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
                    title={`Vente N° ${formData.numeroVente}`}
                    onClose={onClose}
                />

                <DocumentToolbar
                    onSave={handleSave}
                    onPrint={handlePrint}
                    onComptabiliser={handleValidate}
                    disabled={loading}
                />

                <div className="invoice-body">
                    <FormVenteHeader
                        formData={formData}
                        setFormData={setFormData}
                        clients={clients}
                        users={users}
                        venteStatuses={venteStatuses}
                        modesPaiement={modesPaiement}
                        isReadOnly={loading}
                    />

                    <ListLignesVente
                        lignes={lignes}
                        onAddLigne={handleAddLigne}
                        onDeleteLigne={handleDeleteLigne}
                        articles={articles}
                        depots={depots}
                        unites={unites}
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

export default VenteForm;