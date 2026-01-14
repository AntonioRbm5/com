
import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListFactureComptablisée from './ListFactureComptablisée';
import FormFactureComptabilise from './FormFactureComptabilise';
import { createMouvement } from '../../../services/stockManagementService';
import { getAllFournisseurs } from '../../../services/fournisseurService';

const InvoiceForm = ({ document, onClose }) => {
    const [lignes, setLignes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fournisseurs, setFournisseurs] = useState([]);

    const [formData, setFormData] = useState({
        fournisseur_id: '',
        fournisseur_name: '',
        statut: 'A comptabiliser',
        date: new Date().toLocaleDateString('fr-FR'),
        numeroDocument: document?.id || 'FACT0001',
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
    useEffect(() => {
        fetchFournisseurs();
    }, []);
    useEffect(() => {
        if (document) {
            // Charger les données du document existant
            loadDocumentData(document);

        }
    }, [document]);

    useEffect(() => {
        calculateTotaux();
    }, [lignes]);

    const fetchFournisseurs = async () => {
        try {
            const response = await getAllFournisseurs();
            if (response.data.status === 'success') {
                setFournisseurs(response.data.data);
            }
        } catch (error) {
            console.error('Erreur chargement fournisseurs', error);
        }
    };

    const loadDocumentData = async (doc) => {
        try {
            setLoading(true);
            // Charger les détails du document via l'API
            setFormData({
                ...formData,
                numeroDocument: doc.id,
                fournisseur_name: doc.client,
                fournisseur_id: doc.rawData?.fournisseur_id || '',
                reference: doc.id
            });
        } catch (error) {
            console.error('Erreur chargement document:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleAddLigne = async (ligneData) => {
        try {
            setLoading(true);

            const mouvementData = {
                article_id: parseInt(ligneData.article_id) || 1,
                quantite: parseFloat(ligneData.quantite),
                mouvement_type: "FACTURE",
                unite_id: parseInt(ligneData.unite_id) || 1,
                mouvement_quantity: parseFloat(ligneData.quantite),
                mouvement_valeur: parseFloat(ligneData.montantHT),
                mouvement_reference: formData.numeroDocument,
                fournisseur_id: formData.fournisseur_id
            };

            const response = await createMouvement(mouvementData);

            if (response.data.status === 'success') {
                setLignes([...lignes, {
                    ...ligneData,
                    id: response.data.data.mouvement_id
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

    const handleDeleteLigne = (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            const newLignes = lignes.filter((_, i) => i !== index);
            setLignes(newLignes);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            // Sauvegarder la facture
            alert('Facture enregistrée avec succès !');
            if (onClose) onClose();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleComptabiliser = async () => {
        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne avant de comptabiliser');
            return;
        }

        if (window.confirm('Êtes-vous sûr de vouloir comptabiliser cette facture ?')) {
            try {
                setLoading(true);
                // Comptabiliser la facture
                alert('Facture comptabilisée avec succès !');
                if (onClose) onClose();
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la comptabilisation');
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
                        isReadOnly={loading}
                    />

                    <ListFactureComptablisée
                        lignes={lignes}
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