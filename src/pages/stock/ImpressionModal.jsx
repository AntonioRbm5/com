import React, { useState } from 'react';
import '../stock/stock.css';

const ImpressionModal = ({ show, onHide, onPrint, onPreview }) => {
  const [options, setOptions] = useState({
    imprimante: 'Imprimante PDF Sage v5',
    etendue: 'tout',
    pageDe: '',
    pageA: '',
    copies: 1,
    qualiteBrouillon: false,
    impressionPageGarde: false,
    apercuAvantImpression: true,
    impressionParDocument: false,
    impressionFichierPDF: false,
    impressionClasseur: false,
    envoyerEspace: false,
    compresse: false,
    preImprime: false,
    assemblage: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCopiesChange = (delta) => {
    setOptions(prev => ({
      ...prev,
      copies: Math.max(1, prev.copies + delta)
    }));
  };

  const handlePrint = () => {
    if (options.apercuAvantImpression) {
      onPreview(options);
    } else {
      onPrint(options);
    }
    onHide();
  };

  if (!show) return null;

  return (
    <div className="mouvement-modal-overlay">
      <div className="mouvement-modal-container impression-modal-container">
        <div className="mouvement-modal-header">
          <span className="mouvement-modal-title">Impression</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="mouvement-toolbar-btn" style={{ padding: '2px 8px', fontSize: '14px' }}>
              ?
            </button>
            <button className="close-btn" onClick={onHide}>×</button>
          </div>
        </div>

        <div className="impression-form">
          <div className="impression-section">
            <div className="impression-section-title">Imprimante</div>
            <div className="impression-printer-info">
              <span className="impression-printer-label">Nom:</span>
              <span className="impression-printer-value">{options.imprimante}</span>
              <button className="btn-custom btn-secondary-custom">Propriétés</button>

              <span className="impression-printer-label">État:</span>
              <span className="impression-printer-value">Prêt</span>
              <span></span>

              <span className="impression-printer-label">Type:</span>
              <span className="impression-printer-value">Amyuni Document Converter 500</span>
              <span></span>

              <span className="impression-printer-label">Où:</span>
              <span className="impression-printer-value">nul:</span>
              <span></span>

              <span className="impression-printer-label">Comment:</span>
              <span className="impression-printer-value"></span>
              <span></span>
            </div>

            <div className="impression-checkbox-item">
              <input
                type="checkbox"
                name="impressionFichierPDF"
                checked={options.impressionFichierPDF}
                onChange={handleChange}
              />
              <label>Imp. dans fichier</label>
            </div>
          </div>

          <div className="impression-options">
            <div className="impression-option-group">
              <div className="impression-section-title">Étendue d'impression</div>
              
              <div className="impression-radio-item">
                <input
                  type="radio"
                  name="etendue"
                  value="tout"
                  checked={options.etendue === 'tout'}
                  onChange={handleChange}
                />
                <label>Tout</label>
              </div>

              <div className="impression-radio-item">
                <input
                  type="radio"
                  name="etendue"
                  value="pages"
                  checked={options.etendue === 'pages'}
                  onChange={handleChange}
                />
                <label>Pages</label>
                {options.etendue === 'pages' && (
                  <div className="impression-pages-inputs">
                    <span>de :</span>
                    <input
                      type="text"
                      name="pageDe"
                      value={options.pageDe}
                      onChange={handleChange}
                    />
                    <span>à</span>
                    <input
                      type="text"
                      name="pageA"
                      value={options.pageA}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="impression-radio-item">
                <input
                  type="radio"
                  name="etendue"
                  value="selection"
                  checked={options.etendue === 'selection'}
                  onChange={handleChange}
                />
                <label>Sélection</label>
              </div>

              <div style={{ marginTop: '15px' }}>
                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="qualiteBrouillon"
                    checked={options.qualiteBrouillon}
                    onChange={handleChange}
                  />
                  <label>Qualité brouillon</label>
                </div>

                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="impressionPageGarde"
                    checked={options.impressionPageGarde}
                    onChange={handleChange}
                  />
                  <label>Impression page de garde</label>
                </div>

                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="apercuAvantImpression"
                    checked={options.apercuAvantImpression}
                    onChange={handleChange}
                  />
                  <label>Aperçu avant impression</label>
                </div>

                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="impressionParDocument"
                    checked={options.impressionParDocument}
                    onChange={handleChange}
                  />
                  <label>Une impression par document</label>
                </div>

                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="impressionClasseur"
                    checked={options.impressionClasseur}
                    onChange={handleChange}
                  />
                  <label>Impression dans un Classeur Microsoft Excel</label>
                </div>

                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="envoyerEspace"
                    checked={options.envoyerEspace}
                    onChange={handleChange}
                  />
                  <label>Envoyer vers votre espace de stockage</label>
                </div>
              </div>
            </div>

            <div className="impression-option-group">
              <div className="impression-section-title">Copies</div>
              
              <div className="impression-copies-group">
                <div className="impression-copies-input">
                  <label>Nombre de copies :</label>
                  <input
                    type="number"
                    name="copies"
                    value={options.copies}
                    onChange={handleChange}
                    min="1"
                  />
                  <div className="impression-copies-spinners">
                    <button onClick={() => handleCopiesChange(1)}>▲</button>
                    <button onClick={() => handleCopiesChange(-1)}>▼</button>
                  </div>
                </div>

                <div className="impression-collate-options">
                  <div className="impression-collate-demo">
                    <span className="impression-collate-page">1¹</span>
                    <span className="impression-collate-page">2²</span>
                    <span className="impression-collate-page">3³</span>
                  </div>
                  <div className="impression-checkbox-item">
                    <input
                      type="checkbox"
                      name="assemblage"
                      checked={options.assemblage}
                      onChange={handleChange}
                    />
                    <label>Assemb.</label>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="compresse"
                    checked={options.compresse}
                    onChange={handleChange}
                  />
                  <label>Compressé</label>
                </div>

                <div className="impression-checkbox-item">
                  <input
                    type="checkbox"
                    name="preImprime"
                    checked={options.preImprime}
                    onChange={handleChange}
                  />
                  <label>Pré-imprimé</label>
                </div>

                <div className="impression-checkbox-item" style={{ marginTop: '10px' }}>
                  <label>N° 1ère page:</label>
                  <input
                    type="text"
                    defaultValue="1"
                    style={{ width: '60px', marginLeft: '10px', padding: '3px 6px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mouvement-modal-footer">
          <button className="btn-custom btn-primary-custom" onClick={handlePrint}>
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

export default ImpressionModal;