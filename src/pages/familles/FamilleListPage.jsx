import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './famille.css';
import { getAllFamilles } from '../../services/familleService';

const FamilleListPage = () => {
    const navigate = useNavigate();
    const [familles, setFamilles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFamilles();
    }, []);

    const loadFamilles = async () => {
        try {
            setLoading(true);
            const response = await getAllFamilles();
            
            if (response.data.status === 'success') {
                setFamilles(response.data.data);
            } else {
                setError('Erreur lors du chargement des familles');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (famille) => {
        setSelectedId(famille.famille_id);
        navigate(`/famille/edit/${famille.famille_id}`);
    };

    const handleNew = () => {
        navigate('/famille/new');
    };

    return (
        <div className="window">
            <div className="window-header">
                <h2 className="window-title">Familles d'articles</h2>
                <div className="window-controls">
                    <button className="window-control-btn">_</button>
                    <button className="window-control-btn">□</button>
                    <button className="window-control-btn">×</button>
                </div>
            </div>

            <div className="toolbar">
                <button className="toolbar-btn active">
                    <span className="toolbar-icon">📋</span>
                    Tous
                </button>
                <button className="toolbar-btn">
                    <span className="toolbar-icon">🔍</span>
                    Rechercher
                </button>
                <button className="toolbar-btn">
                    <span className="toolbar-icon">🖨️</span>
                    Imprimer
                </button>
                <button className="toolbar-btn">
                    <span className="toolbar-icon">❓</span>
                    Assistant
                </button>
            </div>

            {error && (
                <div style={{ 
                    padding: '10px', 
                    margin: '10px', 
                    backgroundColor: '#fee', 
                    border: '1px solid #fcc',
                    borderRadius: '4px',
                    color: '#c00'
                }}>
                    {error}
                </div>
            )}

            <div className="famille-list-container">
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        Chargement des familles...
                    </div>
                ) : (
                    <table className="famille-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20px' }}></th>
                                <th>Code famille</th>
                                <th>Intitulé de la famille</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {familles.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                        Aucune famille trouvée
                                    </td>
                                </tr>
                            ) : (
                                familles.map(famille => (
                                    <tr
                                        key={famille.famille_id}
                                        onClick={() => handleRowClick(famille)}
                                        className={selectedId === famille.famille_id ? 'selected' : ''}
                                    >
                                        <td>📁</td>
                                        <td>{famille.famille_id}</td>
                                        <td>{famille.famille_name}</td>
                                        <td>{famille.famille_description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="form-actions">
                <button className="btn" onClick={() => navigate('/')}>Ouvrir</button>
                <button className="btn btn-primary" onClick={handleNew}>Nouveau</button>
                <button className="btn">Supprimer</button>
                <button className="btn">Fermer</button>
            </div>
        </div>
    );
};

export default FamilleListPage;