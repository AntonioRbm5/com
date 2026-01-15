import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './article.css';
import { getAllArticles } from '../../services/articleService';
import Sidebar from '../../composants/sidebar';
import Navbar from '../../composants/navbar';

const ArticleListPage = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                    <div className="article-list-container">
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                Chargement des articles...
                            </div>
                        ) : (
                            <table className="article-table">
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