import React from 'react';

const OptionsTraitement = ({ formData, handleInputChange }) => {

  // Sécurités API
  // const facturation = formData.facturation ?? {};
   const facturation = formData.facturation || {
    sansEscompte: false,
    poidsNet: false,
    publierSurSite: false,
    vendreAuDebit: false,
    contremarque: false,
  };
  const impression = formData.impression ?? 'none';
  const modeles = formData.modeles ?? [];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>

        {/* FACTURATION */}
        <div className="form-section">
          <div className="form-section-title">Facturation</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              ['sansEscompte', "Ne pas soumettre à l'escompte"],
              ['poidsNet', 'Facturer au poids net'],
              ['publierSurSite', 'Publier sur le site marchand'],
              ['vendreAuDebit', 'Vendre au débit'],
              ['contremarque', 'Gérer en contremarque'],
            ].map(([key, label]) => (
              <label key={key} className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={facturation[key] ?? false}
                  onChange={(e) =>
                    handleInputChange(`facturation.${key}`, e.target.checked)
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* IMPRESSION */}
        <div className="form-section">
          <div className="form-section-title">Impression</div>

          {[
            ['none', 'Ne pas imprimer'],
            ['forfait', 'Facturer au forfait'],
            ['exclure', 'Exclure des statistiques'],
          ].map(([value, label]) => (
            <label key={value} className="form-checkbox-label">
              <input
                type="radio"
                name="impression"
                checked={impression === value}
                onChange={() => handleInputChange('impression', value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* MODELES */}
        <div className="form-section">
          <div className="form-section-title">Modèle d'enregistrement</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <table className="param-table">
                <thead>
                  <tr>
                    <th>Intitulé</th>
                    <th>Domaine</th>
                  </tr>
                </thead>
                <tbody>
                  {modeles.map((row, i) => (
                    <tr key={row.id ?? i}>
                      <td>
                        <input
                          value={row.intitule ?? ''}
                          onChange={(e) =>
                            handleInputChange(`modeles.${i}.intitule`, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={row.domaine ?? ''}
                          onChange={(e) =>
                            handleInputChange(`modeles.${i}.domaine`, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <button className="btn" style={{ minWidth: '100px' }}>
                Ouvrir...
              </button>
              <button className="btn" style={{ minWidth: '100px' }}>
                Ajouter...
              </button>
              <button className="btn" style={{ minWidth: '100px' }}>
                Supprimer
              </button>
              <button className="btn" style={{ minWidth: '100px' }}>
                Modifier...
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsTraitement;
