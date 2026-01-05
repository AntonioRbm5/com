

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand fw-bold" href="#">
          MyCompany
        </a>

        {/* Bouton hamburger mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Liens */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Fichier
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Edition
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Structure
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Traitement
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Etat
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Fenêtre
              </a>
            </li>
            {/* Bouton connexion */}
            <li className="nav-item ms-3">
              <a className="btn btn-primary" href="#">
                Profil
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
