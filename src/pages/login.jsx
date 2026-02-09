import { useState } from "react";
import LogosTantana from "../assets/images/icons/tantana_logo.png";
// import { useToast } from "../hooks/toast_notifs_hooks";
import * as userService from "../services/userService";
import * as userUtilis from "../utilis/authStorage";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  // const { addToast } = useToast();


  //Navigation
  const navigation = useNavigate()

  const [form, setForm] = useState({
      email: "",
      password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        const res = await userService.loginUser(form)
        if (res.data) {
          console.log("test", res.data)
          userUtilis.saveAuth(res.data);
          navigation(`/home-commercial`)
        }
        // addToast(`${data.data.user.username} nouvel session`, "success")
        
      } catch  {
        setError("Mots de passe ou Email incorrect!");
      } finally {
        setLoading(false);
      }
  };
  return (

      <section className="bg-primary py-3 py-md-5 py-xl-8 vh-100">
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-12 col-md-6 col-xl-7">
              <div className="d-flex justify-content-center text-bg-primary">
                <div className="col-12 col-xl-9">
                  <img className="img-fluid rounded mb-4" loading="lazy" src={LogosTantana} width="150" height="80" alt="Tantana Logo" />
                  <hr className="border-primary-subtle mb-4" />
                  <h2 className="h1 mb-4">TANTANA un application de Gestion comptabilité et commercial</h2>
                  <p className="lead mb-5">Ventes, Achats, Journal, Stocks, Suivi, etc...</p>
                  <div className="text-endx">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-grip-horizontal" viewBox="0 0 16 16">
                      <path d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-5">
              <div className="card border-0 rounded-4">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4">
                        <h3>Sign in</h3>
                        <p>Don't have an account? <a href="#!">Sign up</a></p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger">{error}</div>
                    )}
                    <div className="row gy-3 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            id="email" 
                            placeholder="name@example.com" 
                            value={form.email}
                            onChange={handleChange}
                            required />
                          <label htmlFor="email" className="form-label">Email</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input 
                            type="password" 
                            className="form-control"
                            name="password" 
                            id="password" 
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password" 
                            required />
                          <label htmlFor="password" className="form-label">Password</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" value="" name="remember_me" id="remember_me" />
                          <label className="form-check-label text-secondary" htmlFor="remember_me">
                            Keep me logged in
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <button className="btn btn-primary btn-lg" 
                          disabled={loading}
                          type="submit">
                            {loading ? "Connexion..." : "Log in now"}
                            
                            </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end mt-4">
                        <a href="#!">Forgot password</a>
                        
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <p className="mt-4 mb-4">Or continue with</p>
                      <div className="d-flex gap-2 gap-sm-3 justify-content-centerX">
                        <button className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-2 position-relative px-4 py-2" 
                          onClick={() => navigation("/utilisateur/inscription")}
                        >
                          <FaPlus size={14} />
                          <span>Inscription Utilisateur</span>

                          {/* Badge notification */}
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            !
                          </span>
                        </button>
                       
                        
                        <button className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-2 position-relative px-4 py-2" 
                          onClick={() => navigation("/inscription-entreprise")}
                        >
                          <FaPlus size={14} />
                          <span>Créer une nouvelle entreprise</span>

                          {/* Badge notification */}
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            !
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


  )
}

export default LoginForm;