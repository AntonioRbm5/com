import React, { useEffect, useState } from 'react'
import './stock.css';

const MouvementEntreeModal = ({ show, onHide, mouvement, onSave }) => {

    /* =========================
       ETATS
    ========================= */
    const [isHeaderValidated, setIsHeaderValidated] = useState(false);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0].replace(/-/g, ''),
        numeroDocument: '',
        depot: 'SIEGE',
        reference: '',
        affaire: '',
        info1: '',
        info2: ''
    });

    const [lignes, setLignes] = useState([]);

    const [ligneCourante, setLigneCourante] = useState({
        reference: '',
        designation: '',
        puHT: '',
        quantite: '',
        conditionnement: 'PIECE',
        montantHT: ''
    });

    /* =========================
       INIT / EDITION
    ========================= */
    useEffect(() => {
        if (mouvement && mouvement.header) {
            setFormData({
                date: mouvement.header.date ?? '',
                numeroDocument: mouvement.header.numeroDocument ?? '',
                depot: mouvement.header.depot ?? 'SIEGE',
                reference: mouvement.header.reference ?? '',
                affaire: mouvement.header.affaire ?? '',
                info1: mouvement.header.info1 ?? '',
                info2: mouvement.header.info2 ?? ''
            });

            setLignes(mouvement.lignes ?? []);
            setIsHeaderValidated(true);
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0].replace(/-/g, ''),
                numeroDocument: generateNumeroDocument(),
                depot: 'SIEGE',
                reference: '',
                affaire: '',
                info1: '',
                info2: ''
            });

            setLignes([]);
            setIsHeaderValidated(false);
        }
    }, [mouvement, show]);


    const generateNumeroDocument = () =>
        `ME-${Date.now().toString().slice(-6)}`;

    /* =========================
       HANDLERS
    ========================= */
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateHeader = () => {
        const required = ['date', 'numeroDocument', 'depot', 'reference', 'affaire'];
        return required.every(f => formData[f]?.toString().trim());
    };

    const handleValidateHeader = () => {
        if (!validateHeader()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        setIsHeaderValidated(true);
    };

    /* =========================
       LIGNES
    ========================= */
    const handleLigneChange = e => {
        const { name, value } = e.target;

        setLigneCourante(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'puHT' || name === 'quantite') {
                const pu = parseFloat(updated.puHT) || 0;
                const qte = parseFloat(updated.quantite) || 0;
                updated.montantHT = (pu * qte).toFixed(2);
            }

            return updated;
        });
    };

    const ajouterLigne = () => {
        if (!isHeaderValidated) return;

        if (!ligneCourante.reference || !ligneCourante.quantite) {
            alert('Référence et quantité obligatoires');
            return;
        }

        setLignes(prev => [
            ...prev,
            { ...ligneCourante, id: Date.now() }
        ]);

        setLigneCourante({
            reference: '',
            designation: '',
            puHT: '',
            quantite: '',
            conditionnement: 'PIECE',
            montantHT: ''
        });
    };

    const supprimerLigne = id =>
        setLignes(prev => prev.filter(l => l.id !== id));

    /* =========================
       TOTAUX
    ========================= */
    const calculerTotaux = () => ({
        poidsNet: lignes.reduce((s, l) => s + (+l.quantite || 0), 0),
        poidsBrut: 0,
        totalHT: lignes.reduce((s, l) => s + (+l.montantHT || 0), 0)
    });

    /* =========================
       SUBMIT GLOBAL (API READY)
    ========================= */
    const handleSubmit = () => {
        if (!isHeaderValidated) {
            alert('Veuillez valider l’en-tête');
            return;
        }

        if (lignes.length === 0) {
            alert('Veuillez ajouter au moins une ligne');
            return;
        }

        const payload = {
            header: formData,
            lignes,
            totaux: calculerTotaux()
        };

        onSave(payload); // API READY
        onHide();
    };

    if (!show) return null;

    const totaux = calculerTotaux();

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="mouvement-modal-overlay">
            <div className="mouvement-modal-container">

                {/* HEADER */}
                <div className="mouvement-modal-header">
                    <span className="mouvement-modal-title">
                        Mouvement d'entrée N° {formData?.numeroDocument ?? ''}
                    </span>
                    <button className="close-btn" onClick={onHide}>×</button>
                </div>

                <div className="mouvement-toolbar">
                    <button className="mouvement-toolbar-btn">⚙ Fonctions</button>
                    <button className="mouvement-toolbar-btn">📄 Infos libres</button>
                    <button className="mouvement-toolbar-btn">🖨 Simuler</button>
                    <button className="mouvement-toolbar-btn">🖨 Imprimer</button>
                    <button className="mouvement-toolbar-btn">🔄 Transformer</button>
                    <button className="mouvement-toolbar-btn">📋 Projet</button>
                </div>

                {/* FORM HEADER */}
                <div className="mouvement-form-header">

                    {/* DATE / DEPOT */}
                    <div className="mouvement-form-row">
                        <div className="mouvement-form-group">
                            <label>Date</label>
                            <input
                                type="text"
                                name="date"
                                className="date-input"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                            <button className="mouvement-toolbar-btn" style={{ padding: '2px 6px' }}>📅</button>
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Dépôt</label>
                            <select name="depot" value={formData.depot} onChange={handleInputChange} className="large-select" style={{ width: '100%' }}>
                                <option>SIEGE</option>
                                <option>DEPOT 1</option>
                                <option>DEPOT 2</option>
                            </select>
                        </div>
                    </div>

                    {/* DOC / REF / AFFAIRE */}
                    <div className="mouvement-form-row">
                        <div className="mouvement-form-group">
                            <label>N° document</label>
                            <input
                                name="numeroDocument"
                                className="doc-number"
                                value={formData.numeroDocument}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mouvement-form-group">
                            <label>Référence</label>
                            <input type="text" name="reference" value={formData.reference} onChange={handleInputChange} style={{ width: '200px' }} />
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Affaire</label>
                            <input name="affaire" value={formData.affaire} onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* INFOS */}
                    <div className="mouvement-form-row">
                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Info1</label>
                            <input type="text" name="info1" placeholder="Info 1" value={formData.info1} onChange={handleInputChange} style={{ width: '100%' }} />
                        </div>
                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Info2</label>
                            <input type="text" name="info2" placeholder="Info 2" value={formData.info2} onChange={handleInputChange} style={{ width: '100%' }} />
                        </div>

                        <button
                            className="btn-custom btn-primary-custom"
                            style={{ marginLeft: 'auto' }}
                            onClick={handleValidateHeader}
                        >
                            Valider
                        </button>
                    </div>
                </div>

                {/* LINE EDITOR */}
                <div
                    className="mouvement-line-editor"
                    style={{
                        opacity: isHeaderValidated ? 1 : 0.4,
                        pointerEvents: isHeaderValidated ? 'auto' : 'none'
                    }}
                >
                    <div className="mouvement-line-input-row">
                        <input type="text" name="reference" placeholder="Référence" value={ligneCourante.reference} onChange={handleLigneChange} className="mouvement-line-input" />
                        <input name="designation" placeholder="Désignation" className="mouvement-line-input" value={ligneCourante.designation} onChange={handleLigneChange} />
                        <input type="number" className="mouvement-line-input" name="puHT" placeholder="P.U. HT" value={ligneCourante.puHT} onChange={handleLigneChange} />
                        <input type="number" name="quantite" className="mouvement-line-input" placeholder="Qté" value={ligneCourante.quantite} onChange={handleLigneChange} />
                        <select
                            name="conditionnement"
                            className="mouvement-line-input"
                            value={ligneCourante.conditionnement}
                            onChange={handleLigneChange}
                        >
                            <option>PIECE</option>
                            <option>METRE</option>
                            <option>KG</option>
                        </select>
                        <input
                            type="text"
                            name="montantHT"
                            className="mouvement-line-input"
                            placeholder="Montant HT"
                            value={ligneCourante.montantHT}
                            readOnly
                            style={{ backgroundColor: '#f0f0f0' }}
                        />
                        <span>▶</span>
                    </div>

                    <div className="mouvement-action-buttons">
                        <button className="mouvement-action-btn primary" onClick={ajouterLigne}>
                            Nouveau
                        </button>
                        <button className="mouvement-action-btn secondary">Supprimer</button>
                        <button className="mouvement-action-btn primary" onClick={ajouterLigne}>
                            Enregistrer
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="mouvement-lines-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Référence a...</th>
                                <th>Désignation</th>
                                <th>P.U. HT</th>
                                <th>Quantité</th>
                                <th>Conditionn...</th>
                                <th>Montant HT</th>
                                <th>▶</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lignes.map(l => (
                                <tr key={l.id} onDoubleClick={() => supprimerLigne(l.id)} colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                    <td>{l.reference}</td>
                                    <td>{l.designation}</td>
                                    <td>{l.puHT}</td>
                                    <td>{l.quantite}</td>
                                    <td>{l.conditionnement}</td>
                                    <td>{l.montantHT}</td>
                                    <td>▲</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="mouvement-footer-summary">
                    <div className="mouvement-summary-row">
                        <div className="mouvement-summary-col">
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Poids net</span>
                                <span className="mouvement-summary-value">{totaux.poidsNet.toFixed(2)}</span>
                            </div>
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Poids brut</span>
                                <span className="mouvement-summary-value">{totaux.poidsBrut.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mouvement-summary-col">
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Total HT</span>
                                <span className="mouvement-summary-value">
                                    {totaux.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mouvement-modal-footer">
                    <button className="btn-custom btn-secondary-custom">Nouveau</button>
                    <button className="btn-custom btn-primary-custom" onClick={handleSubmit}>
                        OK
                    </button>
                    <button className="btn-custom btn-secondary-custom" onClick={onHide}>
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MouvementEntreeModal;
