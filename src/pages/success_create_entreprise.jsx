import { useEffect } from "react";
import { FaCheckCircle, FaBuilding, FaArrowRight, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EntrepriseSuccess = ({ entrepriseName = "Mon Entreprise" }) => {
  //navigation
  const navigation = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      navigation("/home-commercial")
    }, 2000);
  })
  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: "520px" }}>
        <div className="card-body text-center">
          
          {/* Icône succès */}
          <FaCheckCircle size={70} className="text-success mb-3" />

          <h4 className="fw-bold">Félicitations 🎉</h4>
          <p className="text-muted">
            Votre entreprise a été créée avec succès.
          </p>

          {/* Récap entreprise */}
          <div className="alert alert-light border d-flex align-items-center gap-2 mt-3">
            <FaBuilding className="text-primary" />
            <span className="fw-semibold">{entrepriseName}</span>
          </div>

          

        </div>
      </div>
    </div>
  );
};

export default EntrepriseSuccess;
