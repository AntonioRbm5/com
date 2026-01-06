import React, { useState } from 'react';
import DetailComptabilite from './DetailComptabilite';

const Comptabilite = ({ comptes = [{
    categorie: "VENTE NATIONALE",
    compteGeneral: "70110000",
    intituleCompte: "dans la Régi...",
    section: "",
    intituleSection: "",
    taxe: "TVAF/18%",
    intituleTaxe: ""
  },], domaines = [], selectedDomaine, onDomaineChange, onReset }) => {
    const [compteSelectionne, setCompteSelectionne] = useState(null);
  return (
    <div className="form-section">
      <div className="form-section-title">Paramètres de comptabilisation</div>

      {/* Sélecteur dynamique des domaines */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Domaine</label>
          <select
            className="form-select"
            value={selectedDomaine || 'Tous'}
            onChange={(e) => onDomaineChange?.(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {domaines.map((domaine) => (
              <option key={domaine} value={domaine}>{domaine}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau dynamique */}
      <table className="param-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Compte général</th>
            <th>Intitulé compte</th>
            <th>Section</th>
            <th>Intitulé section</th>
            <th>Taxe 1</th>
            <th>Intitulé taxe</th>
            <th style={{ width: '50px' }}></th>
          </tr>
        </thead>
        <tbody>
          {comptes.length > 0 ? (
            comptes.map((compte, i) => (
              <tr key={i}>
                <td>{compte.categorie || ''}</td>
                <td>{compte.compteGeneral || ''}</td>
                <td>{compte.intituleCompte || ''}</td>
                <td>{compte.section || ''}</td>
                <td>{compte.intituleSection || ''}</td>
                <td>{compte.taxe || ''}</td>
                <td>{compte.intituleTaxe || ''}</td>
                <td>
                  <button 
                  onClick={() => setCompteSelectionne(compte)} // On ouvre ici
                  className="text-blue-600 hover:underline"
                >
                  Ouvrir...
                </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '12px' }}>
                Aucun compte disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bouton Réinitialiser */}
      <div style={{ textAlign: 'right', marginTop: '12px' }}>
        <button className="btn" onClick={onReset}>Réinitialiser</button>
      </div>
      {compteSelectionne && (
        <DetailComptabilite 
          compte={compteSelectionne} 
          onClose={() => setCompteSelectionne(null)} 
        />
      )}
    </div>
  );
};

export default Comptabilite;
