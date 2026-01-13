
import React, { useState, useEffect } from 'react';
import { getAllStockMouvement } from '../../services/stockService';


const PurchasesView = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        // Filtrer les documents selon le terme de recherche
        if (searchTerm) {
            const filtered = documents.filter(doc =>
                doc.mouvement_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.article_id?.toString().includes(searchTerm)
            );
            setFilteredDocuments(filtered);
        } else {
            setFilteredDocuments(documents);
        }
    }, [searchTerm, documents]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllStockMouvement();

            if (response.data.status === 'success') {
                // Filtrer uniquement les mouvements de type achat/entrée
                const purchaseDocs = response.data.data.filter(
                    doc => doc.mouvement_type === 'ENTREE' || doc.mouvement_type === 'ACHAT'
                );
                setDocuments(purchaseDocs);
                setFilteredDocuments(purchaseDocs);
            } else {
                setError('Erreur lors de la récupération des données');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Impossible de charger les documents d\'achat');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        if (selectedDoc) {
            alert(`Ouverture du document: ${selectedDoc.mouvement_reference}`);
            // Implémenter l'ouverture du document
        } else {
            alert('Veuillez sélectionner un document');
        }
    };

    const handleNew = () => {
        alert('Création d\'un nouveau document d\'achat');
        // Implémenter la création
    };

    const handleDelete = async () => {
        if (!selectedDoc) {
            alert('Veuillez sélectionner un document');
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le document ${selectedDoc.mouvement_reference} ?`)) {
            try {
                // Implémenter la suppression via API
                alert('Document supprimé');
                fetchDocuments();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const formatCurrency = (value) => {
        if (!value) return '0,00';
        return parseFloat(value).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                fontSize: '14px',
                color: '#666'
            }}>
                <div>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    Chargement des documents d'achat...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ color: '#dc3545', marginBottom: '16px' }}>
                    ⚠️ {error}
                </div>
                <button className="btn-primary" onClick={fetchDocuments}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <>
            <div style={{ padding: '12px', background: '#f0f0f0', borderBottom: '1px solid #c0c0c0' }}>
                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    <strong>Documents d'achat en cours</strong>
                    <span style={{ marginLeft: '12px', color: '#666' }}>
                        ({filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''})
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher des mots dans la liste..."
                        style={{ maxWidth: '400px', fontSize: '11px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 12px' }}
                        onClick={() => setSearchTerm('')}
                    >
                        Effacer
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 12px' }}
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
                            <th>Type</th>
                            <th>Référence</th>
                            <th>Date</th>
                            <th>Article ID</th>
                            <th>Quantité</th>
                            <th>Unité</th>
                            <th style={{ textAlign: 'right' }}>Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#999',
                                    fontStyle: 'italic'
                                }}>
                                    {searchTerm
                                        ? 'Aucun document trouvé pour cette recherche'
                                        : 'Aucun document d\'achat disponible'}
                                </td>
                            </tr>
                        ) : (
                            filteredDocuments.map((doc) => (
                                <tr
                                    key={doc.mouvement_id}
                                    onClick={() => setSelectedDoc(doc)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selectedDoc?.mouvement_id === doc.mouvement_id ? '#e3f2fd' : 'transparent'
                                    }}
                                    onDoubleClick={() => alert(`Ouverture: ${doc.mouvement_reference}`)}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="selectedDoc"
                                            checked={selectedDoc?.mouvement_id === doc.mouvement_id}
                                            onChange={() => setSelectedDoc(doc)}
                                        />
                                    </td>
                                    <td>
                                        <span className="status-badge status-to-account">
                                            {doc.mouvement_type || 'ACHAT'}
                                        </span>
                                    </td>
                                    <td>{doc.mouvement_reference || '-'}</td>
                                    <td>{formatDate(doc.mouvement_date)}</td>
                                    <td>{doc.article_id || '-'}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {formatCurrency(doc.mouvement_quantity)}
                                    </td>
                                    <td>{doc.unite_id || '-'}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {formatCurrency(doc.mouvement_valeur)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button className="btn-primary" onClick={handleOpen}>
                    Ouvrir
                </button>
                <button className="btn-secondary" onClick={handleNew}>
                    Nouveau
                </button>
                <button
                    className="btn-secondary"
                    onClick={handleDelete}
                    disabled={!selectedDoc}
                >
                    Supprimer
                </button>
                <button className="btn-secondary">
                    Fermer
                </button>
            </div>
        </>
    );
};

export default PurchasesView;

