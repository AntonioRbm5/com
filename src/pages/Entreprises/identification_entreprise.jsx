import { useState } from "react";
import CoordonneesSection from "../../composants/formulaires/CoordonneesSection";
import TelecommunicationSection from "../../composants/formulaires/TelecommunicationSection";
import "./entreprise_style.css"

const Identification_entreprise = () => {
  const [formData, setFormData] = useState({
    raison_sociale: "",
    activites: [""],
    forme_juridique: "",
    capital: "",
    commentaire: "",
    adresse: "",
    complement: "",
    code_postal: "",
    ville: "",
    region: "",
    pays: "",
    telephone: "",
    telecopie: "",
    linkedin: "",
    facebook: "",
    email: "",
    site_internet: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis :", formData);
  };


    // Fonction pour ajouter une activité
    const addActivite = () => {
    setFormData((prev) => ({
        ...prev,
        activites: [...prev.activites, ""],
    }));
    };


  return (
    <form onSubmit={handleSubmit} className="erp-form">

  {/* ================= Identification ================= */}
  <div className="card mb-4 shadow-sm">
    <div className="card-header bg-light fw-semibold">
      1. Identification
    </div>
    <div className="card-body">

      {/* Raison Sociale */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-2 col-form-label fw-medium">
          Raison sociale
        </label>
        <div className="col-md-10">
          <input
            type="text"
            name="raison_sociale"
            value={formData.raison_sociale}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Activités */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-2 col-form-label fw-medium">
          Activités
        </label>

        <div className="col-md-8">
          {formData.activites.map((act, idx) => (
            <div className="input-group mb-2" key={idx}>
              <input
                type="text"
                className="form-control"
                value={act}
                onChange={(e) => handleActiviteChange(idx, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeActivite(idx)}
              >
                <i className="bi bi-dash"></i>
              </button>n nnnnnnn
            </div>
          ))}
        </div>

        <div className="col-md-2 text-end">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={addActivite}
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>


      {/* Forme Juridique */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-2 col-form-label fw-medium">
          Forme juridique
        </label>
        <div className="col-md-10">
          <input
            type="text"
            name="forme_juridique"
            value={formData.forme_juridique}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Capital */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-2 col-form-label fw-medium">
          Capital
        </label>
        <div className="col-md-10">
          <input
            type="text"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Commentaire */}
      <div className="row mb-3 align-items-center">
        <label className="col-md-2 col-form-label fw-medium">
          Commentaire
        </label>
        <div className="col-md-10">
          <textarea
            name="commentaire"
            value={formData.commentaire}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>
      </div>

    </div>
  </div>

  {/* ================= Coordonnées ================= */}
  <div className="card mb-4 shadow-sm">
    <div className="card-header bg-light fw-semibold">
      2. Coordonnées
    </div>
    <div className="card-body">
      <CoordonneesSection formData={formData} handleChange={handleChange} />
    </div>
  </div>

  {/* ================= Télécommunication ================= */}
  <div className="card mb-4 shadow-sm">
    <div className="card-header bg-light fw-semibold">
      3. Télécommunication
    </div>
    <div className="card-body">
      <TelecommunicationSection
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  </div>

  {/* ================= Immatriculation ================= */}
  <div className="card mb-4 shadow-sm">
    <div className="card-header bg-light fw-semibold">
      4. Immatriculation
    </div>
    <div className="card-body text-muted">
      Rien pour le moment
    </div>
  </div>

  {/* ================= Actions ================= */}
  <div className="d-flex justify-content-end gap-2">
    <button type="submit" className="btn btn-primary px-4">
      <i className="bi bi-save me-1"></i>
      Enregistrer
    </button>
  </div>

</form>

  );
};

export default Identification_entreprise;
