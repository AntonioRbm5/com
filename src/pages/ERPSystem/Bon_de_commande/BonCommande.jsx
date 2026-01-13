
import React, { useState, useEffect } from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListBonCommande from './ListBonCommande';
import FormBonCommande from './FormBonCommande';
import BonCommandeValidation from './BonCommandeValidation';
import { createMouvement } from '../../../services/stockManagementService';

const BonCommande = ({ document, onClose }) => {
    const [isValidated, setIsValidated] = useState(false);
    const [headerRef, setHeaderRef] = useState('');
    const [lignes, setLignes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totaux, setTotaux] = useState({
        totalHT: 0,
        totalTTC: 0,
        poidsNet: 0,
        poidsBrut: 0
    });

    useEffect(() => {
        // Si on édite un document existant
        if (document) {
            setHeaderRef(document.id || '');
            // Charger les lignes du document si disponibles
        }
    }, [document]);

    useEffect(() => {
        calculateTotaux();
    }, [lignes]);

    const calculateTotaux = () => {
        const totalHT = lignes.reduce((sum, ligne) => {
            const montant = parseFloat(ligne.totalBrut || 0) - parseFloat(ligne.montantRemise || 0);
            return sum + montant;
        }, 0);

        const totalTTC = totalHT * 1.2; // TVA 20%

        setTotaux({
            totalHT: totalHT.toFixed(2),
            totalTTC: totalTTC.toFixed(2),
            poidsNet: 0,
            poidsBrut: 0
        });
    };

    const handleValidation = () => {
        if (!headerRef.trim()) {
            alert('Veuillez renseigner une référence pour le bon de commande');
            return;
        }
        setIsValidated(true);
    };

    const handleAddLigne = async (formData) => {
        try {
            setLoading(true);

            // Créer le mouvement via l'API
            const mouvementData = {
                article_id: parseInt(formData.article_id) || 1,
                quantite: parseFloat(formData.qte),
                mouvement_type: "COMMANDE",
                unite_id: parseInt(formData.unite_id) || 1,
                mouvement_quantity: parseFloat(formData.qte),
                mouvement_valeur: parseFloat(formData.totalBrut) - parseFloat(formData.montantRemise),
                mouvement_reference: headerRef
            };

            const response = await createMouvement(mouvementData);

            if (response.data.status === 'success') {
                // Ajouter la ligne à la liste locale
                const newLigne = {
                    ...formData,
                    id: response.data.data.mouvement_id,
                    montantNet: (parseFloat(formData.totalBrut) - parseFloat(formData.montantRemise)).toFixed(2)
                };

                setLignes([...lignes, newLigne]);
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

    const handleSaveDocument = async () => {
        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne au bon de commande');
            return;
        }

        try {
            setLoading(true);
            // Sauvegarder le document complet
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
                    title={`Bon de commande: ${isValidated ? 'Validé' : 'A préparer'} N° ${headerRef || 'BC00001'}`}
                    onClose={onClose}
                />

                <DocumentToolbar
                    onSave={handleSaveDocument}
                    onPrint={handlePrint}
                    disabled={loading}
                />

                <div className="invoice-body">
                    <FormBonCommande
                        onValidate={handleValidation}
                        isReadOnly={isValidated}
                        headerRef={headerRef}
                        setHeaderRef={setHeaderRef}
                    />

                    {isValidated && (
                        <BonCommandeValidation
                            initialRef={headerRef}
                            onAddLigne={handleAddLigne}
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