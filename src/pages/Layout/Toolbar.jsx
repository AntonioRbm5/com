
import './Layout.css';
const Toolbar = ({ buttons = [], customButtons = [] }) => {
     const defaultButtons = {
        fonctions: { icon: '⚙', label: 'Fonctions' },
        imprimer: { icon: '🖨', label: 'Imprimer' },
        importer: { icon: '📥', label: 'Importer' },
        exporter: { icon: '📤', label: 'Exporter' },
        enregistrer: { icon: '💾', label: 'Enregistrer' },
        rechercher: { icon: '🔍', label: 'Rechercher' },
        filtrer: { icon: '🔍', label: 'Filtrer' },
        assistant: { icon: '❓', label: 'Assistant' },
        tous: { icon: '📋', label: 'Tous' },
        nouveau: { icon: '➕', label: 'Nouveau' },
        transformer: { icon: '🔄', label: 'Transformer' },
        valider: { icon: '✓', label: 'Valider' },
        simuler: { icon: '🖨', label: 'Simuler' },
        infosLibres: { icon: '📄', label: 'Infos libres' },
        projet: { icon: '📋', label: 'Projet' }
    };
    return (
        <div className="toolbar-erp">
            {buttons.map((btnKey, index) => {
                const btn = defaultButtons[btnKey];
                if (!btn) return null;

                return (
                    <button
                        key={index}
                        className={`toolbar-btn ${btn.active ? 'active' : ''}`}
                        onClick={btn.onClick}
                    >
                        {btn.icon} {btn.label}
                    </button>
                );
            })}

            {customButtons.map((btn, index) => (
                <button
                    key={`custom-${index}`}
                    className={`toolbar-btn ${btn.active ? 'active' : ''}`}
                    onClick={btn.onClick}
                    style={btn.style}
                >
                    {btn.icon && `${btn.icon} `}{btn.label}
                </button>
            ))}
        </div>
    )
}

export default Toolbar
