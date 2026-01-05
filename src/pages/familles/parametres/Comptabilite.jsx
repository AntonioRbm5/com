
import React from 'react';

const Comptabilite = () => {
  return (
    <div className="form-section">
      <div className="form-section-title">Paramètres de comptabilisation</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Domaine</label>
          <select className="form-select">
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
          <tr>
            <td>VENTE NATIONALE</td>
            <td>70110000</td>
            <td>dans la Régi...</td>
            <td></td>
            <td></td>
            <td>TVAF/18%</td>
            <td></td>
            <td><button className="btn" style={{ padding: '2px 8px' }}>Ouvrir...</button></td>
          </tr>
          <tr>
            <td>ACHAT NATIONAL</td>
            <td>60110000</td>
            <td>dans la Régi...</td>
            <td></td>
            <td></td>
            <td>TVAR/18%</td>
            <td></td>
            <td><button className="btn" style={{ padding: '2px 8px' }}>Ouvrir...</button></td>
          </tr>
          <tr>
            <td>STOCK</td>
            <td>31110000</td>
            <td>Marchandis...</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><button className="btn" style={{ padding: '2px 8px' }}>Ouvrir...</button></td>
          </tr>
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: '12px' }}>
        <button className="btn">Réinitialiser</button>
      </div>
    </div>
  );
};

export default Comptabilite;
