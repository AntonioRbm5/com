import { Outlet, NavLink } from "react-router-dom";
import "./entreprise_style.css"
import Sidebar from "../../composants/sidebar";
import Navbar from "../../composants/navbar";
import Header from "../Layout/Header";
import Toolbar from "../Layout/Toolbar";
const Entreprise = () => {
    
    const MENU = [
    { label: "Identification", path: "identity" },
    { label: "Monnaie & Formats", path: "monnaie-format" },
    { label: "Loi Anti-Fraude TVA", path: "loi-anti-fraude-tva" },
    { label: "IFRS", path: "ifrs" },
    { label: "Fichiers liés", path: "global" },
    { label: "Préférences", path: "preference" },
    { label: "Logo", path: "logo-entreprise" }
    ];
    const toolbarConfig = [
        { label: 'Tous', icon: '📋', active: true, onClick: () => { } },
        { label: 'Rechercher', icon: '🔍', onClick: () => { } },
        { label: 'Imprimer', icon: '🖨️', onClick: () => { } },
        { label: 'Assistant', icon: '❓', onClick: () => { } }
    ];
    return (
        <div className="d-flex">
            <div style={{width:"8%"}}>
                <Sidebar />
            </div>
            <div style={{width: "92%"}}>
                <Navbar />
                <div className="window">
                    <Header
                        title="Entreprise Configuration"
                        showWindowControls={true}
                    />
                    <Toolbar customButtons={toolbarConfig} />
                    <div className="entreprise-container">
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
                </div>
            </div>
        </div>
        
    )
}
export default Entreprise;