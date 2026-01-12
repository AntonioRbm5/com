// SidebarErp.jsx

import './Layout.css';

const Sidebar = ({ items = [], activeItem, onItemClick }) => {
    return (
        <div className="sidebar-erp">
            {items.map((item, index) => (
                <div
                    key={item.id || index}
                    className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                    onClick={() => onItemClick(item.id)}
                >
                    {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;