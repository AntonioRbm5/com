// import React, { useState, useEffect } from 'react';
// import { createStockMouvement, getStockState } from '../../../services/stockService';
// import MouvementEntreeModal from '../../stock/MouvementEntreeModal';
// import { getAllStockMouvement } from '../../../services/stockService';

// const InventoryView = () => {
//     const [depots, setDepots] = useState([]);
//     const [selectedDepot, setSelectedDepot] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [mouvements, setMouvements] = useState([]);
//     const [filterArticleId, setFilterArticleId] = useState('');
//     const [filterType, setFilterType] = useState('');
//     const [filterDate, setFilterDate] = useState('');

//     const [showMouvementModal, setShowMouvementModal] = useState(false);
//     const [currentMouvement, setCurrentMouvement] = useState(null);

//     // useEffect(() => {
//     //     fetchStockState();
//     // }, []);
//     useEffect(() => {
//         fetchStockState();
//         fetchStockMouvements();
//     }, []);


//     const fetchStockState = async () => {
//         try {
//             setLoading(true);
//             const response = await getStockState();

//             if (response?.data?.status === 'success') {
//                 const normalized = (response.data.data.depots || []).map(d => ({
//                     id: d.depot_id,
//                     name: d.depot_name,
//                     code: d.depot_code,
//                     responsable: d.responsable,
//                     lieu: d.lieu,
//                     articles: d.articles || []
//                 }));

//                 setDepots(normalized);
//                 setSelectedDepot(normalized[0] || null);
//             }
//         } catch (e) {
//             console.error(e);
//             setError("Erreur chargement inventaire");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNewDocument = () => {
//         setCurrentMouvement(null);
//         setShowMouvementModal(true);
//     };

//     const handleSaveMouvement = async (payload) => {
//         try {
//             const res = await createStockMouvement(payload);

//             if (res?.data?.status !== 'success') {
//                 throw new Error('Échec API');
//             }

//             setShowMouvementModal(false);
//             fetchStockState();

//         } catch (e) {
//             console.error(e);
//             alert("Erreur lors de l'enregistrement");
//         }
//     };

//     const fetchStockMouvements = async () => {
//         try {
//             const res = await getAllStockMouvement();
//             if (res?.data?.status === 'success') {
//                 setMouvements(res.data.data || []);
//             }
//         } catch (e) {
//             console.error(e);
//         }
//     };


//     if (loading) return <div>Chargement…</div>;
//     if (error) return <div style={{ color: 'red' }}>{error}</div>;
//     const filteredMouvements = mouvements.filter(m => {
//         if (filterArticleId && m.article_id !== Number(filterArticleId)) {
//             return false;
//         }

//         if (filterType && m.mouvement_type !== filterType) {
//             return false;
//         }
//         if (filterDate) {
//             const d = new Date(m.mouvement_date).toISOString().slice(0, 10);
//             if (d !== filterDate) return false;
//         }


//         return true;
//     });

//     return (
//         <>
//             <button className="btn-primary" onClick={handleNewDocument}>
//                 Nouveau
//             </button>
//             <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
//                 {/* Filtre Article */}
//                 <input
//                     type="number"
//                     placeholder="Article ID"
//                     value={filterArticleId}
//                     onChange={(e) => setFilterArticleId(e.target.value)}
//                     className="form-control"
//                     style={{ maxWidth: '150px' }}
//                 />

//                 {/* Filtre Type */}
//                 <select
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                     className="form-control"
//                     style={{ maxWidth: '200px' }}
//                 >
//                     <option value="">Tous les types</option>
//                     <option value="Mouvement d'entrée">Mouvement d'entrée</option>
//                     <option value="TRANSFERT">Transfert</option>
//                     <option value="mouvement_valeur">Valeur</option>
//                 </select>

//                 <input
//                     type="date"
//                     value={filterDate}
//                     onChange={(e) => setFilterDate(e.target.value)}
//                     className="form-control"
//                 />
//             </div>

//             {filteredMouvements.length > 0 && (


//                 <table className="document-table" style={{ marginTop: '20px' }}>
//                     <thead>
//                         <tr>
//                             <th>Référence</th>
//                             <th>Article</th>
//                             <th>Type</th>
//                             <th>Quantité</th>
//                             <th>Date</th>
//                         </tr>
//                     </thead>


//                     <tbody>
//                         {mouvements.map(m => (
//                             <tr key={m.mouvement_id}>
//                                 <td>{m.mouvement_reference || '-'}</td>
//                                 <td>Article #{m.article_id}</td>
//                                 <td>{m.mouvement_type}</td>
//                                 <td>{m.mouvement_quantity}</td>
//                                 <td>
//                                     {new Date(m.mouvement_date).toLocaleDateString('fr-FR')}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>

//                 </table>

//             )}

//             <MouvementEntreeModal
//                 show={showMouvementModal}
//                 mouvement={currentMouvement}
//                 onHide={() => setShowMouvementModal(false)}
//                 onSave={handleSaveMouvement}
//                 depots={depots}
//             />
//         </>
//     );
// };

// export default InventoryView;


import React, { useState, useEffect } from 'react';
import {
    createStockMouvement,
    getStockState,
    getAllStockMouvement
} from '../../../services/stockService';
import MouvementEntreeModal from '../../stock/MouvementEntreeModal';

const InventoryView = () => {
    const [depots, setDepots] = useState([]);
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mouvements, setMouvements] = useState([]);

    // Filtres
    const [filterArticleId, setFilterArticleId] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const [showMouvementModal, setShowMouvementModal] = useState(false);
    const [currentMouvement, setCurrentMouvement] = useState(null);

    useEffect(() => {
        fetchStockState();
        fetchStockMouvements();
    }, []);

    // ========================
    // FETCH INVENTAIRE
    // ========================
    const fetchStockState = async () => {
        try {
            setLoading(true);
            const response = await getStockState();

            if (response?.data?.status === 'success') {
                const normalized = (response.data.data.depots || []).map(d => ({
                    id: d.depot_id,
                    name: d.depot_name,
                    code: d.depot_code,
                    responsable: d.responsable,
                    lieu: d.lieu,
                    articles: d.articles || []
                }));

                setDepots(normalized);
                setSelectedDepot(normalized[0] || null);
            }
        } catch (e) {
            console.error(e);
            setError("Erreur chargement inventaire");
        } finally {
            setLoading(false);
        }
    };

    // ========================
    // FETCH MOUVEMENTS
    // ========================
    const fetchStockMouvements = async () => {
        try {
            const res = await getAllStockMouvement();
            if (res?.data?.status === 'success') {
                setMouvements(res.data.data || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // ========================
    // SAVE MOUVEMENT
    // ========================
    const handleSaveMouvement = async (payload) => {
        try {
            const res = await createStockMouvement(payload);
            if (res?.data?.status !== 'success') {
                throw new Error('Échec API');
            }

            setShowMouvementModal(false);
            fetchStockMouvements();
            fetchStockState();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'enregistrement");
        }
    };

    // ========================
    // FILTRES
    // ========================
    const filteredMouvements = mouvements.filter(m => {
        if (filterArticleId && m.article_id !== Number(filterArticleId)) {
            return false;
        }

        if (filterType && m.mouvement_type !== filterType) {
            return false;
        }

        if (filterDate) {
            const d = new Date(m.mouvement_date).toISOString().slice(0, 10);
            if (d !== filterDate) return false;
        }

        return true;
    });

    // Types dynamiques depuis les données
    const mouvementTypes = [
        ...new Set(mouvements.map(m => m.mouvement_type).filter(Boolean))
    ];

    if (loading) return <div>Chargement…</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <>
            <button className="btn-primary" onClick={() => setShowMouvementModal(true)}>
                Nouveau
            </button>

            {/* ========================
                FILTRES
            ======================== */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <input
                    type="number"
                    placeholder="Article ID"
                    value={filterArticleId}
                    onChange={(e) => setFilterArticleId(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: '150px' }}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: '220px' }}
                >
                    <option value="">Tous les types</option>
                    {mouvementTypes.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="form-control"
                />
            </div>

            {/* ========================
                TABLE
            ======================== */}
            <table className="document-table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Référence</th>
                        <th>Article</th>
                        <th>Type</th>
                        <th>Quantité</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredMouvements.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                Aucun mouvement trouvé
                            </td>
                        </tr>
                    ) : (
                        filteredMouvements.map(m => (
                            <tr key={m.mouvement_id}>
                                <td>{m.mouvement_reference || '-'}</td>
                                <td>Article #{m.article_id}</td>
                                <td>{m.mouvement_type}</td>
                                <td>{m.mouvement_quantity}</td>
                                <td>
                                    {new Date(m.mouvement_date).toLocaleDateString('fr-FR')}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <MouvementEntreeModal
                show={showMouvementModal}
                mouvement={currentMouvement}
                onHide={() => setShowMouvementModal(false)}
                onSave={handleSaveMouvement}
                depots={depots}
            />
        </>
    );
};

export default InventoryView;
