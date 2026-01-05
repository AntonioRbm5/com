const TelecommunicationSection = ({ formData, handleChange }) => {
  return (
    <>
      <h6 className="mb-3 mt-4">Télécommunication</h6>

      {/* Téléphone / Télécopie */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Téléphone</label>
            <div className="col-md-8">
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Télécopie</label>
            <div className="col-md-8">
              <input
                type="text"
                name="telecopie"
                value={formData.telecopie}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn / Facebook */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">LinkedIn</label>
            <div className="col-md-8">
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Facebook</label>
            <div className="col-md-8">
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      {/* E-mail / Site internet */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">E-mail</label>
            <div className="col-md-8">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row align-items-center">
            <label className="col-md-4 col-form-label">Site internet</label>
            <div className="col-md-8">
              <input
                type="text"
                name="site_internet"
                value={formData.site_internet}
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

export default TelecommunicationSection;
