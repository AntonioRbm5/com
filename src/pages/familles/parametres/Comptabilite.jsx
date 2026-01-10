import React, { useState } from 'react';

const Comptabilite = () => {
  const [domaine, setDomaine] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalData, setModalData] = useState({
    domaine: '',
    compteGeneral: '',
    sectionAnalytique: '',
    codeTaxe1: '',
    dateApplication1: '',
    ancienCodeTaxe1: '',
    codeTaxe2: '',
    dateApplication2: '',
    ancienCodeTaxe2: '',
    codeTaxe3: '',
    dateApplication3: '',
    ancienCodeTaxe3: ''
  });

  const [comptabilisationData, setComptabilisationData] = useState([
    {
      categorie: 'VENTE NATIONALE',
      compteGeneral: '70110000',
      intituleCompte: 'dans la Régi...',
      section: '',
      intituleSection: '',
      taxe1: 'TVAF/18%',
      intituleTaxe: ''
    },
    {
      categorie: 'ACHAT NATIONAL',
      compteGeneral: '60110000',
      intituleCompte: 'dans la Régi...',
      section: '',
      intituleSection: '',
      taxe1: 'TVAR/18%',
      intituleTaxe: ''
    },
    {
      categorie: 'STOCK',
      compteGeneral: '31110000',
      intituleCompte: 'Marchandis...',
      section: '',
      intituleSection: '',
      taxe1: '',
      intituleTaxe: ''
    }
  ]);

  const handleOpenModal = (index) => {
    const row = comptabilisationData[index];
    setSelectedRow(index);
    setModalData({
      domaine: row.categorie === 'VENTE NATIONALE' ? 'Ventes' :
        row.categorie === 'ACHAT NATIONAL' ? 'Achats' :
          row.categorie === 'STOCK' ? 'Stocks' : '',
      compteGeneral: row.compteGeneral,
      sectionAnalytique: row.section,
      codeTaxe1: row.taxe1,
      dateApplication1: '',
      ancienCodeTaxe1: '',
      codeTaxe2: '',
      dateApplication2: '',
      ancienCodeTaxe2: '',
      codeTaxe3: '',
      dateApplication3: '',
      ancienCodeTaxe3: ''
    });
    setShowModal(true);
  };

  const handleModalSave = () => {
    if (selectedRow !== null) {
      const updated = [...comptabilisationData];
      updated[selectedRow] = {
        ...updated[selectedRow],
        compteGeneral: modalData.compteGeneral,
        section: modalData.sectionAnalytique,
        taxe1: modalData.codeTaxe1
      };
      setComptabilisationData(updated);
    }
    setShowModal(false);
  };

  const filteredData = domaine === 'Tous'
    ? comptabilisationData
    : comptabilisationData.filter(row => {
      if (domaine === 'Ventes') return row.categorie.includes('VENTE');
      if (domaine === 'Achats') return row.categorie.includes('ACHAT');
      if (domaine === 'Stocks') return row.categorie === 'STOCK';
      return true;
    });

  return (
    <>
      <div className="form-section">
        <div className="form-section-title">Paramètres de comptabilisation</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Domaine</label>
            <select
              className="form-select"
              value={domaine}
              onChange={(e) => setDomaine(e.target.value)}
            >
              <option>Tous</option>
              <option>Ventes</option>
              <option>Achats</option>
              <option>Stocks</option>
            </select>
          </div>
        </div>
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
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.categorie}</td>
                <td>{row.compteGeneral}</td>
                <td>{row.intituleCompte}</td>
                <td>{row.section}</td>
                <td>{row.intituleSection}</td>
                <td>{row.taxe1}</td>
                <td>{row.intituleTaxe}</td>
                <td>
                  <button
                    className="btn"
                    style={{ padding: '2px 8px' }}
                    onClick={() => handleOpenModal(index)}
                  >
                    Ouvrir...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '12px' }}>
          <button className="btn">Réinitialiser</button>
        </div>
      </div>

      {/* Modal Comptabilité */}
      {showModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
          <div
            className="modal"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '0',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              zIndex: 1000,
              minWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f5f5f5'
              }}
            >
              <span>Famille/Comptabilité : {modalData.domaine === 'Ventes' ? 'VENTE NATIONALE' :
                modalData.domaine === 'Achats' ? 'ACHAT NATIONAL' :
                  'STOCK'}</span>
              <button
                onClick={() => setShowModal(false)}
                style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              <div className="form-section" style={{ marginBottom: 0 }}>
                <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
                  <strong>Domaine :</strong> {modalData.domaine}
                </div>

                <div className="form-section-title">Compte général et section analytique</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Compte général</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalData.compteGeneral}
                      onChange={(e) => setModalData({ ...modalData, compteGeneral: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section analytique</label>
                    <select
                      className="form-select"
                      value={modalData.sectionAnalytique}
                      onChange={(e) => setModalData({ ...modalData, sectionAnalytique: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                    </select>
                  </div>
                </div>

                <div className="form-section-title">Taux de taxe 1</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Code taxe</label>
                    <select
                      className="form-select"
                      value={modalData.codeTaxe1}
                      onChange={(e) => setModalData({ ...modalData, codeTaxe1: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                      <option>TVAF/18%</option>
                      <option>TVAR/18%</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date d'application</label>
                    <input
                      type="date"
                      className="form-input"
                      value={modalData.dateApplication1}
                      onChange={(e) => setModalData({ ...modalData, dateApplication1: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ancien code taxe</label>
                    <select
                      className="form-select"
                      value={modalData.ancienCodeTaxe1}
                      onChange={(e) => setModalData({ ...modalData, ancienCodeTaxe1: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                    </select>
                  </div>
                </div>

                <div className="form-section-title">Taux de taxe 2</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Code taxe</label>
                    <select
                      className="form-select"
                      value={modalData.codeTaxe2}
                      onChange={(e) => setModalData({ ...modalData, codeTaxe2: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date d'application</label>
                    <input
                      type="date"
                      className="form-input"
                      value={modalData.dateApplication2}
                      onChange={(e) => setModalData({ ...modalData, dateApplication2: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ancien code taxe</label>
                    <select
                      className="form-select"
                      value={modalData.ancienCodeTaxe2}
                      onChange={(e) => setModalData({ ...modalData, ancienCodeTaxe2: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                    </select>
                  </div>
                </div>

                <div className="form-section-title">Taux de taxe 3</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Code taxe</label>
                    <select
                      className="form-select"
                      value={modalData.codeTaxe3}
                      onChange={(e) => setModalData({ ...modalData, codeTaxe3: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date d'application</label>
                    <input
                      type="date"
                      className="form-input"
                      value={modalData.dateApplication3}
                      onChange={(e) => setModalData({ ...modalData, dateApplication3: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ancien code taxe</label>
                    <select
                      className="form-select"
                      value={modalData.ancienCodeTaxe3}
                      onChange={(e) => setModalData({ ...modalData, ancienCodeTaxe3: e.target.value })}
                    >
                      <option value="">-- Sélectionner --</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                padding: '12px 16px',
                borderTop: '1px solid #ddd',
                backgroundColor: '#f5f5f5'
              }}
            >
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleModalSave}>OK</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Comptabilite;