import React, { useState } from 'react'

const AddDocumentModal = ({ show, onClose, onDocumentTypeSelect }) => {
    const [selectedType, setSelectedType] = useState('demande_achat');

    if (!show) return null;

    const handleSubmit = () => {
        onDocumentTypeSelect(selectedType);
        onClose();
    };

    const documentTypes = [
        { value: 'demande_achat', label: 'Demande d\'achat' },
        { value: 'preparation_commande', label: 'Préparation de commande' },
        { value: 'commande', label: 'Bon de commande' },
        { value: 'bon_livraison', label: 'Bon de livraison' },
        { value: 'bon_retour', label: 'Bon de retour' },
        { value: 'bon_avoir_financier', label: 'Bon d\'avoir financier' },
        { value: 'facture', label: 'Facture' },
        { value: 'facture_retour', label: 'Facture de retour' },
        { value: 'facture_avoir', label: 'Facture d\'avoir' }
    ];
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '4px',
                width: '400px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                maxHeight: '90vh',
                overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f5f5f5'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                        <span style={{ color: '#0078d4' }}>⚙</span>
                        Ajouter un document
                    </div>
                    <button onClick={onClose} style={{
                        border: 'none',
                        background: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '0',
                        width: '24px',
                        height: '24px'
                    }}>×</button>
                </div>

                <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '11px', marginBottom: '12px', color: '#333' }}>
                        Quel type de document voulez-vous ajouter ?
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {documentTypes.map((type) => (
                            <label key={type.value} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 8px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                borderRadius: '2px',
                                backgroundColor: selectedType === type.value ? '#e3f2fd' : 'transparent'
                            }}>
                                <input
                                    type="radio"
                                    name="documentType"
                                    value={type.value}
                                    checked={selectedType === type.value}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    style={{ cursor: 'pointer' }}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                    backgroundColor: '#f5f5f5'
                }}>
                    <button onClick={handleSubmit} style={{
                        padding: '6px 24px',
                        backgroundColor: '#0078d4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '500'
                    }}>OK</button>
                    <button onClick={onClose} style={{
                        padding: '6px 24px',
                        backgroundColor: '#e0e0e0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}>Annuler</button>
                </div>
            </div>
        </div>
    )
}

export default AddDocumentModal
