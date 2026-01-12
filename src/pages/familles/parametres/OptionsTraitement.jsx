
import React from 'react';

const OptionsTraitement = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="famille-form-section">
        <div className="famille-form-section-title">Facturation</div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="checkbox" className="form-checkbox" />
            Ne pas soumettre à l'escompte
          </label>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={formData.publierSurSite}
              onChange={(e) => handleInputChange('publierSurSite', e.target.checked)}
            />
            Publier sur le site marchand
          </label>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="checkbox" className="form-checkbox" />
            Facturer au Poids net
          </label>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="checkbox" className="form-checkbox" />
            Vendre au débit
          </label>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="checkbox" className="form-checkbox" />
            Gérer en contremarque
          </label>
        </div>
      </div>

      <div className="famille-form-section">
        <div className="famille-form-section-title">Impression</div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="radio" name="impression" className="form-checkbox" />
            Ne pas imprimer
          </label>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="radio" name="impression" className="form-checkbox" />
            Facturer au forfait
          </label>
        </div>
        <div className="famille-form-row">
          <label className="form-checkbox-label">
            <input type="radio" name="impression" className="form-checkbox" />
            Exclure des statistiques
          </label>
        </div>
      </div>

      <div className="famille-form-section">
        <div className="famille-form-section-title">Modèle d'enregistrement</div>
        <div className="famille-form-row">
          <div className="form-group">
            <label className="form-label">Intitulé</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Domaine</label>
            <input type="text" className="form-input" />
          </div>
        </div>
        <div style={{ textAlign: 'right', marginTop: '12px' }}>
          <button className="btn">Ouvrir...</button>
          <button className="btn" style={{ marginLeft: '8px' }}>Ajouter...</button>
          <button className="btn" style={{ marginLeft: '8px' }}>Supprimer</button>
          <button className="btn" style={{ marginLeft: '8px' }}>Modifier...</button>
        </div>
      </div>
    </>
  );
};

export default OptionsTraitement;
