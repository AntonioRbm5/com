import React from 'react'
import { useNavigate } from 'react-router-dom';
import './famille.css';

const FamilleListPage = ({
    familles = [],
    onSelectFamille = () => { },
    onNewFamille = () => { },
    selectedId = null
}) => {
    const navigate = useNavigate();

    const handleRowClick = (famille) => {
        onSelectFamille(famille);
        navigate(`/famille/edit/${famille.code}`);
    };

    const handleNew = () => {
        onNewFamille();
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

            <div className="famille-list-container">
                <table className="famille-table">
                    <thead>
                        <tr>
                            <th style={{ width: '20px' }}></th>
                            <th>Code famille</th>
                            <th>Intitulé de la famille</th>
                        </tr>
                    </thead>
                    <tbody>
                        {familles.map(famille => (
                            <tr
                                key={famille.code}
                                onClick={() => handleRowClick(famille)}
                                className={selectedId === famille.code ? 'selected' : ''}
                            >
                                <td>📁</td>
                                <td>{famille.code}</td>
                                <td>{famille.intitule}</td>
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

export default FamilleListPage
