import React from 'react';
import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListFactureComptablisée from './ListFactureComptablisée';
import FormFactureComptabilise from './FormFactureComptabilise';
const InvoiceForm = ({ onClose }) => {
    return (
        <div>
            <div className="invoice-wrapper">
                {/* Header */}
                <DocumentHeader
                    title="Facture : A comptabiliser N° 2"
                    onClose={onClose}
                />

                {/* Toolbar */}
                <DocumentToolbar />

                {/* Form content */}
                <div className="invoice-body">
                    <FormFactureComptabilise />
                    <ListFactureComptablisée />
                    <DocumentFooter />
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;