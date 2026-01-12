
import './Layout.css';
const Header = ({ title, subtitle, showWindowControls = true, onClose, onMinimize, onMaximize }) => {
    return (
        <div className="erp-header">
            <div className="header-title">
                <span className="header-icon">⚙</span>
                <span>{title}</span>
                {subtitle && <span className="header-subtitle"> - {subtitle}</span>}
            </div>
            {showWindowControls && (
                <div className="window-controls">
                    <button className="window-btn" onClick={onMinimize}>−</button>
                    <button className="window-btn" onClick={onMaximize}>□</button>
                    <button className="window-btn close" onClick={onClose}>×</button>
                </div>
            )}
        </div>
    )
}

export default Header
