import React from 'react'

const FormBonCommande = () => {
    return (
        <div className="invoice-body container-fluid py-2">

            <div className="row g-2">


                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Client</span>
                        <select className="form-select w-25"><option>Numéro</option></select>
                        <select className="form-select flex-grow-1"><option></option></select>
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Statut</span>
                        <select className="form-select"><option>A préparer</option></select>
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Affaire</span>
                        <select className="form-select"><option></option></select>
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Expédition</span>
                        <select className="form-select"><option></option></select>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Date</span>
                        <input type="text" className="form-control" defaultValue="070722" />
                        <button className="btn btn-outline-secondary" type="button">📅</button>
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Date livraison</span>
                        <select className="form-select w-25"><option>Prévue</option></select>
                        <input type="text" className="form-control" />
                        <button className="btn btn-outline-secondary" type="button">📅</button>
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Représentant</span>
                        <select className="form-select"><option></option></select>
                    </div>
                    <div className="input-group input-group-sm mb-1 text-muted">
                        <span className="input-group-text custom-label bg-light">Info1</span>
                        <input type="text" className="form-control bg-light" disabled />
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">N° document</span>
                        <select className="form-select w-25"><option>N° Pièce</option></select>
                        <input type="text" className="form-control" defaultValue="BC000001" />
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Référence</span>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="input-group input-group-sm mb-1">
                        <span className="input-group-text custom-label">Entête 1</span>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <div className="input-group input-group-sm flex-grow-1">
                            <span className="input-group-text custom-label bg-light">Info2</span>
                            <input type="text" className="form-control bg-light" disabled />
                        </div>
                        <button className="btn btn-outline-primary btn-sm px-4">Valider</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormBonCommande