import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './article.css';
import { getAllArticles, searchArticle } from '../../services/articleService';
import Sidebar from '../../composants/sidebar';
import Navbar from '../../composants/navbar';

const ArticleListPage = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const response = await getAllArticles();

            if (response.data.status === 'success') {
                setArticles(response.data.data);
            } else {
                setError('Erreur lors du chargement des articles');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (article) => {
        setSelectedId(article.article_id);
        navigate(`/article/edit/${article.article_id}`);
    };

    const handleNew = () => {
        navigate('/article/new');
    };
    const handleSearch = async () => {
        try {
            setLoading(true);

            // si vide → on recharge tout
            if (!searchTerm.trim()) {
                loadArticles();
                return;
            }

            const response = await searchArticle(searchTerm);

            if (response.data.status === 'success') {
                setArticles(response.data.data);
            }

        } catch (err) {
            setError("Erreur lors de la recherche");
        } finally {
            setLoading(false);
        }
    };
    const handleGoToFamille = () => {
        navigate('/famille');
    };

    return (
        <div className="d-flex">
            <div style={{ width: "8%" }}>
                <Sidebar />
            </div>
            <div style={{ width: "92%" }}>
                <Navbar />
                <div className="window">
                    <div className="window-header">
                        <h2 className="window-title">Liste des articles</h2>
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
                        <button
                            className="toolbar-btn"
                            onClick={() => setShowSearch(!showSearch)}
                        >
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
                        <button
                            className="mouvement-toolbar-btn"
                            onClick={handleGoToFamille}
                            style={{ backgroundColor: '#007bff', color: 'white' }}
                        >
                            🏢 Gérer les Familles
                        </button>
                    </div>
                    {showSearch && (
                        <div style={{
                            padding: '10px',
                            background: '#f8f9fa',
                            borderBottom: '1px solid #ddd'
                        }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Rechercher un article..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                style={{ width: '300px', marginRight: '10px' }}
                            />

                            <button
                                className="btn btn-primary"
                                onClick={handleSearch}
                            >
                                Rechercher
                            </button>

                            <button
                                className="btn"
                                onClick={() => {
                                    setSearchTerm('');
                                    loadArticles();
                                }}
                            >
                                Réinitialiser
                            </button>
                        </div>
                    )}

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

                    <div className="article-list-container">
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                Chargement des articles...
                            </div>
                        ) : (
                            <table className="document-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '20px' }}></th>
                                        <th>Référence</th>
                                        <th>Désignation</th>
                                        <th>Famille</th>
                                        <th>Prix de vente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                Aucun article trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        articles.map(article => (
                                            <tr
                                                key={article.article_id}
                                                onClick={() => handleRowClick(article)}
                                                className={selectedId === article.article_id ? 'selected' : ''}
                                            >
                                                <td>📁</td>
                                                <td>{article.article_reference}</td>
                                                <td>{article.article_name}</td>
                                                <td>{article.famille?.famille_name || '-'}</td>
                                                <td>{article.article_prix_vente?.toFixed(2)} €</td>
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
            </div>
        </div>
    );
};

export default ArticleListPage;