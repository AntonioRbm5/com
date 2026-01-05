
import React, { useState } from 'react';
import OptionsTraitement from './OptionsTraitement';
import Logistique from './Logistique';
import Comptabilite from './Comptabilite';


const ParametresTab = ({ formData, handleInputChange }) => {
  const [activeSidebar, setActiveSidebar] = useState('traitement');

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div className="sidebar-menu">
        <div
          className={`sidebar-item ${activeSidebar === 'traitement' ? 'active' : ''}`}
          onClick={() => setActiveSidebar('traitement')}
        >
          Options de traitement
        </div>
        <div
          className={`sidebar-item ${activeSidebar === 'logistique' ? 'active' : ''}`}
          onClick={() => setActiveSidebar('logistique')}
        >
          Logistique
        </div>
        <div
          className={`sidebar-item ${activeSidebar === 'comptabilite' ? 'active' : ''}`}
          onClick={() => setActiveSidebar('comptabilite')}
        >
          Comptabilité
        </div>
        <div
          className={`sidebar-item ${activeSidebar === 'production' ? 'active' : ''}`}
          onClick={() => setActiveSidebar('production')}
        >
          Gestion de production
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {activeSidebar === 'traitement' && (
          <OptionsTraitement formData={formData} handleInputChange={handleInputChange} />
        )}
        {activeSidebar === 'logistique' && (
          <Logistique formData={formData} handleInputChange={handleInputChange} />
        )}
        {activeSidebar === 'comptabilite' && <Comptabilite />}
        {activeSidebar === 'production' && (
          <div className="form-section">
            <div className="form-section-title">Gestion de production</div>
            <p>Section en construction...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametresTab;