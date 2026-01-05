import { Outlet, useMatch } from "react-router-dom";
import illustration from "../../assets/images/illustrations/compta.png"
const Entreprise = () => {
    const isGlobalRoute = useMatch("/entreprise/global");
    return (
        <div class="p-3">
            <div class="card">
                <div class="card-body">
                    <div className="row">
                        <div className="col-4">
                            {isGlobalRoute ? (
                                <img
                                src={illustration}
                                alt="Illustration comptable"
                                style={{ width: "100%" }}
                                />
                            ) : (
                                <div className="list-group">
                                    <span className="list-group-item active">
                                        Menu Entreprise
                                    </span>
                                    <a href="/entreprise/global" className="list-group-item">
                                        Informations générales
                                    </a>
                                    <a href="/entreprise/fiscal" className="list-group-item">
                                        Fiscalité
                                    </a>
                                    <a href="/entreprise/banque" className="list-group-item">
                                        Banque
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="col-8">
                            <Outlet />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        
    )
}
export default Entreprise;