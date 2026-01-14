import { useState } from "react";
import { FaHome, FaUsers, FaSignOutAlt, FaBars, FaBox, FaWarehouse, FaClipboardList, FaTruck, FaDollarSign, FaBuilding } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: <FaHome className="ft-2"/>, path: "/home-commercial" },
    { label: "Entreprise", icon: <FaBuilding className="ft-2"/>, path: "/entreprise"},
    { label: "Articles", icon: <FaBox className="ft-2"/>, path: "/article"},
    { label: "Stocks", icon: <FaWarehouse className="ft-2"/>, path: "/not-found"},
    { label: "Inventaires", icon: <FaClipboardList className="ft-2"/>, path: "/inventaire"},
    { label: "Clients", icon: <FaUsers className="ft-2"/>, path: "/clients" },
    { label: "Fournisseurs", icon: <FaTruck className="ft-2"/>, path: "/not-found"},
    { label: "Ventes", icon: <FaDollarSign className="ft-2"/>, path: "/not-found"},
    { label: "Logout", icon: <FaSignOutAlt className="ft-2"/>, path: "/login" }
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="d-flex">
      <aside
        className={`d-flex flex-column flex-shrink-0 p-2 text-white bg-primary position-relative transition-width ${collapsed ? 'collapsed' : ''}`}
        style={{ width: collapsed ? '65px' : '150px', minHeight: '100vh', transition: 'width 0.3s' }}
      >
        <div className={`d-flex align-items-center mb-4 justify-content-${collapsed ? 'center': 'between'}`}>
          <a
            href="/"
            className="d-flex align-items-center text-white text-decoration-none"
          >
            <span className={`fs-4 fw-bold ${collapsed ? 'd-none' : ''}`}>TanTana</span>
          </a>
          <FaBars className="cursor-pointer" onClick={toggleSidebar} />
        </div>

        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {menuItems.slice(0, -1).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label} className="nav-item">
                <a
                  href="#"
                  className={`nav-link d-flex align-items-center ${isActive ? 'bg-light text-primary' : 'text-white'}`}
                  onClick={(e) => { e.preventDefault(); handleClick(item.path); }}
                >
                  {item.icon}
                  <span className={`${collapsed ? 'd-none' : 'ms-2'}`}>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto">
          {(() => {
            const item = menuItems[2];
            const isActive = location.pathname === item.path;
            return (
              <a
                href="#"
                className={`nav-link d-flex align-items-center ${isActive ? 'bg-light text-primary' : 'text-white'}`}
                onClick={(e) => { e.preventDefault(); handleClick(item.path); }}
              >
                {item.icon}
                <span className={`${collapsed ? 'd-none' : 'ms-2'}`}>{item.label}</span>
              </a>
            );
          })()}
        </div>

      </aside>

      <style jsx>{`
        .transition-width {
          transition: width 0.3s ease;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .nav-link.active {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
