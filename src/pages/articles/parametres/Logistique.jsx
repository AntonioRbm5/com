// import React from 'react';

// const Logistique = ({ formData, handleInputChange }) => {
//   return (
//     <>
//       <div className="form-section">
//         <div className="form-section-title">Caractéristiques</div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Unité poids</label>
//             <select
//               className="form-select"
//               value={formData.unitesPoids}
//               onChange={(e) => handleInputChange('unitesPoids', e.target.value)}
//             >
//               <option>Kilogramme</option>
//               <option>Gramme</option>
//               <option>Tonne</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label className="form-label">Délai livraison (jours)</label>
//             <input
//               type="number"
//               className="form-input"
//               value={formData.delaiLivraison}
//               onChange={(e) => handleInputChange('delaiLivraison', e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Racine référence</label>
//             <input type="text" className="form-input" />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Garantie (mois)</label>
//             <input
//               type="number"
//               className="form-input"
//               value={formData.garantie}
//               onChange={(e) => handleInputChange('garantie', e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Racine code barres</label>
//             <input type="text" className="form-input" />
//           </div>
//         </div>
//       </div>

//       <div className="form-section">
//         <div className="form-section-title">Gestion du stock</div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Suivi de stock</label>
//             <select
//               className="form-select"
//               value={formData.suiviStockParam}
//               onChange={(e) => handleInputChange('suiviStockParam', e.target.value)}
//             >
//               <option>CMUP</option>
//               <option>FIFO</option>
//               <option>LIFO</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label className="form-label">Niveau de criticité</label>
//             <select
//               className="form-select"
//               value={formData.niveauCriticite}
//               onChange={(e) => handleInputChange('niveauCriticite', e.target.value)}
//             >
//               <option>Mineur</option>
//               <option>Moyen</option>
//               <option>Critique</option>
//             </select>
//           </div>
//         </div>
//         <div className="form-row">
//           <label className="form-checkbox-label">
//             <input type="checkbox" className="form-checkbox" />
//             Réserver à la sous-traitance
//           </label>
//         </div>
//       </div>

//       <div className="form-section">
//         <div className="form-section-title">Frais fixes</div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Coût de stockage</label>
//             <input type="text" className="form-input" />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Coût de transport</label>
//             <input type="text" className="form-input" />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Coût annexe</label>
//             <input type="text" className="form-input" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Logistique;

import React from 'react';

const Logistique = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="form-section">
        <div className="form-section-title">Caractéristiques</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Unité poids</label>
            <select
              className="form-select"
              value={formData.unitesPoids || 'Kilogramme'}
              onChange={(e) => handleInputChange('unitesPoids', e.target.value)}
            >
              <option>Kilogramme</option>
              <option>Gramme</option>
              <option>Tonne</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Délai livraison (jours)</label>
            <input
              type="number"
              className="form-input"
              value={formData.delaiLivraison || 0}
              onChange={(e) => handleInputChange('delaiLivraison', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Racine référence</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.racineReference || ''}
              onChange={(e) => handleInputChange('racineReference', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Garantie (mois)</label>
            <input
              type="number"
              className="form-input"
              value={formData.garantie || 0}
              onChange={(e) => handleInputChange('garantie', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Racine code barres</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.racineCodeBarres || ''}
              onChange={(e) => handleInputChange('racineCodeBarres', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Gestion du stock</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Suivi de stock</label>
            <select
              className="form-select"
              value={formData.suiviStockParam || 'CMUP'}
              onChange={(e) => handleInputChange('suiviStockParam', e.target.value)}
            >
              <option>CMUP</option>
              <option>FIFO</option>
              <option>LIFO</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Niveau de criticité</label>
            <select
              className="form-select"
              value={formData.niveauCriticite || 'Mineur'}
              onChange={(e) => handleInputChange('niveauCriticite', e.target.value)}
            >
              <option>Mineur</option>
              <option>Moyen</option>
              <option>Critique</option>
            </select>
          </div>
        </div>
        <div className="form-row">
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

      <div className="form-section">
        <div className="form-section-title">Frais fixes</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Coût de stockage</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input"
              value={formData.coutStockage || ''}
              onChange={(e) => handleInputChange('coutStockage', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Coût de transport</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input"
              value={formData.coutTransport || ''}
              onChange={(e) => handleInputChange('coutTransport', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Coût annexe</label>
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