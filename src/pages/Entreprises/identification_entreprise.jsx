import { useState } from "react";
import CoordonneesSection from "../../composants/formulaires/CoordonneesSection";
import TelecommunicationSection from "../../composants/formulaires/TelecommunicationSection";

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
    <form onSubmit={handleSubmit}>
      <h6>1. Identification</h6>
       {/* ------------------- Section 1 : Identification ------------------- */}
        <h6 className="mb-3">1. Identification</h6>

        {/* Raison Sociale */}
        <div className="row mb-3 align-items-center">
          <label className="col-md-3 col-form-label">Raison sociale</label>
          <div className="col-md-9">
            <input
              type="text"
              name="raison_sociale"
              value={formData.raison_sociale}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Activités dynamiques */}
        <div className="mb-3">
          <label className="form-label">Activités</label>
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
                className="btn btn-danger"
                onClick={() => removeActivite(idx)}
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addActivite}
          >
            Ajouter une activité
          </button>
        </div>

        {/* Forme Juridique */}
        <div className="row mb-3 align-items-center">
          <label className="col-md-3 col-form-label">Forme juridique</label>
          <div className="col-md-9">
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
          <label className="col-md-3 col-form-label">Capital</label>
          <div className="col-md-9">
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
          <label className="col-md-3 col-form-label">Commentaire</label>
          <div className="col-md-9">
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              className="form-control"
              rows={3}
            />
          </div>
        </div>


      {/* Section Coordonnées */}
      <CoordonneesSection formData={formData} handleChange={handleChange} />

      {/* Section Télécommunication */}
      <TelecommunicationSection
        formData={formData}
        handleChange={handleChange}
      />

      {/* Section Immatriculation */}
      <h6 className="mt-4">4. Immatriculation</h6>
      <p>Rien pour le moment</p>

      <div className="text-end mt-4">
        <button type="submit" className="btn btn-primary">
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default Identification_entreprise;
