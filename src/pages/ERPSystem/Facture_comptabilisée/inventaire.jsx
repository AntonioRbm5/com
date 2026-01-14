import React, { useState, useEffect } from 'react';
import { createStockMouvement, getStockState } from '../../../services/stockService';
import MouvementEntreeModal from '../../stock/MouvementEntreeModal';
import { getAllStockMouvement } from '../../../services/stockService';

const InventoryView = () => {
    const [depots, setDepots] = useState([]);
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mouvements, setMouvements] = useState([]);

    const [showMouvementModal, setShowMouvementModal] = useState(false);
    const [currentMouvement, setCurrentMouvement] = useState(null);

    // useEffect(() => {
    //     fetchStockState();
    // }, []);
    useEffect(() => {
        fetchStockState();
        fetchStockMouvements();
    }, []);


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

    const handleNewDocument = () => {
        setCurrentMouvement(null);
        setShowMouvementModal(true);
    };

    const handleSaveMouvement = async (payload) => {
        try {
            const res = await createStockMouvement(payload);

            if (res?.data?.status !== 'success') {
                throw new Error('Échec API');
            }

            setShowMouvementModal(false);
            fetchStockState();

        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'enregistrement");
        }
    };

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


    if (loading) return <div>Chargement…</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <>
            <button className="btn-primary" onClick={handleNewDocument}>
                Nouveau
            </button>

            {mouvements.length > 0 && (
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
                        {mouvements.map(m => (
                            <tr key={m.id}>
                                <td>{m.mouvement_reference}</td>
                                <td>{m.article_name}</td>
                                <td>{m.type_mouvement}</td>
                                <td>{m.quantity}</td>
                                <td>{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

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
