import React, { useState } from "react";

const InitEntrepriseForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    activite: [""],
    num_siret: "",
    naf_ape: "",
  });

  // Gérer le changement des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer le changement pour activite array
  const handleActiviteChange = (index, value) => {
    const newActivites = [...formData.activite];
    newActivites[index] = value;
    setFormData({ ...formData, activite: newActivites });
  };

  // Ajouter une activité
  const addActivite = () => {
    setFormData({ ...formData, activite: [...formData.activite, ""] });
  };

  // Supprimer une activité
  const removeActivite = (index) => {
    const newActivites = formData.activite.filter((_, i) => i !== index);
    setFormData({ ...formData, activite: newActivites });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payload final :", formData);
    alert("Formulaire soumis ! Voir console pour le payload.");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Formulaire Entreprise</h2>

          <form onSubmit={handleSubmit}>
            {/* Étape 1 : Nom de l'entreprise */}
            {step === 1 && (
              <div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!formData.name}
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Étape 2 : Activités */}
            {step === 2 && (
              <div>
                {formData.activite.map((act, index) => (
                  <div className="mb-3 d-flex align-items-center" key={index}>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={act}
                      onChange={(e) => handleActiviteChange(index, e.target.value)}
                      placeholder="Activité"
                      required
                    />
                    {formData.activite.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeActivite(index)}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addActivite}
                >
                  Ajouter une activité
                </button>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setStep(1)}
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(3)}
                    disabled={formData.activite.some((a) => a === "")}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3 : Numéro SIRET et NAF/APE */}
            {step === 3 && (
              <div>
                <div className="mb-3">
                  <label htmlFor="num_siret" className="form-label">
                    Numéro SIRET
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="num_siret"
                    name="num_siret"
                    value={formData.num_siret}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="naf_ape" className="form-label">
                    NAF/APE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="naf_ape"
                    name="naf_ape"
                    value={formData.naf_ape}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setStep(2)}
                  >
                    Précédent
                  </button>
                  <button type="submit" className="btn btn-success">
                    Terminer
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InitEntrepriseForm;
