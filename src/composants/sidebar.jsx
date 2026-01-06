import {
  FaFolderOpen,
  FaEdit,
  FaSitemap,
  FaCogs,
  FaChartBar,
  FaWindowMaximize,
} from "react-icons/fa";


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">APP</span>
      </div>

      <ul className="sidebar-menu">
        <li className="active">
          <FaFolderOpen />
          <span className="label">Fichier</span>
        </li>

        <li>
          <FaEdit />
          <span className="label">Édition</span>
        </li>

        <li>
          <FaSitemap />
          <span className="label">Structure</span>
        </li>

        <li>
          <FaCogs />
          <span className="label">Traitement</span>
        </li>

        <li>
          <FaChartBar />
          <span className="label">État</span>
        </li>

        <li>
          <FaWindowMaximize />
          <span className="label">Fenêtre</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
