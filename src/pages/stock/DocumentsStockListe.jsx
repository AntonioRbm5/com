import React, { useState } from 'react';
import '../stock/stock.css';
import Sidebar from '../Layout/Sidebar';
import Toolbar from '../Layout/Toolbar';

const DocumentsStockListe = ({ documents, onSelectDocument, onNewDocument, onOpenFiltres }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeType, setActiveType] = useState('Mouvement d\'entrée');

  const menuItems = [
    'Mouvement d\'entrée',
    'Mouvement de sortie',
    'Dépréciation du stock',
    'Mouvement de transfert',
    'Préparation de fabrication',
    'Bon de fabrication',
    'Tous les documents'
  ];

  const handleRowClick = (doc, index) => {
    setSelectedRow(index);
  };

  const handleRowDoubleClick = (doc) => {
    onSelectDocument(doc);
  };

  const sidebarItems = [
    { id: 'Mouvement d\'entrée', label: 'Mouvement d\'entrée' },
    { id: 'Mouvement de sortie', label: 'Mouvement de sortie' },
    { id: 'Dépréciation du stock', label: 'Dépréciation du stock' },
    { id: 'Mouvement de transfert', label: 'Mouvement de transfert' },
    { id: 'Préparation de fabrication', label: 'Préparation de fabrication' },
    { id: 'Bon de fabrication', label: 'Bon de fabrication' },
    { id: 'Tous les documents', label: 'Tous les documents' }
  ];

  const toolbarConfig = [
    { label: 'Function', icon: '⚙', onClick: () => { } },
    { label: 'Filtrer', icon: '🔍', onClick: () => { } },
    { label: 'Mes filtres', icon: '⭐', onClick: () => { } }
  ];

  return (
    <div className="stock-list-container">
      <Sidebar
        items={sidebarItems}
        activeItem={activeType}
        onItemClick={setActiveType}
      />
      <div className="stock-main-content">
        <Toolbar customButtons={toolbarConfig} />
        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>T...</th>
                <th style={{ width: '50px' }}>E...</th>
                <th>N° pièce</th>
                <th>Référence</th>
                <th>Date</th>
                <th>Dépôt origi...</th>
                <th>Dépôt destination</th>
                <th style={{ width: '30px' }}>▶</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                    Aucun document pour "{activeType}". Cliquez sur "Nouveau" pour créer.
                  </td>
                </tr>
              ) : (
                documents
                  .filter(doc => activeType === 'Tous les documents' || doc.type === activeType)
                  .map((doc, index) => (
                    <tr
                      key={index}
                      className={selectedRow === index ? 'selected' : ''}
                      onClick={() => handleRowClick(doc, index)}
                      onDoubleClick={() => handleRowDoubleClick(doc)}
                    >
                      <td>
                        <span style={{ color: '#0066cc' }}>📄</span>
                      </td>
                      <td>ME</td>
                      <td>{doc.numeroPiece}</td>
                      <td>{doc.reference}</td>
                      <td>{doc.date}</td>
                      <td>{doc.depotOrigine}</td>
                      <td>{doc.depotDestination || ''}</td>
                      <td></td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="stock-footer-actions">
          <button className="stock-footer-left">
            Plus de critères...
          </button>
          <div className="stock-footer-right">
            <button
              className="btn-custom btn-secondary-custom"
              onClick={() => {
                if (selectedRow !== null) {
                  onSelectDocument(documents[selectedRow]);
                }
              }}
            >
              Ouvrir
            </button>
            <button
              className="btn-custom btn-primary-custom"
              onClick={onNewDocument}
            >
              Nouveau
            </button>
            <button className="btn-custom btn-secondary-custom">
              Supprimer
            </button>
            <button className="btn-custom btn-secondary-custom">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStockListe;