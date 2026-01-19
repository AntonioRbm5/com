import { Outlet, useMatch, NavLink } from "react-router-dom";
import "./entreprise_style.css"
const Entreprise = () => {
    const isGlobalRoute = useMatch("/entreprise/global");
    // return (
    //     <div className="p-3">
    //         <div className="card">
    //             <div className="card-body">
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
            <div className="erp-header">
                <div className="header-title">
                    <span className="header-icon">⚙</span><span>#Identification de votre société</span>
                </div>
                <div className="window-controls">
                    <button className="window-btn">−</button>
                    <button className="window-btn">□</button>
                    <button className="window-btn close">×</button>
                </div>
            </div>
            <div className="entreprise-content d-flex">
                {/* SIDEBAR */}
                <div className="sidebar-erp d-flex flex-column p-3 border-end">
              
                    {MENU.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `sidebar-item d-flex align-items-center gap-2 px-3 py-2 rounded 
                                ${isActive ? "active" : ""}`
                            }
                        >
                            {item.icon && <i className={item.icon}></i>}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>


                {/* CONTENT */}
                <div style={{width:"80%"}} className="p-3">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Entreprise;