import { useState } from "react";
import CoordonneesSection from "../../composants/formulaires/CoordonneesSection";
import TelecommunicationSection from "../../composants/formulaires/TelecommunicationSection";

const Sdidentifications = () => {
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
    return (
       <form action="">
        {/* ================= Identification ================= */}
         <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light fw-semibold">
            1. Identification
            </div>
            <div className="card-body">
                <h6 className="mb-3 mt-4">Identification</h6>
                {/* Intitulé */}
                <div className="row mb-3 align-items-center">
                    <label className="col-md-3 col-form-label">Intitulé</label>
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

                {/* Responsable */}
                <div className="row mb-3 align-items-center">
                    <label className="col-md-3 col-form-label">Responsable depôt</label>
                    <div className="col-md-9">
                    <select className="form-control">
                        <option value="" selected>--User Default--</option>
                    </select>
                    </div>
                </div>

                {/* Code */}
                <div className="row mb-3">
                    <div className="col-md-6">
                    <div className="row align-items-center">
                        <label className="col-md-4 col-form-label">Code dépot</label>
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
                        <label className="col-md-4 col-form-label">Catégorie comptable</label>
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

       </form>
    )
}
export default Sdidentifications;