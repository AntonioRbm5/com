import React from 'react';
import './DetailComptabilite.css';

const DetailComptabilite = ({ compte, onClose }) => {
  if (!compte) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Barre de titre */}
        <div className="modal-header">
          <div className="header-title">
            <div className="header-icon">G</div>
            <span>Famille/Comptabilité : {compte.categorie}</span>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Corps du formulaire */}
        <div className="modal-body">
          
          <div className="domaine-box">
            <label>Domaine :</label>
            <input type="text" value="Ventes" readOnly />
          </div>

          <div className="section">
            <h3 className="form-section-title">Compte général et section analytique</h3>
            <div className="form-grid">
              <div className="field-group">
                <label>Compte général</label>
                <select><option>{compte.compteGeneral}</option></select>
              </div>
              <div className="field-group">
                <label>Section analytique</label>
                <select><option>{compte.section || ""}</option></select>
              </div>
            </div>
          </div>

          {/* Boucle pour les 3 Taxes */}
          {[1, 2, 3].map((num) => (
            <div key={num} className="section">
              <h3 className="form-section-title">Taux de taxe {num}</h3>
              <div className="form-grid">
                <div className="field-group">
                  <label>Code taxe</label>
                  <select><option>{num === 1 ? compte.taxe : ""}</option></select>
                </div>
                <div className="field-group">
                  <label>Date d'application</label>
                  <input type="date" />
                </div>
                <div className="field-group">
                  <label>Ancien code taxe</label>
                  <select><option></option></select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pied de page */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-ok">OK</button>
          <button onClick={onClose} className="btn-annuler">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default DetailComptabilite;