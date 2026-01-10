import React from 'react';

const ProfitabilityReport = () => {
  return (
    <div className="bg-secondary p-4 d-flex justify-content-center">
      <div className="bg-white p-5 shadow-sm" style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="d-flex justify-content-between border-bottom mb-4">
          <span className="fw-bold">LES ASSOCIES</span>
          <span>Le 10/01/26</span>
        </div>
        <h3 className="text-center mb-5">Analyse rentabilité clients</h3>
        <table className="table table-bordered border-dark table-sm">
          <thead>
            <tr>
              <th>N° Client</th><th>Intitulé</th><th>CA HT</th><th>Marge</th><th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>4111ETECH</td><td>E-TECHNOLOGIES</td><td>7 258 983</td><td>1 451 796</td><td>20,00</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitabilityReport;