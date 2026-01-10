import React from 'react';

const DocumentList = ({ typeDoc = "Ventes" }) => {
  return (
    <div className="sage-window sage-app w-100">
      <div className="sage-header">Documents des {typeDoc}</div>
      <div className="d-flex bg-white" style={{ height: '400px' }}>
        <div className="bg-light border-end p-2" style={{ width: '180px' }}>
          <div className="fw-bold mb-2">Documents en cours</div>
          <div className="ps-2">Devis</div>
          <div className="ps-2 bg-primary text-white">Tous les documents</div>
        </div>
        <div className="flex-grow-1 overflow-auto">
          <table className="sage-table">
            <thead>
              <tr>
                <th>Type</th><th>N° pièce</th><th>Date</th><th>Référence</th><th>N° client</th><th>Total TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="badge bg-dark">FA</span></td>
                <td>FACT0001</td><td>12/07/22</td><td>REF123</td><td>4111ETECH</td><td className="text-end fw-bold">8 565 600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;