import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userillustration from "../../assets/images/illustrations/user_creation.png";
import { addUser, getAllUserRole } from "../../slice/userSlice";
import { getAllEntreprise } from "../../slice/entrepriseSlice";


const UserSignupForm = () => {
  // Initialisation du composant
  const [role_list, setRoleList] = useState([])
  const [entreprise_list, setEntrepriseList] = useState([])

  useEffect(() => {
    getAllUserRole().then( role_list => { if (role_list.data) setRoleList(role_list.data) })
    getAllEntreprise().then( entreprise_list => { if (entreprise_list.data) setEntrepriseList(entreprise_list.data) })
  } , [])

  // Navigation
  const navigation = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    role: "",
    entreprise_id: "",
  });

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification simple
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirm_password ||
      !formData.role ||
      !formData.entreprise_id
    ) {
      return;
    }

    // Payload final
    const payload = {
      ...formData,
      role: Number(formData.role),
      entreprise_id: Number(formData.entreprise_id),
    }
    console.log("Payload :", payload);
    addUser(payload).then(res =>{ if(res.data) navigation("/login")})
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
              <div className="col-6">
                  <img src={userillustration} alt="user illustration" style={{width: "100%"}}/>
              </div>
              <div className="col-6">
                <h3 className="card-title mb-5">Sign Up</h3>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                        {/* Email */}
                        <div className="form-floating mb-3">
                          
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@gmail.com"
                            required
                          />
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                        </div>
                    </div>
                    <div className="col-6">
                        {/* Username */}
                        <div className="form-floating mb-3">
                          
                          <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Antonio Rbm 5"
                            required
                          />
                          <label htmlFor="username" className="form-label">
                            Nom d'utilisateur
                          </label>
                        </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      {/* Password */}
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="azerty1234"
                          required
                        />
                        <label htmlFor="password" className="form-label">
                          Nouveau mot de passe
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      {/* Password */}
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          id="confirm_password"
                          name="confirm_password"
                          className="form-control"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder=""
                          required
                        />
                        <label htmlFor="confirm_password" className="form-label">
                          Confirm mot de passe
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      {/* Role */}
                      <div className="form-floating mb-3">
                        
                        <select
                          id="role"
                          name="role"
                          className="form-select"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Sélectionnez un rôle</option>
                          {role_list.map((r) => (
                            <option key={r.role_id} value={r.role_id}>
                              {r.role_name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="role" className="form-label">
                          Rôle
                        </label>
                      </div>
                    </div>
                  </div>
                  

                  

                  

                  {/* Entreprise */}
                  <div className="row">
                    <div className="col-12">
                         <div className="form-floating mb-3">
                          
                          <select
                            id="entreprise_id"
                            name="entreprise_id"
                            className="form-select"
                            value={formData.entreprise_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="">-- Sélectionnez une entreprise --</option>
                            {entreprise_list.map((e) => (
                              <option key={e.entreprise_id} value={e.entreprise_id}>
                                {e.entreprise_name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="entreprise_id" className="form-label">
                            Entreprise
                          </label>
                        </div>
                    </div>
                  </div>
                 
                  <div className="d-flex justify-content-end mt-5">
                    
                        {/* Bouton Submit */}
                        <button type="button" className="btn btn-outline-secondary  me-2"
                          onClick={() => navigation("/login")}
                        >
                            Précédent
                        </button>
                        <button type="submit" className="btn btn-primary ">
                          S'inscrire
                        </button>
                   
                  </div>
                  
                </form>
              </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default UserSignupForm;
