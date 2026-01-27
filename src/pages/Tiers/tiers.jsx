import { NavLink ,Outlet } from "react-router-dom";
import Navbar from "../../composants/navbar";
import Sidebar from "../../composants/sidebar";
import Header from "../Layout/Header";
import Toolbar from "../Layout/Toolbar";

const Tiers = () => {
    
    const MENU = [
        { label: "Général", path: "general" },
        { label: "Codification", path: "codification" },
        { label: "Catégorie tarifaire", path: "categorie-tarifaire" },
        { label: "Mode de reglement", path: "mode-de-reglement" },
        { label: "Périodicité de livraison", path: "periodicite-de-livraison" },
        { label: "Code risque", path: "code-risque" },
        { label: "Champ statistique", path: "champ-statistique" },
        { label: "Information libre", path: "information-libre" },
        { label: "Compte collectif", path: "compte-collectif" },
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
                                        title="Depots Stockage Configuration"
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
export default Tiers;