import React from 'react';

const CriteriaModal = ({ title }) => {
    return (
        <div className="sage-window sage-app" style={{ width: '400px' }}>
            <div className="sage-header">{title}</div>
            <div className="p-3 bg-light">
                <div className="mb-2 row">
                    <div className="col-4 text-end">Date du</div>
                    <div className="col-8 d-flex gap-1">
                        <input type="text" className="sage-input w-50" defaultValue="010122" />
                        <span>au</span>
                        <input type="text" className="sage-input w-50" defaultValue="311222" />
                    </div>
                </div>
                <div className="mb-2 row">
                    <div className="col-4 text-end">Client de</div>
                    <div className="col-8"><input type="text" className="sage-input w-100" /></div>
                </div>
            </div>
            <div className="p-2 border-top text-end">
                <button className="sage-btn me-2">OK</button>
                <button className="sage-btn">Annuler</button>
            </div>
        </div>
    );
};

export default CriteriaModal;