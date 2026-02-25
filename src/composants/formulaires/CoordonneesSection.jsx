import { useEffect, useState } from "react";
import { getAllCoordonneeTypes } from "../../services/coordonneeService";

const CoordonneesSection = ({ coordonnees = [], onChange, onAdd, onRemove, onSetPrincipale }) => {
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errorTypes, setErrorTypes] = useState(null);

  useEffect(() => {
    getAllCoordonneeTypes()
      .then((res) => {
        // Sécuriser la réponse API — selon votre backend ça peut être res.data ou res.data.data
        const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setTypes(data);
        setLoadingTypes(false);
      })
      .catch((err) => {
        console.error("Erreur chargement types coordonnées", err);
        setErrorTypes("Impossible de charger les types d'adresses.");
        setLoadingTypes(false);
      });
  }, []);

  // Guard : si coordonnees n'est pas un tableau, on ne rend rien
  if (!Array.isArray(coordonnees)) {
    return <div className="text-warning">Données de coordonnées invalides.</div>;
  }

  return (
    <>
      {coordonnees.map((coord, index) => (
        <div
          key={index}
          className={`border rounded p-3 mb-3 ${coord.coordonnees_is_principale ? "border-success" : ""
            }`}
        >
          {/* ── En-tête de la carte ── */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold text-muted">
                Adresse {index + 1}
              </span>
              {coord.coordonnees_is_principale ? (
                <span className="badge bg-success">Principale</span>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={() => onSetPrincipale(index)}
                >
                  <i className="bi bi-star me-1"></i>
                  Définir comme principale
                </button>
              )}
            </div>

            {coordonnees.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => onRemove(index)}
              >
                <i className="bi bi-trash me-1"></i>
                Supprimer
              </button>
            )}
          </div>

          {/* ── Type de coordonnée ── */}
          <div className="row mb-3 align-items-center">
            <label className="col-md-3 col-form-label">
              Type d'adresse
            </label>
            <div className="col-md-9">
              {loadingTypes ? (
                <div className="text-muted fst-italic">Chargement...</div>
              ) : errorTypes ? (
                <div className="text-danger small">{errorTypes}</div>
              ) : (
                <select
                  className="form-select"
                  value={coord.coordonnee_type_id}
                  onChange={(e) =>
                    onChange(index, "coordonnee_type_id", e.target.value)
                  }
                >
                  <option value="">-- Sélectionner un type --</option>
                  {types.map((t) => (
                    <option
                      key={t.coordonnee_type_id}
                      value={t.coordonnee_type_id}
                    >
                      {t.coordonnee_type_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* ── Adresse ── */}
          <div className="row mb-3 align-items-center">
            <label className="col-md-3 col-form-label">Adresse</label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                value={coord.coordonnees_address}
                onChange={(e) =>
                  onChange(index, "coordonnees_address", e.target.value)
                }
                placeholder="Numéro et nom de rue"
              />
            </div>
          </div>

          {/* ── Complément ── */}
          <div className="row mb-3 align-items-center">
            <label className="col-md-3 col-form-label">Complément</label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                value={coord.coordonnees_complement}
                onChange={(e) =>
                  onChange(index, "coordonnees_complement", e.target.value)
                }
                placeholder="Bâtiment, étage, appartement..."
              />
            </div>
          </div>

          {/* ── Code postal / Ville ── */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="row align-items-center">
                <label className="col-md-4 col-form-label">Code postal</label>
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    value={coord.coordonnees_code_postal}
                    onChange={(e) =>
                      onChange(index, "coordonnees_code_postal", e.target.value)
                    }
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
                    className="form-control"
                    value={coord.coordonnees_ville}
                    onChange={(e) =>
                      onChange(index, "coordonnees_ville", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Région / Pays ── */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="row align-items-center">
                <label className="col-md-4 col-form-label">Région</label>
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    value={coord.coordonnees_region}
                    onChange={(e) =>
                      onChange(index, "coordonnees_region", e.target.value)
                    }
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
                    value={coord.coordonnees_pays}
                    onChange={(e) =>
                      onChange(index, "coordonnees_pays", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      ))}

      {/* ── Bouton ajouter une adresse ── */}
      <div className="text-end mt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onAdd}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Ajouter une adresse
        </button>
      </div>
    </>
  );
};

export default CoordonneesSection;