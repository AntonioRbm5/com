const CoordonneesSection = ({ formData, handleChange }) => {
  return (
    <>
      <h6 className="mb-3 mt-4">Coordonnées</h6>

      {/* Adresse */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-3 col-form-label">Adresse</label>
        <div className="col-md-9">
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Complément */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-3 col-form-label">Complément</label>
        <div className="col-md-9">
          <input
            type="text"
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Code Postal / Ville */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Code postal</label>
            <div className="col-md-8">
              <input
                type="text"
                name="code_postal"
                value={formData.code_postal}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Ville</label>
            <div className="col-md-8">
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Région / Pays */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Région</label>
            <div className="col-md-8">
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Pays</label>
            <div className="col-md-8">
              <input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoordonneesSection;
