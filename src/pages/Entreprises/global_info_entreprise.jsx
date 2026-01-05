import { useState } from "react";

const Global_info_entreprise = () => {
  const [formData, setFormData] = useState({
    adresse: "",
    complement: "",
    code_postal: "",
    ville: "",
    region: "",
    pays: "",
    sirep: "",
    naf: "",
    numero_identification: "",
    telephone: "",
    telecopie: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Validation simple
    if (!formData.adresse || !formData.code_postal || !formData.ville) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }

    console.log("Données soumises :", formData);

    // 👉 Exemple API
    // axios.post("/api/entreprise/global", formData)
  };

  return (
<div>
  <h5>Saisie de coordonnées de l'entreprise</h5>
  <p>
    <b>Renseignez la fiche d'identification de la société</b>
  </p>

  <form onSubmit={handleSubmit} className="mt-4">

    {/* Adresse */}
    <div className="row mb-3 align-items-center">
      <label className="col-md-3 col-form-label">Adresse *</label>
      <div className="col-md-9">
        <input
          type="text"
          className="form-control"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    {/* Complément */}
    <div className="row mb-3 align-items-center">
      <label className="col-md-3 col-form-label">Complément d'adresse</label>
      <div className="col-md-9">
        <input
          type="text"
          className="form-control"
          name="complement"
          value={formData.complement}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Code postal / Ville */}
    <div className="row mb-3">
      <div className="col-md-6">
        <div className="row align-items-center">
          <label className="col-md-4 col-form-label">Code postal *</label>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              name="code_postal"
              value={formData.code_postal}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="row align-items-center">
          <label className="col-md-4 col-form-label">Ville *</label>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              required
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
              className="form-control"
              name="region"
              value={formData.region}
              onChange={handleChange}
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
              className="form-control"
              name="pays"
              value={formData.pays}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>

    {/* SIREP / NAF */}
    <div className="row mb-3">
      <div className="col-md-6">
        <div className="row align-items-center">
          <label className="col-md-4 col-form-label">Numéro SIREP</label>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              name="sirep"
              value={formData.sirep}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="row align-items-center">
          <label className="col-md-4 col-form-label">Code NAF (APE)</label>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              name="naf"
              value={formData.naf}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Numéro identification */}
    <div className="row mb-3 align-items-center">
      <label className="col-md-3 col-form-label">
        Numéro d'identification
      </label>
      <div className="col-md-9">
        <input
          type="text"
          className="form-control"
          name="numero_identification"
          value={formData.numero_identification}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Télécommunication */}
    <hr />
    <h6>Télécommunication</h6>

    <div className="row mb-3">
      <div className="col-md-6">
        <div className="row align-items-center">
          <label className="col-md-4 col-form-label">Téléphone</label>
          <div className="col-md-8">
            <input
              type="tel"
              className="form-control"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
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
              className="form-control"
              name="telecopie"
              value={formData.telecopie}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Submit */}
    <div className="text-end mt-4">
      <button type="submit" className="btn btn-primary">
        Enregistrer
      </button>
    </div>
  </form>
</div>

  );
};

export default Global_info_entreprise;
