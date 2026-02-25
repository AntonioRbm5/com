import { useState, useEffect } from "react";
import CoordonneesSection from "../../composants/formulaires/CoordonneesSection";
import TelecommunicationSection from "../../composants/formulaires/TelecommunicationSection";
import { getAllEntreprises, updateEntreprise } from "../../services/entrepriseService";
import "./entreprise_style.css";
import { createTelecommunication, updateTelecommunication } from "../../services/telecommunicationService";
import { createCoordonnee, updateCoordonnee } from "../../services/coordonneeService";

const EMPTY_COORDONNEE = {
  coordonnees_address: "",
  coordonnees_complement: "",
  coordonnees_code_postal: "",
  coordonnees_ville: "",
  coordonnees_region: "",
  coordonnees_pays: "",
  coordonnees_is_principale: false,
  coordonnee_type_id: "",
};

const EMPTY_FORM = {
  entreprise_id: "",
  raison_sociale: "",
  activites: [""],
  forme_juridique: "",
  capital: "",
  commentaire: "",
  coordonnees: [{ ...EMPTY_COORDONNEE, coordonnees_is_principale: true }],
  telecommunications: [
    {
      telecom_info_tel: "",
      telecom_info_telecopie: "",
      telecom_info_linkdin: "",
      telecom_info_facebook: "",
      telecom_info_email: "",
      telecom_info_site_web: "",
    },
  ],
};

const Identification_entreprise = () => {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [entreprises, setEntreprises] = useState([]);
  const [loadingEntreprises, setLoadingEntreprises] = useState(true);

  // ─── Charger la liste des entreprises au montage ───────────────────────────
  useEffect(() => {
    getAllEntreprises()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setEntreprises(data);
        setLoadingEntreprises(false);
      })
      .catch((err) => {
        console.error("Erreur chargement entreprises :", err);
        setLoadingEntreprises(false);
      });
  }, []);

  // ─── Quand on sélectionne une entreprise → remplir tous les champs ─────────
  const handleEntrepriseSelect = (e) => {
    const selectedId = parseInt(e.target.value);

    if (!selectedId) {
      // Réinitialiser le formulaire si on désélectionne
      setFormData({ ...EMPTY_FORM });
      return;
    }

    const entreprise = entreprises.find((ent) => ent.entreprise_id === selectedId);
    if (!entreprise) return;

    // Mapper les coordonnées venant de l'API
    const coordonnees =
      entreprise.entreprise_coordonnees?.length > 0
        ? entreprise.entreprise_coordonnees.map((c, i) => ({
            coordonnees_id: c.coordonnees_id,
            coordonnees_address: c.coordonnees_address ?? "",
            coordonnees_complement: c.coordonnees_complement ?? "",
            coordonnees_code_postal: c.coordonnees_code_postal ?? "",
            coordonnees_ville: c.coordonnees_ville ?? "",
            coordonnees_region: c.coordonnees_region ?? "",
            coordonnees_pays: c.coordonnees_pays ?? "",
            coordonnees_is_principale: c.coordonnees_is_principale ?? i === 0,
            coordonnee_type_id: c.coordonnee_type_id ?? "",
          }))
        : [{ ...EMPTY_COORDONNEE, coordonnees_is_principale: true }];

    // Mapper les télécommunications venant de l'API
    const telecommunications =
      entreprise.entreprise_telecommunications?.length > 0
        ? entreprise.entreprise_telecommunications.map((t) => ({
            telecom_info_id: t.telecom_info_id,
            telecom_info_tel: t.telecom_info_tel ?? "",
            telecom_info_telecopie: t.telecom_info_telecopie ?? "",
            telecom_info_linkdin: t.telecom_info_linkdin ?? "",
            telecom_info_facebook: t.telecom_info_facebook ?? "",
            telecom_info_email: t.telecom_info_email ?? "",
            telecom_info_site_web: t.telecom_info_site_web ?? "",
          }))
        : [{ ...EMPTY_FORM.telecommunications[0] }];

    setFormData({
      entreprise_id: entreprise.entreprise_id,
      raison_sociale: entreprise.entreprise_name ?? "",
      activites:
        Array.isArray(entreprise.entreprise_activite) &&
        entreprise.entreprise_activite.length > 0
          ? entreprise.entreprise_activite
          : [""],
      forme_juridique: entreprise.entreprise_forme_juridique ?? "",
      capital: entreprise.entreprise_capital ?? "",
      commentaire: entreprise.entreprise_commentaire ?? "",
      coordonnees,
      telecommunications,
    });
  };

  // ─── Handlers génériques ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Activités ─────────────────────────────────────────────────────────────
  const handleActiviteChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.activites];
      updated[index] = value;
      return { ...prev, activites: updated };
    });
  };

  const addActivite = () => {
    setFormData((prev) => ({
      ...prev,
      activites: [...prev.activites, ""],
    }));
  };

  const removeActivite = (index) => {
    setFormData((prev) => ({
      ...prev,
      activites: prev.activites.filter((_, i) => i !== index),
    }));
  };

  // ─── Coordonnées ───────────────────────────────────────────────────────────
  const handleCoordonneeChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.coordonnees];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, coordonnees: updated };
    });
  };

  const addCoordonnee = () => {
    setFormData((prev) => ({
      ...prev,
      coordonnees: [...prev.coordonnees, { ...EMPTY_COORDONNEE }],
    }));
  };

  const removeCoordonnee = (index) => {
    setFormData((prev) => {
      const updated = prev.coordonnees.filter((_, i) => i !== index);
      const hasPrincipale = updated.some((c) => c.coordonnees_is_principale);
      if (!hasPrincipale && updated.length > 0) {
        updated[0] = { ...updated[0], coordonnees_is_principale: true };
      }
      return { ...prev, coordonnees: updated };
    });
  };

  const setPrincipale = (index) => {
    setFormData((prev) => ({
      ...prev,
      coordonnees: prev.coordonnees.map((c, i) => ({
        ...c,
        coordonnees_is_principale: i === index,
      })),
    }));
  };

  // ─── Télécommunications ────────────────────────────────────────────────────
  const handleTelecomChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.telecommunications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, telecommunications: updated };
    });
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
 const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState(null);
const [saveSuccess, setSaveSuccess] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setSaveError(null);
  setSaveSuccess(false);

  try {
    const entrepriseId = formData.entreprise_id;

    // ── 1. Mettre à jour les infos de base de l'entreprise ──────────────────
    await updateEntreprise(entrepriseId, {
      name: formData.raison_sociale,
      activite: formData.activites,
      forme_juridique: formData.forme_juridique,
      capital: formData.capital,
      commentaire: formData.commentaire,
    });

    // ── 2. Sauvegarder les coordonnées ──────────────────────────────────────
    for (const coord of formData.coordonnees) {
      const payload = {
        coordonnees_address:    coord.coordonnees_address,
        coordonnees_complement: coord.coordonnees_complement,
        coordonnees_code_postal:coord.coordonnees_code_postal,
        coordonnees_ville:      coord.coordonnees_ville,
        coordonnees_region:     coord.coordonnees_region,
        coordonnees_pays:       coord.coordonnees_pays,
        coordonnees_is_principale: coord.coordonnees_is_principale,
        coordonnee_type_id:     coord.coordonnee_type_id || null,
        entreprise_id:          entrepriseId,
      };

      if (coord.coordonnees_id) {
        // Déjà en base → mise à jour
        await updateCoordonnee(coord.coordonnees_id, payload);
      } else {
        // Nouvelle entrée → création
        await createCoordonnee(payload);
      }
    }

    // ── 3. Sauvegarder les télécommunications ────────────────────────────────
    for (const telecom of formData.telecommunications) {
      const payload = {
        telecom_info_tel:       telecom.telecom_info_tel,
        telecom_info_telecopie: telecom.telecom_info_telecopie,
        telecom_info_linkdin:   telecom.telecom_info_linkdin,
        telecom_info_facebook:  telecom.telecom_info_facebook,
        telecom_info_email:     telecom.telecom_info_email,
        telecom_info_site_web:  telecom.telecom_info_site_web,
        entreprise_id:          entrepriseId,
      };

      if (telecom.telecom_info_id) {
        // Déjà en base → mise à jour
        await updateTelecommunication(payload, telecom.telecom_info_id);
      } else {
        // Nouvelle entrée → création
        await createTelecommunication(payload);
      }
    }

    setSaveSuccess(true);
    console.log("✅ Enregistrement réussi");

  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement :", err);
    setSaveError("Une erreur est survenue lors de l'enregistrement.");
  } finally {
    setSaving(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="erp-form">

      {/* ================= Sélection Entreprise ================= */}
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-header bg-primary text-white fw-semibold">
          Sélectionner une entreprise existante
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <label className="col-md-2 col-form-label fw-medium">
              Raison sociale
            </label>
            <div className="col-md-10">
              {loadingEntreprises ? (
                <div className="text-muted fst-italic">Chargement...</div>
              ) : (
                <select
                  className="form-select"
                  value={formData.entreprise_id}
                  onChange={handleEntrepriseSelect}
                >
                  <option value="">-- Sélectionner une entreprise --</option>
                  {entreprises.map((ent) => (
                    <option key={ent.entreprise_id} value={ent.entreprise_id}>
                      {ent.entreprise_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 1. Identification ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light fw-semibold">
          1. Identification
        </div>
        <div className="card-body">

          {/* Raison Sociale (lecture seule si entreprise sélectionnée) */}
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
                placeholder="Sélectionnez une entreprise ci-dessus ou saisissez"
              />
            </div>
          </div>

          {/* Activités */}
          <div className="row mb-3 align-items-start">
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
                    placeholder={`Activité ${idx + 1}`}
                  />
                  {formData.activites.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeActivite(idx)}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="col-md-2 text-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={addActivite}
              >
                <i className="bi bi-plus-lg"></i> Ajouter
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

      {/* ================= 2. Coordonnées ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light fw-semibold">
          2. Coordonnées
        </div>
        <div className="card-body">
          <CoordonneesSection
            coordonnees={formData.coordonnees}
            onChange={handleCoordonneeChange}
            onAdd={addCoordonnee}
            onRemove={removeCoordonnee}
            onSetPrincipale={setPrincipale}
          />
        </div>
      </div>

      {/* ================= 3. Télécommunication ================= */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light fw-semibold">
          3. Télécommunication
        </div>
        <div className="card-body">
          <TelecommunicationSection
            telecommunications={formData.telecommunications}
            onChange={handleTelecomChange}
          />
        </div>
      </div>

      {/* ================= 4. Immatriculation ================= */}
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
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => setFormData({ ...EMPTY_FORM })}
        >
          <i className="bi bi-x-circle me-1"></i>
          Réinitialiser
        </button>
        <button type="submit" className="btn btn-primary px-4">
          <i className="bi bi-save me-1"></i>
          Enregistrer
        </button>
      </div>

    </form>
  );
};

export default Identification_entreprise;