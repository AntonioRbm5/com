import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../familles/famille.css';
import { getAllFournisseurs, searchFournisseur, deleteFournisseur, updateFournisseur } from '../../services/fournisseurService';
import Header from '../Layout/Header';
import Toolbar from '../Layout/Toolbar';

import Sidebar from '../../composants/sidebar';
import Navbar from '../../composants/navbar';

const FournisseurListPage = () => {
    const navigate = useNavigate();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedFournisseur, setSelectedFournisseur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadFournisseurs();
    }, []);

    useEffect(() => {
        if (selectedFournisseur) {
            setEditedData({
                fournisseur_name: selectedFournisseur.fournisseur_name || '',
                fournisseur_reference: selectedFournisseur.fournisseur_reference || ''
            });
        }
    }, [selectedFournisseur]);

    const loadFournisseurs = async () => {
        try {
            setLoading(true);
            const response = await getAllFournisseurs();

            if (response.data.status === 'success') {
                setFournisseurs(response.data.data);
                setFilteredFournisseurs(response.data.data);
            } else {
                setError('Erreur lors du chargement des fournisseurs');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setFilteredFournisseurs(fournisseurs);
            return;
        }

        try {
            const response = await searchFournisseur(searchTerm);
            if (response.data.status === 'success') {
                setFilteredFournisseurs(response.data.data);
            }
        } catch (err) {
            console.error('Erreur de recherche:', err);
            const filtered = fournisseurs.filter(f =>
                f.fournisseur_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (f.fournisseur_reference && f.fournisseur_reference.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredFournisseurs(filtered);
        }
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        if (!value.trim()) {
            setFilteredFournisseurs(fournisseurs);
        }
    };

    const handleRowClick = (fournisseur) => {
        setSelectedId(fournisseur.fournisseur_id);
        setSelectedFournisseur(fournisseur);
        setShowDetails(true);
    };

    const handleEdit = () => {
        if (selectedId) {
            navigate(`/fournisseur/edit/${selectedId}`);
        }
    };

    const handleNew = () => {
        navigate('/fournisseur/new');
    };

    const handleDelete = async () => {
        if (!selectedId) {
            setError('Veuillez sélectionner un fournisseur à supprimer');
            return;
        }

        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur "${selectedFournisseur?.fournisseur_name}" ?`)) {
            return;
        }

        try {
            const response = await deleteFournisseur(selectedId);
            if (response.data.status === 'success') {
                setSelectedId(null);
                setSelectedFournisseur(null);
                setShowDetails(false);
                loadFournisseurs();
            } else {
                setError('Erreur lors de la suppression');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression');
            console.error('Erreur:', err);
        }
    };

    const handleSaveDetails = async () => {
        if (!selectedId) return;

        if (!editedData.fournisseur_name.trim()) {
            setError('Le nom du fournisseur est obligatoire');
            return;
        }

        setIsSaving(true);
        try {
            const response = await updateFournisseur(editedData, selectedId);
            if (response.data.status === 'success') {
                await loadFournisseurs();
                const updatedFournisseur = fournisseurs.find(f => f.fournisseur_id === selectedId);
                if (updatedFournisseur) {
                    setSelectedFournisseur({ ...updatedFournisseur, ...editedData });
                }
                setError(null);
            } else {
                setError('Erreur lors de la mise à jour');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
            console.error('Erreur:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = (type) => {
        setShowPrintModal(false);

        if (type === 'all') {
            window.print();
        } else if (type === 'selected' && selectedFournisseur) {
            const printWindow = window.open('', '', 'width=800,height=600');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Fournisseur - ${selectedFournisseur.fournisseur_name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                            .detail { margin: 15px 0; }
                            .label { font-weight: bold; color: #555; }
                            .value { margin-left: 10px; }
                        </style>
                    </head>
                    <body>
                        <h1>Détails du Fournisseur</h1>
                        <div class="detail"><span class="label">Code:</span><span class="value">${selectedFournisseur.fournisseur_id}</span></div>
                        <div class="detail"><span class="label">Nom:</span><span class="value">${selectedFournisseur.fournisseur_name}</span></div>
                        <div class="detail"><span class="label">Référence:</span><span class="value">${selectedFournisseur.fournisseur_reference || '-'}</span></div>
                        <div class="detail"><span class="label">Nombre d'articles:</span><span class="value">${selectedFournisseur.articles?.length || 0}</span></div>
                        <div class="detail"><span class="label">Date d'ajout:</span><span class="value">${new Date(selectedFournisseur.fournisseur_added_date).toLocaleString('fr-FR')}</span></div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        } else if (type === 'list') {
            const printWindow = window.open('', '', 'width=800,height=600');
            const tableRows = filteredFournisseurs.map(f => `
                <tr>
                    <td>${f.fournisseur_id}</td>
                    <td>${f.fournisseur_name}</td>
                    <td>${f.fournisseur_reference || '-'}</td>
                    <td>${f.articles?.length || 0}</td>
                </tr>
            `).join('');

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Liste des Fournisseurs</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #007bff; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #007bff; color: white; }
                        </style>
                    </head>
                    <body>
                        <h1>Liste des Fournisseurs</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Nom</th>
                                    <th>Référence</th>
                                    <th>Articles</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const toolbarConfig = [
        {
            label: 'Tous', icon: '📋', active: true, onClick: () => {
                setSearchTerm('');
                setFilteredFournisseurs(fournisseurs);
                setShowSearch(false);
            }
        },
        { label: 'Rechercher', icon: '🔍', onClick: () => setShowSearch(!showSearch) },
        { label: 'Imprimer', icon: '🖨️', onClick: () => setShowPrintModal(true) },
        { label: 'Assistant', icon: '❓', onClick: () => { } }
    ];

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="window">
                    <Header
                        title="Fournisseurs"
                        showWindowControls={true}
                    />

                    <Toolbar customButtons={toolbarConfig} />

                    {error && (
                        <div style={{
                            padding: '10px',
                            margin: '10px',
                            backgroundColor: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '4px',
                            color: '#c00',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: '#c00'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {showPrintModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '30px',
                                borderRadius: '8px',
                                minWidth: '400px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginTop: 0, color: '#007bff' }}>Options d'impression</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handlePrint('list')}
                                        style={{ padding: '12px', fontSize: '14px' }}
                                    >
                                        📄 Imprimer la liste
                                    </button>
                                    {selectedFournisseur && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handlePrint('selected')}
                                            style={{ padding: '12px', fontSize: '14px' }}
                                        >
                                            📋 Imprimer le fournisseur sélectionné
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handlePrint('all')}
                                        style={{ padding: '12px', fontSize: '14px' }}
                                    >
                                        🖨️ Imprimer la page complète
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => setShowPrintModal(false)}
                                        style={{ padding: '12px', fontSize: '14px' }}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showSearch && (
                        <div style={{
                            padding: '10px',
                            margin: '10px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Rechercher par nom ou référence..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-primary" onClick={handleSearch}>
                                Rechercher
                            </button>
                            <button className="btn" onClick={() => {
                                setSearchTerm('');
                                setFilteredFournisseurs(fournisseurs);
                            }}>
                                Réinitialiser
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', height: 'calc(100% - 200px)' }}>
                        <div className="famille-list-container" style={{ flex: showDetails ? '1' : '1' }}>
                            {loading ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    Chargement des fournisseurs...
                                </div>
                            ) : (
                                <table className="famille-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20px' }}></th>
                                            <th>Code</th>
                                            <th>Nom du fournisseur</th>
                                            <th>Référence</th>
                                            <th>Articles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFournisseurs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                    Aucun fournisseur trouvé
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredFournisseurs.map(fournisseur => (
                                                <tr
                                                    key={fournisseur.fournisseur_id}
                                                    onClick={() => handleRowClick(fournisseur)}
                                                    className={selectedId === fournisseur.fournisseur_id ? 'selected' : ''}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td>🏢</td>
                                                    <td>{fournisseur.fournisseur_id}</td>
                                                    <td>{fournisseur.fournisseur_name}</td>
                                                    <td>{fournisseur.fournisseur_reference || '-'}</td>
                                                    <td>{fournisseur.articles?.length || 0}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {showDetails && selectedFournisseur && (
                            <div style={{
                                width: '350px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '15px',
                                backgroundColor: '#fff',
                                overflowY: 'auto'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #007bff',
                                    paddingBottom: '10px'
                                }}>
                                    <h3 style={{ margin: 0, color: '#007bff' }}>Détails</h3>
                                    <button
                                        onClick={() => setShowDetails(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#555', display: 'block', marginBottom: '5px' }}>
                                        Code:
                                    </strong>
                                    <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                        {selectedFournisseur.fournisseur_id}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#555', display: 'block', marginBottom: '5px' }}>
                                        Nom: *
                                    </strong>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editedData.fournisseur_name}
                                        onChange={(e) => setEditedData({ ...editedData, fournisseur_name: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#555', display: 'block', marginBottom: '5px' }}>
                                        Référence:
                                    </strong>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editedData.fournisseur_reference}
                                        onChange={(e) => setEditedData({ ...editedData, fournisseur_reference: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#555', display: 'block', marginBottom: '5px' }}>
                                        Nombre d'articles:
                                    </strong>
                                    <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                        {selectedFournisseur.articles?.length || 0}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#555', display: 'block', marginBottom: '5px' }}>
                                        Date d'ajout:
                                    </strong>
                                    <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
                                        {new Date(selectedFournisseur.fournisseur_added_date).toLocaleString('fr-FR')}
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSaveDetails}
                                        disabled={isSaving}
                                        style={{ flex: 1 }}
                                    >
                                        {isSaving ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={handleEdit}
                                        style={{ flex: 1 }}
                                    >
                                        ✏️ Éditer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button className="btn" onClick={handleEdit} disabled={!selectedId}>
                            Ouvrir
                        </button>
                        <button className="btn btn-primary" onClick={handleNew}>
                            Nouveau
                        </button>
                        <button className="btn" onClick={handleDelete} disabled={!selectedId}>
                            Supprimer
                        </button>
                        <button className="btn" onClick={() => navigate('/')}>
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FournisseurListPage;