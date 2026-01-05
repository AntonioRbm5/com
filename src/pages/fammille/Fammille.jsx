import React, { useState } from 'react';
import './famille.module.css';

const FamilleArticles = () => {
  const [showModal, setShowModal] = useState(false);
  const [familles, setFamilles] = useState([
    { code: 'ORDB', intitule: 'ORDINATEUR DE BUREAU' }
  ]);

  const [formData, setFormData] = useState({
    code: '',
    intitule: '',
    uniteVente: 'PIECE',
    suiviStock: 'Aucun',
    coefficient: '',
    familleCentralisatrice: '',
    type: 'Détail',
    codeFiscal: '',
    paysOrigine: '',
    catalogue1: 'Aucun',
    catalogue2: 'Aucun',
    catalogue3: 'Aucun',
    catalogue4: 'Aucun'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNouveau = () => {
    setShowModal(true);
    setFormData({
      code: '',
      intitule: '',
      uniteVente: 'PIECE',
      suiviStock: 'Aucun',
      coefficient: '',
      familleCentralisatrice: '',
      type: 'Détail',
      codeFiscal: '',
      paysOrigine: '',
      catalogue1: 'Aucun',
      catalogue2: 'Aucun',
      catalogue3: 'Aucun',
      catalogue4: 'Aucun'
    });
  };

  const handleOK = () => {
    if (formData.code && formData.intitule) {
      setFamilles([...familles, { code: formData.code, intitule: formData.intitule }]);
      setShowModal(false);
    }
  };

  const handleAnnuler = () => {
    setShowModal(false);
  };

  return (
    <div className="app-container">
      {/* Liste des familles */}
      <div className="main-window">
        <div className="window-header">
          <div className="window-icon">⚙</div>
          <div className="window-title">Familles d'articles</div>
          <div className="window-controls">
            <button className="control-btn">−</button>
            <button className="control-btn">□</button>
            <button className="control-btn">×</button>
          </div>
        </div>

        <div className="toolbar">
          <button className="toolbar-btn">⚙ Fonctions ▼</button>
          <button className="toolbar-btn">🖨 Imprimer ▼</button>
          <button className="toolbar-btn">🔍 Rechercher</button>
          <button className="toolbar-btn">❓ Assistant</button>
        </div>

        <div className="content-area">
          <div className="tab-bar">
            <div className="tab active">Tous</div>
            <div className="tab-header">T...</div>
            <div className="tab-header">Code famille</div>
            <div className="tab-header">Intitulé de la famille</div>
            <button className="nav-arrow">›</button>
          </div>

          <div className="data-grid">
            {familles.map((famille, index) => (
              <div key={index} className="grid-row">
                <div className="grid-cell icon-cell">📁</div>
                <div className="grid-cell code-cell">{famille.code}</div>
                <div className="grid-cell intitule-cell">{famille.intitule}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="status-bar">
          CREATION DES FAMILLES D'ARTICLES ET DE...
        </div>

        <div className="bottom-buttons">
          <button className="bottom-btn">Ouvrir</button>
          <button className="bottom-btn primary" onClick={handleNouveau}>Nouveau</button>
          <button className="bottom-btn">Supprimer</button>
          <button className="bottom-btn">Fermer</button>
        </div>
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <div className="window-header">
              <div className="window-icon">⚙</div>
              <div className="window-title">Famille :</div>
              <div className="window-controls">
                <button className="control-btn">−</button>
                <button className="control-btn">□</button>
                <button className="control-btn" onClick={handleAnnuler}>×</button>
              </div>
            </div>

            <div className="modal-tabs">
              <div className="modal-tab active">Identification</div>
              <div className="modal-tab">Tarifs</div>
              <div className="modal-tab">Paramètres</div>
            </div>

            <div className="modal-content">
              <div className="form-section">
                <div className="section-title">Identification</div>
                
                <div className="form-row">
                  <label className="form-label">Code</label>
                  <input 
                    type="text" 
                    name="code"
                    className="form-input" 
                    value={formData.code}
                    onChange={handleInputChange}
                  />
                  
                  <label className="form-label right-label">Type</label>
                  <select 
                    name="type"
                    className="form-select small" 
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option>Détail</option>
                    <option>Groupe</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">Intitulé</label>
                  <input 
                    type="text" 
                    name="intitule"
                    className="form-input full-width" 
                    value={formData.intitule}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">Unité de vente</label>
                  <select 
                    name="uniteVente"
                    className="form-select" 
                    value={formData.uniteVente}
                    onChange={handleInputChange}
                  >
                    <option>PIECE</option>
                    <option>KG</option>
                    <option>LITRE</option>
                  </select>

                  <label className="form-label right-label">Coefficient</label>
                  <input 
                    type="text" 
                    name="coefficient"
                    className="form-input medium" 
                    value={formData.coefficient}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">Suivi de stock</label>
                  <select 
                    name="suiviStock"
                    className="form-select" 
                    value={formData.suiviStock}
                    onChange={handleInputChange}
                  >
                    <option>Aucun</option>
                    <option>Simple</option>
                    <option>Complet</option>
                  </select>

                  <label className="form-label right-label">Famille centralisatrice</label>
                  <select 
                    name="familleCentralisatrice"
                    className="form-select medium" 
                    value={formData.familleCentralisatrice}
                    onChange={handleInputChange}
                  >
                    <option value=""></option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="section-title">Catalogue</div>
                <div className="catalogue-row">
                  <select name="catalogue1" className="form-select catalog" value={formData.catalogue1} onChange={handleInputChange}>
                    <option>Aucun</option>
                  </select>
                  <select name="catalogue2" className="form-select catalog" value={formData.catalogue2} onChange={handleInputChange}>
                    <option>Aucun</option>
                  </select>
                  <select name="catalogue3" className="form-select catalog" value={formData.catalogue3} onChange={handleInputChange}>
                    <option>Aucun</option>
                  </select>
                  <select name="catalogue4" className="form-select catalog" value={formData.catalogue4} onChange={handleInputChange}>
                    <option>Aucun</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="section-title">Description complémentaire</div>
                <div className="form-row">
                  <label className="form-label">Code fiscal</label>
                  <input 
                    type="text" 
                    name="codeFiscal"
                    className="form-input" 
                    value={formData.codeFiscal}
                    onChange={handleInputChange}
                  />

                  <label className="form-label right-label">Pays d'origine</label>
                  <select 
                    name="paysOrigine"
                    className="form-select medium" 
                    value={formData.paysOrigine}
                    onChange={handleInputChange}
                  >
                    <option value=""></option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-btn" onClick={handleNouveau}>Nouveau</button>
              <button className="modal-btn primary" onClick={handleOK}>OK</button>
              <button className="modal-btn" onClick={handleAnnuler}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilleArticles;