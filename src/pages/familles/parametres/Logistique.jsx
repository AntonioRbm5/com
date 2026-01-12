import React from 'react';

const Logistique = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="famille-form-section">
        <div className="famille-form-section-title">Caractéristiques</div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Unité poids</label>
            <select
              className="famille-form-select"
              value={formData.unitesPoids}
              onChange={(e) => handleInputChange('unitesPoids', e.target.value)}
            >
              <option>Kilogramme</option>
              <option>Gramme</option>
              <option>Tonne</option>
            </select>
          </div>
          <div className="famille-form-group">
            <label className="famille-form-label">Délai livraison (jours)</label>
            <input
              type="number"
              className="form-input"
              value={formData.delaiLivraison}
              onChange={(e) => handleInputChange('delaiLivraison', e.target.value)}
            />
          </div>
        </div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Racine référence</label>
            <input type="text" className="form-input" />
          </div>
          <div className="famille-form-group">
            <label className="famille-form-label">Garantie (mois)</label>
            <input
              type="number"
              className="form-input"
              value={formData.garantie}
              onChange={(e) => handleInputChange('garantie', e.target.value)}
            />
          </div>
        </div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Racine code barres</label>
            <input type="text" className="form-input" />
          </div>
        </div>
      </div>

      <div className="famille-form-section">
        <div className="famille-form-section-title">Gestion du stock</div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Suivi de stock</label>
            <select
              className="famille-form-select"
              value={formData.suiviStockParam}
              onChange={(e) => handleInputChange('suiviStockParam', e.target.value)}
            >
              <option>CMUP</option>
              <option>FIFO</option>
              <option>LIFO</option>
            </select>
          </div>
          <div className="famille-form-group">
            <label className="famille-form-label">Niveau de criticité</label>
            <select
              className="famille-form-select"
              value={formData.niveauCriticite}
              onChange={(e) => handleInputChange('niveauCriticite', e.target.value)}
            >
              <option>Mineur</option>
              <option>Moyen</option>
              <option>Critique</option>
            </select>
          </div>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="checkbox" className="form-checkbox" />
            Réserver à la sous-traitance
          </label>
        </div>
      </div>

      <div className="famille-form-section">
        <div className="famille-form-section-title">Frais fixes</div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Coût de stockage</label>
            <input type="text" className="form-input" />
          </div>
        </div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Coût de transport</label>
            <input type="text" className="form-input" />
          </div>
        </div>
        <div className="famille-form-row">
          <div className="famille-form-group">
            <label className="famille-form-label">Coût annexe</label>
            <input type="text" className="form-input" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Logistique;