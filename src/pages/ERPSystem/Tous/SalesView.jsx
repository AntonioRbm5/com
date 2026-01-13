
import React, { useState, useEffect } from 'react';

import InvoiceForm from '../Facture_comptabilisée/InvoiceForm';
import BonCommande from '../Bon_de_commande/BonCommande';
import AddDocumentModal from './AddDocumentModal';
import { getAllStockMouvement } from '../../../services/stockService';

const SalesView = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState(null);
    
    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showCommandeForm, setShowCommandeForm] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        filterDocuments();
    }, [searchTerm, documents]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllStockMouvement();
            
            if (response.data.status === 'success') {
                // Filtrer les documents de vente (SORTIE, VENTE, etc.)
                const salesDocs = response.data.data.filter(
                    doc => doc.mouvement_type === 'SORTIE' || 
                           doc.mouvement_type === 'VENTE' ||
                           doc.mouvement_type === 'TRANSFERT'
                );
                
                // Transformer les données pour correspondre au format attendu
                const formattedDocs = salesDocs.map(doc => ({
                    id: doc.mouvement_reference || `MOV-${doc.mouvement_id}`,
                    date: new Date(doc.mouvement_date).toLocaleDateString('fr-FR'),
                    client: doc.article_id?.toString() || '-',
                    name: `Article ${doc.article_id}`,
                    status: getStatusFromType(doc.mouvement_type),
                    ht: formatCurrency(doc.mouvement_valeur),
                    ttc: formatCurrency(doc.mouvement_valeur * 1.2), // Ajouter 20% de TVA
                    rawData: doc
                }));
                
                setDocuments(formattedDocs);
                setFilteredDocuments(formattedDocs);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Impossible de charger les documents de vente');
        } finally {
            setLoading(false);
        }
    };

    const filterDocuments = () => {
        if (!searchTerm) {
            setFilteredDocuments(documents);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = documents.filter(doc =>
            doc.id.toLowerCase().includes(term) ||
            doc.name.toLowerCase().includes(term) ||
            doc.client.toLowerCase().includes(term) ||
            doc.status.toLowerCase().includes(term)
        );
        setFilteredDocuments(filtered);
    };

    const getStatusFromType = (type) => {
        const statusMap = {
            'SORTIE': 'A livrer',
            'VENTE': 'A comptabiliser',
            'TRANSFERT': 'En transit',
            'ENTREE': 'Reçu'
        };
        return statusMap[type] || 'En cours';
    };

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const handleDocumentTypeSelect = (type) => {
        setShowAddModal(false);
        
        if (type === 'facture') {
            setShowInvoiceForm(true);
            setShowCommandeForm(false);
        } else if (type === 'commande') {
            setShowCommandeForm(true);
            setShowInvoiceForm(false);
        } else {
            alert(`Création d'un document de type: ${type}`);
        }
    };

    const handleNewDocument = () => {
        setDocumentToEdit(null);
        setShowAddModal(true);
    };

    const handleOpenDocument = () => {
        if (!selectedDoc) {
            alert('Veuillez sélectionner un document');
            return;
        }
        
        // Ouvrir le document selon son type
        if (selectedDoc.status === 'A comptabiliser') {
            setDocumentToEdit(selectedDoc);
            setShowInvoiceForm(true);
        } else if (selectedDoc.status === 'A livrer') {
            setDocumentToEdit(selectedDoc);
            setShowCommandeForm(true);
        } else {
            alert(`Ouverture du document: ${selectedDoc.id}`);
        }
    };

    const handleDeleteDocument = async () => {
        if (!selectedDoc) {
            alert('Veuillez sélectionner un document');
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le document ${selectedDoc.id} ?`)) {
            try {
                // Implémenter la suppression via API
                alert('Document supprimé');
                setSelectedDoc(null);
                fetchDocuments();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleCloseForm = () => {
        setShowInvoiceForm(false);
        setShowCommandeForm(false);
        setDocumentToEdit(null);
        fetchDocuments(); // Rafraîchir la liste
    };

    // Si un formulaire est ouvert, l'afficher
    if (showInvoiceForm) {
        return <InvoiceForm document={documentToEdit} onClose={handleCloseForm} />;
    }

    if (showCommandeForm) {
        return <BonCommande document={documentToEdit} onClose={handleCloseForm} />;
    }

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px' 
            }}>
                <div>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Chargement des documents...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ color: '#dc3545', marginBottom: '16px' }}>⚠️ {error}</div>
                <button className="btn-primary" onClick={fetchDocuments}>Réessayer</button>
            </div>
        );
    }

    // Afficher la liste
    return (
        <>
            <div style={{ 
                padding: '12px', 
                background: '#f0f0f0', 
                borderBottom: '1px solid #c0c0c0' 
            }}>
                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    <strong>Documents en cours</strong>
                    <span style={{ marginLeft: '12px', color: '#666' }}>
                        ({filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''})
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher des mots dans la liste..."
                        style={{ maxWidth: '400px', fontSize: '11px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            className="btn-secondary btn-sm"
                            onClick={() => setSearchTerm('')}
                        >
                            ✕ Effacer
                        </button>
                    )}
                    <button 
                        className="btn-secondary btn-sm"
                        onClick={fetchDocuments}
                    >
                        🔄 Actualiser
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                <table className="document-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Statut</th>
                            <th>N° pièce</th>
                            <th>Date</th>
                            <th>N° client</th>
                            <th>Intitulé client</th>
                            <th>Souche</th>
                            <th style={{ textAlign: 'right' }}>Hors taxe</th>
                            <th style={{ textAlign: 'right' }}>Total TTC</th>
                            <th style={{ textAlign: 'right' }}>Solde dû</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ 
                                    textAlign: 'center', 
                                    padding: '40px', 
                                    color: '#999',
                                    fontStyle: 'italic'
                                }}>
                                    {searchTerm 
                                        ? 'Aucun document trouvé pour cette recherche' 
                                        : 'Aucun document en cours'}
                                </td>
                            </tr>
                        ) : (
                            filteredDocuments.map((doc) => (
                                <tr 
                                    key={doc.id}
                                    onClick={() => setSelectedDoc(doc)}
                                    onDoubleClick={handleOpenDocument}
                                    style={{ 
                                        cursor: 'pointer',
                                        backgroundColor: selectedDoc?.id === doc.id ? '#e3f2fd' : 'transparent'
                                    }}
                                >
                                    <td>
                                        <input 
                                            type="radio" 
                                            name="selectedDoc"
                                            checked={selectedDoc?.id === doc.id}
                                            onChange={() => setSelectedDoc(doc)}
                                        />
                                    </td>
                                    <td>
                                        <span className="status-badge status-to-account">
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td>{doc.id}</td>
                                    <td>{doc.date}</td>
                                    <td>{doc.client}</td>
                                    <td>{doc.name}</td>
                                    <td>N° Pièce</td>
                                    <td style={{ textAlign: 'right' }}>{doc.ht}</td>
                                    <td style={{ textAlign: 'right' }}>{doc.ttc}</td>
                                    <td style={{ textAlign: 'right' }}>{doc.ttc}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button 
                    className="btn-primary" 
                    onClick={handleOpenDocument}
                    disabled={!selectedDoc}
                >
                    Ouvrir
                </button>
                <button onClick={handleNewDocument} className="btn-secondary">
                    Nouveau
                </button>
                <button 
                    className="btn-secondary" 
                    onClick={handleDeleteDocument}
                    disabled={!selectedDoc}
                >
                    Supprimer
                </button>
                <button className="btn-secondary">Fermer</button>
            </div>

            <AddDocumentModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onDocumentTypeSelect={handleDocumentTypeSelect}
            />
        </>
    );
};

export default SalesView;