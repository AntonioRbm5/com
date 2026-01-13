import React, { useEffect, useState } from 'react';
import { getAllArticles } from '../../services/articleService';
import './stock.css';

const MouvementEntreeModal = ({ show, onHide, mouvement, onSave, depots = [] }) => {

    /* =========================
       ETATS
    ========================= */
    const [isHeaderValidated, setIsHeaderValidated] = useState(false);
    const [articles, setArticles] = useState([]);

    const [formData, setFormData] = useState({
        date: getCurrentDateFormatted(),
        numeroDocument: '',
        depot: '',
        depotId: null,
        articleId: null,
        reference: '',
        affaire: '',
        info1: '',
        info2: '',
        uniteId: 1,
        lotId: null
    });

    // Fonction helper pour obtenir la date au format DDMMYY
    function getCurrentDateFormatted() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear()).substring(2);
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
       CHARGEMENT DES ARTICLES
    ========================= */
    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const response = await getAllArticles();
            if (response?.data?.status === 'success') {
                setArticles(response.data.data || []);

                // Sélectionner le premier article par défaut si disponible
                if (response.data.data && response.data.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        articleId: response.data.data[0].article_id
                    }));
                }
            }
        } catch (err) {
            console.error('Erreur chargement articles:', err);
        }
    };

    /* =========================
       INIT / EDITION
    ========================= */
    useEffect(() => {
        if (show) {
            if (mouvement) {
                // Mode édition
                setFormData({
                    date: mouvement.header?.date || mouvement.date,
                    numeroDocument: mouvement.header?.numeroDocument || mouvement.numeroPiece,
                    depot: mouvement.header?.depot || mouvement.depotOrigine,
                    depotId: mouvement.header?.depotId || null,
                    articleId: mouvement.header?.articleId || null,
                    reference: mouvement.header?.reference || mouvement.reference,
                    affaire: mouvement.header?.affaire || '',
                    info1: mouvement.header?.info1 || '',
                    info2: mouvement.header?.info2 || '',
                    uniteId: mouvement.header?.uniteId || 1,
                    lotId: mouvement.header?.lotId || null
                });

                setLignes(mouvement.lignes || []);
                setIsHeaderValidated(true);
            } else {
                // Mode création
                const defaultDepot = depots.length > 0 ? depots[0] : null;
                const defaultArticle = articles.length > 0 ? articles[0] : null;

                setFormData({
                    date: getCurrentDateFormatted(),
                    numeroDocument: generateNumeroDocument(),
                    depot: defaultDepot?.name || '',
                    depotId: defaultDepot?.id || null,
                    articleId: defaultArticle?.article_id || null,
                    reference: '',
                    affaire: '',
                    info1: '',
                    info2: '',
                    uniteId: 1,
                    lotId: null
                });

                setLignes([]);
                setIsHeaderValidated(false);
            }
        }
    }, [mouvement, show, depots, articles]);

    const generateNumeroDocument = () =>
        `ME-${Date.now().toString().slice(-6)}`;

    /* =========================
       HANDLERS
    ========================= */
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDepotChange = e => {
        const selectedDepotName = e.target.value;
        const selectedDepot = depots.find(d => d.name === selectedDepotName);

        setFormData(prev => ({
            ...prev,
            depot: selectedDepotName,
            depotId: selectedDepot?.id || null
        }));
    };

    const handleArticleChange = e => {
        const articleId = parseInt(e.target.value);
        setFormData(prev => ({
            ...prev,
            articleId: articleId
        }));
    };

    const validateHeader = () => {
        const required = ['date', 'numeroDocument', 'depot', 'reference'];
        const isValid = required.every(f => formData[f]?.toString().trim());

        if (!isValid) {
            console.log('❌ Validation échouée - Champs manquants');
            return false;
        }

        if (!formData.depotId) {
            console.log('❌ Validation échouée - Dépôt non sélectionné');
            return false;
        }

        if (!formData.articleId) {
            console.log('❌ Validation échouée - Article non sélectionné');
            return false;
        }

        return true;
    };

    const handleValidateHeader = () => {
        if (!validateHeader()) {
            alert('Veuillez remplir tous les champs obligatoires et sélectionner un article');
            return;
        }

        console.log('✅ En-tête validé avec succès');
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
            alert('Veuillez valider l\'en-tête');
            return;
        }

        if (!formData.depotId) {
            alert('Erreur: Dépôt non valide');
            return;
        }

        if (!formData.articleId) {
            alert('Erreur: Article non sélectionné');
            return;
        }

        const totaux = calculerTotaux();

        const payload = {
            header: {
                ...formData,
                type: 'Mouvement d\'entrée'
            },
            lignes: lignes.map(ligne => ({
                ...ligne,
                id: undefined
            })),
            totaux: totaux
        };

        console.log('📤 Payload à envoyer:', payload);
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
                                placeholder="JJMMAA"
                            />
                            <button className="mouvement-toolbar-btn" style={{ padding: '2px 6px' }}>📅</button>
                        </div>

                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Dépôt *</label>
                            <select
                                name="depot"
                                value={formData.depot}
                                onChange={handleDepotChange}
                                className="large-select"
                                style={{ width: '100%' }}
                            >
                                {depots.length === 0 ? (
                                    <option value="">Aucun dépôt disponible</option>
                                ) : (
                                    depots.map(depot => (
                                        <option key={depot.id} value={depot.name}>
                                            {depot.name} ({depot.code})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {/* DOC / REF / ARTICLE */}
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
                            <label>Référence *</label>
                            <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleInputChange}
                                style={{ width: '200px' }}
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
                                {articles.length === 0 ? (
                                    <option value="">Aucun article disponible</option>
                                ) : (
                                    articles.map(article => (
                                        <option key={article.article_id} value={article.article_id}>
                                            {article.article_name} ({article.article_reference})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {/* INFOS */}
                    <div className="mouvement-form-row">
                        <div className="mouvement-form-group" style={{ flex: 1 }}>
                            <label>Info1</label>
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
                            <label>Info2</label>
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
                            className="mouvement-line-input"
                            name="puHT"
                            placeholder="P.U. HT"
                            value={ligneCourante.puHT}
                            onChange={handleLigneChange}
                        />
                        <input
                            type="number"
                            name="quantite"
                            className="mouvement-line-input"
                            placeholder="Qté"
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
                            {lignes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        Aucune ligne ajoutée
                                    </td>
                                </tr>
                            ) : (
                                lignes.map(l => (
                                    <tr key={l.id} onDoubleClick={() => supprimerLigne(l.id)}>
                                        <td>{l.reference}</td>
                                        <td>{l.designation}</td>
                                        <td>{l.puHT}</td>
                                        <td>{l.quantite}</td>
                                        <td>{l.conditionnement}</td>
                                        <td>{l.montantHT}</td>
                                        <td>▲</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="mouvement-footer-summary">
                    <div className="mouvement-summary-row">
                        <div className="mouvement-summary-col">
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Quantité totale</span>
                                <span className="mouvement-summary-value">{totaux.poidsNet.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mouvement-summary-col">
                            <div className="mouvement-summary-item">
                                <span className="mouvement-summary-label">Valeur totale</span>
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