import React from 'react';

const InvoiceForm = () => {
  return (
    <div className="sage-window sage-app p-2">
      <div className="bg-white border p-2 mb-2">
        <div className="row g-2">
          <div className="col-3">
            <label className="d-block text-primary">Client</label>
            <input type="text" className="sage-input w-100" defaultValue="4111VIRAGE" />
          </div>
          <div className="col-2">
            <label className="d-block">Date</label>
            <input type="text" className="sage-input w-100" defaultValue="15/07/22" />
          </div>
          <div className="col-2">
            <label className="d-block">N° pièce</label>
            <input type="text" className="sage-input w-100" defaultValue="FACT0002" />
          </div>
        </div>
      </div>
      <table className="sage-table border">
        <thead>
          <tr><th>Référence</th><th>Désignation</th><th>P.U. HT</th><th>Qté</th><th>Total HT</th></tr>
        </thead>
        <tbody>
          <tr className="bg-info bg-opacity-10">
            <td>IMPR0007</td><td>EPSON SC T3100M</td><td>1 723 528</td><td>2,00</td><td className="text-end">3 447 056</td>
          </tr>
        </tbody>
      </table>
      <div className="text-end p-2 fw-bold text-primary">Total HT : 27 232 870</div>
    </div>
  );
};

export default InvoiceForm;