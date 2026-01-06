import React, { useState } from 'react';
import '../stock/stock.css';

const FiltresMouvementModal = ({ show, onHide, onApply }) => {
  const [filtres, setFiltres] = useState({
    valorisation: 'Prix de revient',
    classement: 'Par référence article',
    depot: 'Tous',
    dateDe: '010122',
    dateA: '311222',
    articleDe: '',
    articleA: '',
    emplacementDe: '',
    emplacementA: '',
    modeleEtat: 'Standard',
    detailNumeroSerie: false,
    detailEmplacements: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltres(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApply = () => {
    onApply(filtres);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="mouvement-modal-overlay">
      <div className="mouvement-modal-container filtres-modal-container">
        <div className="mouvement-modal-header">
          <span className="mouvement-modal-title">Mouvements de stock</span>
          <button className="close-btn" onClick={onHide}>×</button>
        </div>

        <div className="mouvement-toolbar" style={{ justifyContent: 'flex-start' }}>
          <button className="mouvement-toolbar-btn">⚙ Fonctions</button>
          <button className="mouvement-toolbar-btn">➕ Plus de critères</button>
          <button className="mouvement-toolbar-btn">🔄 Différer</button>
        </div>

        <div className="filtres-form">
          <div className="filtres-form-group">
            <label>Valorisation</label>
            <select name="valorisation" value={filtres.valorisation} onChange={handleChange}>
              <option>Prix de revient</option>
              <option>CMUP</option>
              <option>FIFO</option>
              <option>Dernier prix d'achat</option>
            </select>
          </div>

          <div className="filtres-form-group">
            <label>Classement</label>
            <select name="classement" value={filtres.classement} onChange={handleChange}>
              <option>Par référence article</option>
              <option>Par famille</option>
              <option>Par dépôt</option>
            </select>
          </div>

          <div className="filtres-form-group">
            <label>Dépôt</label>
            <select name="depot" value={filtres.depot} onChange={handleChange}>
              <option>Tous</option>
              <option>SIEGE</option>
              <option>DEPOT 1</option>
              <option>DEPOT 2</option>
            </select>
          </div>

          <div className="filtres-form-group">
            <label>Date de</label>
            <div className="filtres-date-range">
              <input
                type="text"
                name="dateDe"
                value={filtres.dateDe}
                onChange={handleChange}
              />
              <button className="mouvement-toolbar-btn" style={{ padding: '2px 6px' }}>📅</button>
              <span>à</span>
              <input
                type="text"
                name="dateA"
                value={filtres.dateA}
                onChange={handleChange}
              />
              <button className="mouvement-toolbar-btn" style={{ padding: '2px 6px' }}>📅</button>
            </div>
          </div>

          <div className="filtres-form-group">
            <label>Article de</label>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <select name="articleDe" value={filtres.articleDe} onChange={handleChange}>
                <option value=""></option>
              </select>
              <span style={{ fontSize: '11px', color: '#666' }}>à</span>
              <select name="articleA" value={filtres.articleA} onChange={handleChange}>
                <option value=""></option>
              </select>
            </div>
          </div>

          <div className="filtres-form-group">
            <label>Emplacement de</label>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <select name="emplacementDe" value={filtres.emplacementDe} onChange={handleChange}>
                <option value=""></option>
              </select>
              <span style={{ fontSize: '11px', color: '#666' }}>à</span>
              <select name="emplacementA" value={filtres.emplacementA} onChange={handleChange}>
                <option value=""></option>
              </select>
            </div>
          </div>

          <div className="filtres-form-group">
            <label>Modèle de l'état</label>
            <select name="modeleEtat" value={filtres.modeleEtat} onChange={handleChange}>
              <option>Standard</option>
              <option>Détaillé</option>
              <option>Synthèse</option>
            </select>
          </div>

          <div className="filtres-checkboxes">
            <div className="filtres-checkbox-item">
              <input
                type="checkbox"
                name="detailNumeroSerie"
                checked={filtres.detailNumeroSerie}
                onChange={handleChange}
              />
              <label>Détail des N° série/lot</label>
            </div>

            <div className="filtres-checkbox-item">
              <input
                type="checkbox"
                name="detailEmplacements"
                checked={filtres.detailEmplacements}
                onChange={handleChange}
              />
              <label>Détail des emplacements</label>
            </div>
          </div>
        </div>

        <div className="mouvement-modal-footer">
          <button className="btn-custom btn-primary-custom" onClick={handleApply}>
            OK
          </button>
          <button className="btn-custom btn-secondary-custom" onClick={onHide}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltresMouvementModal;