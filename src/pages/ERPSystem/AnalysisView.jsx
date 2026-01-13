
import React, { useState, useEffect } from 'react';
import { getAllStockMouvement } from '../../services/stockService';


const AnalysisView = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: '2022-01-01',
        end: '2022-12-31'
    });
    const [totals, setTotals] = useState({
        nbDoc: 0,
        caHT: 0,
        marge: 0,
        margePct: 0
    });

    useEffect(() => {
        fetchAnalysisData();
    }, [dateRange]);

    const fetchAnalysisData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAllStockMouvement();

            if (response.data.status === 'success') {
                const mouvements = response.data.data;

                // Filtrer par date
                const filtered = mouvements.filter(m => {
                    const date = new Date(m.mouvement_date);
                    return date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
                });

                // Grouper par article/client et calculer
                const grouped = {};
                filtered.forEach(m => {
                    const key = m.article_id;
                    if (!grouped[key]) {
                        grouped[key] = {
                            clientNo: `CLT${m.article_id}`,
                            clientName: `Article ${m.article_id}`,
                            nbDoc: 0,
                            caHT: 0,
                            marge: 0
                        };
                    }
                    grouped[key].nbDoc++;
                    grouped[key].caHT += parseFloat(m.mouvement_valeur || 0);
                    // Simuler une marge de 17%
                    grouped[key].marge = grouped[key].caHT * 0.17;
                });

                const analysisData = Object.values(grouped).map(item => ({
                    ...item,
                    margePct: item.caHT > 0 ? ((item.marge / item.caHT) * 100).toFixed(2) : '0.00'
                }));

                setData(analysisData);

                // Calculer les totaux
                const totalNbDoc = analysisData.reduce((sum, item) => sum + item.nbDoc, 0);
                const totalCA = analysisData.reduce((sum, item) => sum + item.caHT, 0);
                const totalMarge = analysisData.reduce((sum, item) => sum + item.marge, 0);
                const totalMargePct = totalCA > 0 ? ((totalMarge / totalCA) * 100).toFixed(2) : '0.00';

                setTotals({
                    nbDoc: totalNbDoc,
                    caHT: totalCA,
                    marge: totalMarge,
                    margePct: totalMargePct
                });
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Impossible de charger l\'analyse');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }}>
                Chargement de l'analyse...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                {error}
                <br />
                <button className="btn-primary" onClick={fetchAnalysisData} style={{ marginTop: '12px' }}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '16px', background: 'white', flex: 1 }}>
            {/* Filtres de date */}
            <div style={{
                marginBottom: '20px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '4px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
            }}>
                <div>
                    <label style={{ fontSize: '11px', marginRight: '8px' }}>Du:</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        style={{ display: 'inline-block', width: 'auto' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '11px', marginRight: '8px' }}>Au:</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        style={{ display: 'inline-block', width: 'auto' }}
                    />
                </div>
                <button
                    className="btn-primary btn-sm"
                    onClick={fetchAnalysisData}
                >
                    🔄 Actualiser
                </button>
                <button
                    className="btn-secondary btn-sm"
                    onClick={() => window.print()}
                >
                    🖨️ Imprimer
                </button>
            </div>

            <div className="document-preview">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Analyse rentabilité clients
                    </h2>
                    <div style={{ fontSize: '10px', marginTop: '8px' }}>
                        <strong>Période du</strong> {new Date(dateRange.start).toLocaleDateString('fr-FR')}
                        <br />
                        <strong>au</strong> {new Date(dateRange.end).toLocaleDateString('fr-FR')}
                        <br />
                        <strong>Tenue de compte :</strong> FCFA
                    </div>
                </div>

                <table className="preview-table">
                    <thead>
                        <tr>
                            <th>Numéro de client</th>
                            <th>Intitulé du client</th>
                            <th style={{ textAlign: 'center' }}>Nb doc.</th>
                            <th style={{ textAlign: 'right' }}>CA HT net</th>
                            <th style={{ textAlign: 'right' }}>Marge</th>
                            <th style={{ textAlign: 'right' }}>% marge sur CA net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#999'
                                }}>
                                    Aucune donnée disponible pour cette période
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.clientNo}</td>
                                    <td>{item.clientName}</td>
                                    <td style={{ textAlign: 'center' }}>{item.nbDoc}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {formatCurrency(item.caHT)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {formatCurrency(item.marge)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {item.margePct}%
                                    </td>
                                </tr>
                            ))
                        )}
                        <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                            <td colSpan="2">Total général</td>
                            <td style={{ textAlign: 'center' }}>{totals.nbDoc}</td>
                            <td style={{ textAlign: 'right' }}>
                                {formatCurrency(totals.caHT)}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {formatCurrency(totals.marge)}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {totals.margePct}%
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="preview-footer">
                    <p>© Sage - Sage 100 Gestion commerciale Premium 8.00</p>
                    <p>Date de tirage {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')} - Page : 1</p>
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;