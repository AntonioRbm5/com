
const Logistique = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="article-form-section">
        <div className="article-form-section-title">Caractéristiques</div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Unité poids</label>
            <select
              className="article-form-select"
              value={formData.unitesPoids || 'Kilogramme'}
              onChange={(e) => handleInputChange('unitesPoids', e.target.value)}
            >
              <option>Kilogramme</option>
              <option>Gramme</option>
              <option>Tonne</option>
            </select>
          </div>
          <div className="article-form-group">
            <label className="article-form-label">Délai livraison (jours)</label>
            <input
              type="number"
              className="form-input"
              value={formData.delaiLivraison || 0}
              onChange={(e) => handleInputChange('delaiLivraison', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Racine référence</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.racineReference || ''}
              onChange={(e) => handleInputChange('racineReference', e.target.value)}
            />
          </div>
          <div className="article-form-group">
            <label className="article-form-label">Garantie (mois)</label>
            <input
              type="number"
              className="form-input"
              value={formData.garantie || 0}
              onChange={(e) => handleInputChange('garantie', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Racine code barres</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.racineCodeBarres || ''}
              onChange={(e) => handleInputChange('racineCodeBarres', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="article-form-section">
        <div className="article-form-section-title">Gestion du stock</div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Suivi de stock</label>
            <select
              className="article-form-select"
              value={formData.suiviStockParam || 'CMUP'}
              onChange={(e) => handleInputChange('suiviStockParam', e.target.value)}
            >
              <option>CMUP</option>
              <option>FIFO</option>
              <option>LIFO</option>
            </select>
          </div>
          <div className="article-form-group">
            <label className="article-form-label">Niveau de criticité</label>
            <select
              className="article-form-select"
              value={formData.niveauCriticite || 'Mineur'}
              onChange={(e) => handleInputChange('niveauCriticite', e.target.value)}
            >
              <option>Mineur</option>
              <option>Moyen</option>
              <option>Critique</option>
            </select>
          </div>
        </div>
        <div className="article-form-row">
          <label className="form-checkbox-label">
            <input 
              type="checkbox" 
              className="form-checkbox"
              checked={formData.reserveSousTraitance || false}
              onChange={(e) => handleInputChange('reserveSousTraitance', e.target.checked)}
            />
            Réserver à la sous-traitance
          </label>
        </div>
      </div>

      <div className="article-form-section">
        <div className="article-form-section-title">Frais fixes</div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Coût de stockage</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input"
              value={formData.coutStockage || ''}
              onChange={(e) => handleInputChange('coutStockage', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Coût de transport</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input"
              value={formData.coutTransport || ''}
              onChange={(e) => handleInputChange('coutTransport', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="article-form-row">
          <div className="article-form-group">
            <label className="article-form-label">Coût annexe</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input"
              value={formData.coutAnnexe || ''}
              onChange={(e) => handleInputChange('coutAnnexe', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Logistique;