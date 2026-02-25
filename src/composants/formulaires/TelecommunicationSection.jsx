const TelecommunicationSection = ({ telecommunications = [], onChange }) => {
  return (
    <>
      {telecommunications.map((telecom, index) => (
        <div key={index} className="border rounded p-3 mb-3">
          <span className="fw-semibold text-muted mb-3 d-block">
            Télécommunication {index + 1}
          </span>

          {[
            { label: "Téléphone",   field: "telecom_info_tel",       type: "text" },
            { label: "Télécopie",   field: "telecom_info_telecopie",  type: "text" },
            { label: "Email",       field: "telecom_info_email",      type: "email" },
            { label: "Site web",    field: "telecom_info_site_web",   type: "text" },
            { label: "LinkedIn",    field: "telecom_info_linkdin",    type: "text" },
            { label: "Facebook",    field: "telecom_info_facebook",   type: "text" },
          ].map(({ label, field, type }) => (
            <div className="row mb-3 align-items-center" key={field}>
              <label className="col-md-3 col-form-label">{label}</label>
              <div className="col-md-9">
                <input
                  type={type}
                  className="form-control"
                  value={telecom[field] ?? ""}
                  onChange={(e) => onChange(index, field, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default TelecommunicationSection;
