import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logotantana from "../assets/images/icons/tantana_logo_blue.png";
import { FaPlus, FaTrash } from "react-icons/fa";


const InitEntrepriseForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    activite: [""],
    num_siret: "",
    naf_ape: "",
  });

  // navigation
  const navigation = useNavigate()
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
    // alert("Formulaire soumis ! Voir console pour le payload.");
    navigation("/success-entreprise")
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{marginTop:"150px"}}>
        <div className="container">
          <div className="card">
            <div className="card-body p-5">
              <div className="row mb-5">
                {/* Indicateur d'étapes */}
                <div className="stepper mb-4">
                  {/* Step 1 */}
                  <div className="stepper-item">
                    <div className={`step-circle ${step >= 1 ? "step-active" : "step-inactive"}`}>
                      1
                    </div>
                    <div className={`step-line ${step > 1 ? "step-active-line" : "step-inactive-line"}`} />
                  </div>

                  {/* Step 2 */}
                  <div className="stepper-item">
                    <div className={`step-circle ${step >= 2 ? "step-active" : "step-inactive"}`}>
                      2
                    </div>
                    <div className={`step-line ${step > 2 ? "step-active-line" : "step-inactive-line"}`} />
                  </div>

                  {/* Step 3 */}
                  <div className="stepper-item">
                    <div className={`step-circle ${step >= 3 ? "step-active" : "step-inactive"}`}>
                      3
                    </div>
                    <div className={`step-line ${step === 3 ? "step-active-line" : "step-inactive-line"}`} />
                  </div>

                  {/* FIN */}
                  <div className={`step-finish ${step === 3 ? "step-active" : "step-inactive"}`}>
                    ✓
                  </div>
                </div>


              </div>
              <div className="row">
                <div className="col-6 mt-5">
                    <div style={{width:"50px"}}>   
                      <img style={{width:"100%"}} src={logotantana} alt="Logo tantana blue" />
                    </div>
                    <div>
                      <p className="ft-l-1"><b>Créer un entreprise</b></p>
                      <p className="ft-2">
                        Inscription pour affilié votre entreprise sur cette application. <br />
                        Remplir les informations nécéssaires pour valider sa création
                      </p>
                    </div>
                    
                </div>
                <div className="col-6 mt-5">

                  <form onSubmit={handleSubmit}>
                    {/* Étape 1 : Nom de l'entreprise */}
                    {step === 1 && (
                      <div>
                        <div className="mb-3">
                          <input
                            style={{
                              height : "50px",
                              border: "1px solid grey"
                            }}
                            type="text"
                            className="form-control mb-1"
                            id="name"
                            name="name"
                            placeholder="Nom de l'entreprise"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                          <a style={{cursor:"pointer", color:"#0d6efd"}}>Générer automatiquement un nom?</a>
                        </div>
                        <button 
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => navigation("/login")}
                        >
                          Précedent
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
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
                                className="btn btn-danger btn-sm"
                                onClick={() => removeActivite(index)}
                              >
                                <FaTrash/>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm mb-3"
                          onClick={addActivite}
                        >
                          Ajouter
                        </button>
                        <div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => setStep(1)}
                          >
                            Précédent
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
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
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => setStep(2)}
                          >
                            Précédent
                          </button>
                          <button type="submit" className="btn btn-primary btn-sm">
                            Terminer
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </div>
    
  );
};

export default InitEntrepriseForm;
