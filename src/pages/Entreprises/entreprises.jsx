import { Outlet, useMatch, NavLink } from "react-router-dom";
const Entreprise = () => {
    const isGlobalRoute = useMatch("/entreprise/global");
    // return (
    //     <div class="p-3">
    //         <div class="card">
    //             <div class="card-body">
    //                 <div className="row">
    //                     <div className="col-4">
    //                         {isGlobalRoute ? (
    //                             <img
    //                             src={illustration}
    //                             alt="Illustration comptable"
    //                             style={{ width: "100%" }}
    //                             />
    //                         ) : (
    //                             <div className="list-group">
    //                                 <span className="list-group-item active">
    //                                     Menu Entreprise
    //                                 </span>
    //                                 <a href="/entreprise/global" className="list-group-item">
    //                                     Informations générales
    //                                 </a>
    //                                 <a href="/entreprise/fiscal" className="list-group-item">
    //                                     Fiscalité
    //                                 </a>
    //                                 <a href="/entreprise/banque" className="list-group-item">
    //                                     Banque
    //                                 </a>
    //                             </div>
    //                         )}
    //                     </div>
    //                     <div className="col-8">
    //                         <Outlet />
    //                     </div>
    //                 </div>
                    
    //             </div>
    //         </div>
    //     </div>
        
    // )
    const MENU = [
    { label: "Identification", path: "identity" },
    { label: "Monnaie & Formats", path: "monnaie-format" },
    { label: "Loi Anti-Fraude TVA", path: "loi-anti-fraude-tva" },
    { label: "IFRS", path: "ifrs" },
    { label: "Fichiers liés", path: "global" },
    { label: "Préférences", path: "preference" },
    { label: "Logo", path: "logo-entreprise" }
    ];
    return (
        <div className="entreprise-container">
            <div class="erp-header">
                <div class="header-title">
                    <span class="header-icon">⚙</span><span>#Identification de votre société</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn">−</button>
                    <button class="window-btn">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div className="entreprise-content">
                {/* SIDEBAR */}
                <div className="sidebar-erp">
                    {MENU.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                        `sidebar-item ${isActive ? "active" : ""}`
                        }
                    >
                        {item.label}
                    </NavLink>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="entreprise-table-container">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Entreprise;