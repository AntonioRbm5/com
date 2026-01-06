import React from 'react'
import { useNavigate } from 'react-router-dom';
import './article.css';

const ArticleListPage = ({
    articles = [],
    onSelectArticle = () => { },
    onNewArticle = () => { },
    selectedId = null
}) => {
    const navigate = useNavigate();

    const handleRowClick = (article) => {
        onSelectArticle(article);
        navigate(`/article/edit/${article.code}`);
    };

    const handleNew = () => {
        onNewArticle();
        navigate('/article/new');
    };

    return (
        <div className="window">
            <div className="window-header">
                <h2 className="window-title">Articles d'articles</h2>
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

            <div className="article-list-container">
                <table className="article-table">
                    <thead>
                        <tr>
                            <th style={{ width: '20px' }}></th>
                            <th>Code article</th>
                            <th>Intitulé de la article</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr
                                key={article.code}
                                onClick={() => handleRowClick(article)}
                                className={selectedId === article.code ? 'selected' : ''}
                            >
                                <td>📁</td>
                                <td>{article.code}</td>
                                <td>{article.intitule}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-actions">
                <button className="btn" onClick={() => navigate('/')}>Ouvrir</button>
                <button className="btn btn-primary" onClick={handleNew}>Nouveau</button>
                <button className="btn">Supprimer</button>
                <button className="btn">Fermer</button>
            </div>
        </div>
    )
}

export default ArticleListPage
