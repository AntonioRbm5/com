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