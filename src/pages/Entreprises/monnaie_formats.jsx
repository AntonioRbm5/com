const Monnaie_formats = () => {
    const handleSubmit = () => {}
    return (
        <form onSubmit={handleSubmit} className="erp-form">
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-light fw-semibold">
                     <h6>Monnaie de tenue de la société</h6>
                     <p>Indique la devis dans laquelle vous souhaitez tenir votre société. Cette devis s'applique à vos données comptables et commerciales</p>
                </div>
                <div className="card-body p-4">
                    <div className="row mb-3 align-items-center">
                        <label className="col-md-2 col-form-label fw-medium">
                        Devise
                        </label>
                        <div className="col-md-10">
                        <input
                            type="text"
                            value={"Ariary"}
                            name="devise"
                            className="form-control"
                        />
                        </div>
                    </div>
                     <div className="row mb-3 align-items-center">
                        <label className="col-md-2 col-form-label fw-medium">
                        Format montant
                        </label>
                        <div className="col-md-10">
                        <input
                            type="text"
                            value={"# ##0"}
                            name="format_montant"
                            className="form-control"
                        />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-light fw-semibold">
                     <p>Indique la devise dans laquelle seront convertis les montants di l'inverseur est activité (Edition / Inverseur)</p>
                </div>
                <div className="card-body p-4">
                    <div className="row mb-3 align-items-center">
                        <label className="col-md-2 col-form-label fw-medium">
                        Quantité
                        </label>
                        <div className="col-md-10">
                        <input
                            type="text"
                            value={"# ##0,00"}
                            name="qte"
                            className="form-control"
                        />
                        </div>
                    </div>
                     <div className="row mb-3 align-items-center">
                        <label className="col-md-2 col-form-label fw-medium">
                        Prix
                        </label>
                        <div className="col-md-10">
                        <input
                            type="text"
                            value={"# ##0"}
                            name="price"
                            className="form-control"
                        />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
export default Monnaie_formats;