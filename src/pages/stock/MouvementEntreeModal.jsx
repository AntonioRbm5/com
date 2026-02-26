import React, { useEffect, useState } from 'react';
import { getAllArticles } from '../../services/articleService';
import './stock.css';

const MouvementEntreeModal = ({ show, onHide, mouvement, onSave, depots = [] }) => {

    /* =========================
       ETATS
    ========================= */
    const [isHeaderValidated, setIsHeaderValidated] = useState(false);
    const [articles, setArticles] = useState([]);
    const [unites, setUnites] = useState([]);

    const [formData, setFormData] = useState({
        date: getCurrentDateFormatted(),
        numeroDocument: '',
        depot: '',
        depotId: null,
        articleId: null,
        uniteId: '',        // ← plus hardcodé à 1
        lotId: null,
        reference: '',
        affaire: '',
        info1: '',
        info2: ''
    });

    function getCurrentDateFormatted() {
        const today = new Date();
        const day   = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year  = String(today.getFullYear()).substring(2);
        return `${day}${month}${year}`;
    }

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
       CHARGEMENT ARTICLES + UNITÉS
    ========================= */
    useEffect(() => {
        loadArticles();
        loadUnites();
    }, []);

    const loadArticles = async () => {
        try {
            const response = await getAllArticles();
            if (response?.data?.status === 'success') {
                const data = response.data.data || [];
                setArticles(data);
            }
        } catch (err) {
            console.error('Erreur chargement articles:', err);
        }
    };

    const loadUnites = async () => {
        try {
            // Adapter l'import si votre service s'appelle différemment
            const { getAllUnites } = await import('../../services/uniteService');
            const response = await getAllUnites();
            if (response?.data?.status === 'success') {
                const data = response.data.data || [];
                setUnites(data);
                // Sélectionner la première unité par défaut
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, uniteId: data[0].unite_id }));
                }
            }
        } catch (err) {
            // Si le service n'existe pas encore, on garde l'unité 1 comme fallback
            console.warn('Service unités non disponible, fallback unite_id=1');
            setFormData(prev => ({ ...prev, uniteId: 1 }));
        }
    };

    /* =========================
       INIT / EDITION
    ========================= */
    useEffect(() => {
        if (!show) return;

        if (mouvement) {
            // Mode édition
            setFormData({
                date:           mouvement.header?.date            || mouvement.date,
                numeroDocument: mouvement.header?.numeroDocument  || mouvement.numeroPiece || '',
                depot:          mouvement.header?.depot           || mouvement.depotOrigine || '',
                depotId:        mouvement.header?.depotId         || null,
                articleId:      mouvement.header?.articleId       || null,
                uniteId:        mouvement.header?.uniteId         || 1,
                lotId:          mouvement.header?.lotId           || null,
                reference:      mouvement.header?.reference       || mouvement.reference || '',
                affaire:        mouvement.header?.affaire         || '',
                info1:          mouvement.header?.info1           || '',
                info2:          mouvement.header?.info2           || ''
            });
            setLignes(mouvement.lignes || []);
            setIsHeaderValidated(true);
        } else {
            // Mode création
            const defaultDepot   = depots.length   > 0 ? depots[0]   : null;
            const defaultArticle = articles.length > 0 ? articles[0] : null;

            setFormData(prev => ({
                ...prev,
                date:           getCurrentDateFormatted(),
                numeroDocument: generateNumeroDocument(),
                depot:          defaultDepot?.name        || '',
                depotId:        defaultDepot?.id          || null,
                articleId:      defaultArticle?.article_id || null
            }));

            setLignes([]);
            setIsHeaderValidated(false);
        }
    }, [mouvement, show, depots, articles]);

    const generateNumeroDocument = () =>
        `ME-${Date.now().toString().slice(-6)}`;

    /* =========================
       HELPERS — FORMATAGE DATE
    ========================= */
    /**
     * Convertit DDMMYY → ISO string pour l'API
     * ex: "260225" → "2025-02-26T00:00:00.000Z"
     */
    const convertDateToISO = (ddmmyy) => {
        if (!ddmmyy || ddmmyy.length !== 6) return new Date().toISOString();
        const day   = ddmmyy.substring(0, 2);
        const month = ddmmyy.substring(2, 4);
        const year  = '20' + ddmmyy.substring(4, 6);
        const date  = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    };

    /* =========================
       HANDLERS FORM
    ========================= */
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDepotChange = e => {
        const selectedDepotName = e.target.value;
        const selectedDepot     = depots.find(d => d.name === selectedDepotName);
        setFormData(prev => ({
            ...prev,
            depot:   selectedDepotName,
            depotId: selectedDepot?.id || null
        }));
    };

    const handleArticleChange = e => {
        setFormData(prev => ({
            ...prev,
            articleId: parseInt(e.target.value) || null
        }));
    };

    const handleUniteChange = e => {
        setFormData(prev => ({
            ...prev,
            uniteId: parseInt(e.target.value) || null
        }));
    };

    /* =========================
       VALIDATION EN-TÊTE
    ========================= */
    const validateHeader = () => {
        if (!formData.date || !formData.numeroDocument) {
            alert('Date et numéro de document sont obligatoires');
            return false;
        }
        if (!formData.depotId) {
            alert('Veuillez sélectionner un dépôt de destination');
            return false;
        }
        if (!formData.articleId) {
            alert('Veuillez sélectionner un article');
            return false;
        }
        if (!formData.uniteId) {
            alert('Veuillez sélectionner une unité');
            return false;
        }
        return true;
    };

    const handleValidateHeader = () => {
        if (!validateHeader()) return;
        setIsHeaderValidated(true);
    };

    /* =========================
       GESTION DES LIGNES
    ========================= */
    const handleLigneChange = e => {
        const { name, value } = e.target;
        setLigneCourante(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'puHT' || name === 'quantite') {
                const pu  = parseFloat(updated.puHT)    || 0;
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
        setLignes(prev => [...prev, { ...ligneCourante, id: Date.now() }]);
        setLigneCourante({
            reference: '', designation: '', puHT: '',
            quantite: '', conditionnement: 'PIECE', montantHT: ''
        });
    };

    const supprimerLigne = id =>
        setLignes(prev => prev.filter(l => l.id !== id));

    /* =========================
       TOTAUX
    ========================= */
    const calculerTotaux = () => ({
        poidsNet: lignes.reduce((s, l) => s + (parseFloat(l.quantite)   || 0), 0),
        totalHT:  lignes.reduce((s, l) => s + (parseFloat(l.montantHT) || 0), 0)
    });

    /* =========================
       SUBMIT — PAYLOAD ALIGNÉ SUR LE BACKEND
    ========================= */
    const handleSubmit = () => {
        if (!isHeaderValidated) {
            alert('Veuillez valider l\'en-tête');
            return;
        }
        if (!formData.depotId) {
            alert('Erreur : Dépôt de destination non valide');
            return;
        }
        if (!formData.articleId) {
            alert('Erreur : Article non sélectionné');
            return;
        }
        if (!formData.uniteId) {
            alert('Erreur : Unité non sélectionnée');
            return;
        }

        const totaux = calculerTotaux();

        /**
         * Payload strictement conforme à StockMouvementCreate (backend)
         * ─────────────────────────────────────────────────────────────
         * article_id            : int
         * lot_id                : int | null
         * depot_source_id       : int | null   ← null pour une entrée
         * depot_destination_id  : int          ← dépôt sélectionné
         * mouvement_type        : "ACHAT" | "VENTE" | "TRANSFERT" | "AJUSTEMENT"
         * unite_id              : int
         * mouvement_quantity    : float
         * mouvement_valeur      : float
         * mouvement_reference   : str | null
         *
         * NB : mouvement_date et lignes ne sont PAS dans StockMouvementCreate
         *      → on ne les envoie pas pour éviter une erreur 422
         */
        const payload = {
            article_id:           formData.articleId,
            lot_id:               formData.lotId     || null,
            depot_source_id:      null,                          // entrée = pas de source
            depot_destination_id: formData.depotId,
            mouvement_type:       "ACHAT",                       // ← type valide selon le backend
            unite_id:             formData.uniteId,
            mouvement_quantity:   totaux.poidsNet,
            mouvement_valeur:     totaux.totalHT,
            mouvement_reference:  formData.numeroDocument || null
        };

        console.log('📤 Payload envoyé à l\'API :', payload);
        onSave(payload);
    };

    if (!show) return null;

    const totaux = calculerTotaux();

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="mouvement-modal-overlay">
            <div className="mouvement-modal-container">

                {/* ── HEADER ── */}
                <div className="mouvement-modal-header">
                    <span className="mouvement-modal-title">
                        Mouvement d'entrée N° {formData.numeroDocument}
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

                {/* ── FORM HEADER ── */}
                <div className="mouvement-form-header">

                    {/* DATE / DÉPÔT DESTINATION */}
                    <div className="mouvement-form-row">
                        <div className="mouvement-form-group">
                            <label>Date</label>
                            <input
                                type="text"
                                name="date"
                                className="date-input"
                                value={formData.date}
                                onChange={handleInputChange}
                                placeholder="JJMMAA"
                            />
                            <button className="mouvement-toolbar-btn" style={{ padding: '2px 6px' }}>
                                📅
                            </button>
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Dépôt destination *</label>
                            <select
                                name="depot"
                                value={formData.depot}
                                onChange={handleDepotChange}
                                className="large-select"
                                style={{ width: '100%' }}
                            >
                                <option value="">-- Sélectionner un dépôt --</option>
                                {depots.map(depot => (
                                    <option key={depot.id} value={depot.name}>
                                        [{depot.code}] {depot.name}
                                    </option>
                                ))}
                            </select>
                            {!formData.depotId && (
                                <span style={{ fontSize: '11px', color: '#cc0000', marginLeft: '6px' }}>
                                    ⚠ Requis
                                </span>
                            )}
                        </div>
                    </div>

                    {/* N° DOC / RÉFÉRENCE / ARTICLE */}
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
                            <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleInputChange}
                                style={{ width: '180px' }}
                            />
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Article *</label>
                            <select
                                name="articleId"
                                value={formData.articleId || ''}
                                onChange={handleArticleChange}
                                style={{ width: '100%' }}
                            >
                                <option value="">-- Sélectionner un article --</option>
                                {articles.map(a => (
                                    <option key={a.article_id} value={a.article_id}>
                                        [{a.article_reference}] {a.article_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* UNITÉ / INFOS */}
                    <div className="mouvement-form-row">
                        <div className="mouvement-form-group">
                            <label>Unité *</label>
                            {unites.length > 0 ? (
                                <select
                                    name="uniteId"
                                    value={formData.uniteId || ''}
                                    onChange={handleUniteChange}
                                    style={{ minWidth: '120px' }}
                                >
                                    <option value="">-- Unité --</option>
                                    {unites.map(u => (
                                        <option key={u.unite_id} value={u.unite_id}>
                                            {u.unite_name || u.unite_libelle || `Unité #${u.unite_id}`}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                /* Fallback si le service unités n'est pas encore branché */
                                <input
                                    type="number"
                                    name="uniteId"
                                    value={formData.uniteId}
                                    onChange={handleInputChange}
                                    style={{ width: '80px' }}
                                    placeholder="ID unité"
                                    min="1"
                                />
                            )}
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Info 1</label>
                            <input
                                type="text"
                                name="info1"
                                placeholder="Info 1"
                                value={formData.info1}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Info 2</label>
                            <input
                                type="text"
                                name="info2"
                                placeholder="Info 2"
                                value={formData.info2}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <button
                            className="btn-custom btn-primary-custom"
                            style={{ marginLeft: 'auto' }}
                            onClick={handleValidateHeader}
                        >
                            Valider
                        </button>
                    </div>

                    {/* Indicateur de validation */}
                    {isHeaderValidated && (
                        <div style={{
                            fontSize: '11px', color: '#008000', marginTop: '4px',
                            paddingLeft: '4px'
                        }}>
                            ✅ En-tête validé — vous pouvez saisir les lignes
                        </div>
                    )}
                </div>

                {/* ── SAISIE LIGNE ── */}
                <div
                    className="mouvement-line-editor"
                    style={{
                        opacity:       isHeaderValidated ? 1 : 0.4,
                        pointerEvents: isHeaderValidated ? 'auto' : 'none'
                    }}
                >
                    <div className="mouvement-line-input-row">
                        <input
                            type="text"
                            name="reference"
                            placeholder="Référence"
                            value={ligneCourante.reference}
                            onChange={handleLigneChange}
                            className="mouvement-line-input"
                        />
                        <input
                            name="designation"
                            placeholder="Désignation"
                            className="mouvement-line-input"
                            value={ligneCourante.designation}
                            onChange={handleLigneChange}
                        />
                        <input
                            type="number"
                            name="puHT"
                            placeholder="P.U. HT"
                            className="mouvement-line-input"
                            value={ligneCourante.puHT}
                            onChange={handleLigneChange}
                        />
                        <input
                            type="number"
                            name="quantite"
                            placeholder="Qté"
                            className="mouvement-line-input"
                            value={ligneCourante.quantite}
                            onChange={handleLigneChange}
                        />
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
                            placeholder="Montant HT"
                            className="mouvement-line-input"
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
                        <button
                            className="mouvement-action-btn secondary"
                            onClick={() => setLigneCourante({
                                reference: '', designation: '', puHT: '',
                                quantite: '', conditionnement: 'PIECE', montantHT: ''
                            })}
                        >
                            Effacer
                        </button>
                        <button className="mouvement-action-btn primary" onClick={ajouterLigne}>
                            Enregistrer
                        </button>
                    </div>
                </div>

                {/* ── TABLE DES LIGNES ── */}
                <div className="mouvement-lines-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Désignation</th>
                                <th>P.U. HT</th>
                                <th>Quantité</th>
                                <th>Conditionnement</th>
                                <th>Montant HT</th>
                                <th>▶</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lignes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{
                                        textAlign: 'center', padding: '30px', color: '#999'
                                    }}>
                                        Aucune ligne — ajoutez des articles via le formulaire ci-dessus
                                    </td>
                                </tr>
                            ) : (
                                lignes.map(l => (
                                    <tr
                                        key={l.id}
                                        title="Double-clic pour supprimer"
                                        onDoubleClick={() => supprimerLigne(l.id)}
                                    >
                                        <td>{l.reference}</td>
                                        <td>{l.designation}</td>
                                        <td>{parseFloat(l.puHT).toLocaleString('fr-FR')}</td>
                                        <td>{l.quantite}</td>
                                        <td>{l.conditionnement}</td>
                                        <td>{parseFloat(l.montantHT).toLocaleString('fr-FR', {
                                            minimumFractionDigits: 2
                                        })}</td>
                                        <td
                                            style={{ cursor: 'pointer', color: '#cc0000' }}
                                            onClick={() => supprimerLigne(l.id)}
                                            title="Supprimer"
                                        >
                                            ✕
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── FOOTER RÉSUMÉ ── */}
                <div className="mouvement-footer-summary">
                    <div className="mouvement-summary-row">
                        <div className="mouvement-summary-col">
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Quantité totale</span>
                                <span className="mouvement-summary-value">
                                    {totaux.poidsNet.toFixed(3)}
                                </span>
                            </div>
                        </div>
                        <div className="mouvement-summary-col">
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Valeur totale HT</span>
                                <span className="mouvement-summary-value">
                                    {totaux.totalHT.toLocaleString('fr-FR', {
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Récapitulatif du payload */}
                    <div style={{ fontSize: '10px', color: '#888', marginTop: '6px' }}>
                        Dépôt destination : <strong>{formData.depot || '—'}</strong>
                        {' · '}
                        Article ID : <strong>{formData.articleId || '—'}</strong>
                        {' · '}
                        Unité ID : <strong>{formData.uniteId || '—'}</strong>
                        {' · '}
                        Type : <strong>ACHAT</strong>
                    </div>
                </div>

                {/* ── ACTIONS ── */}
                <div className="mouvement-modal-footer">
                    <button
                        className="btn-custom btn-secondary-custom"
                        onClick={() => {
                            setLignes([]);
                            setIsHeaderValidated(false);
                        }}
                    >
                        Nouveau
                    </button>
                    <button
                        className="btn-custom btn-primary-custom"
                        onClick={handleSubmit}
                        disabled={!isHeaderValidated || lignes.length === 0}
                        title={
                            !isHeaderValidated ? 'Validez l\'en-tête d\'abord' :
                            lignes.length === 0 ? 'Ajoutez au moins une ligne' : ''
                        }
                    >
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