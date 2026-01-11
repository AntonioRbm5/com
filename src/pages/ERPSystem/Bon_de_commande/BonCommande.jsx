import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListBonCommande from './ListBonCommande';
import FormBonCommande from './FormBonCommande';
import { useState } from 'react';
import BonCommandeValidation from './BonCommandeValidation';
const BonCommande = ({ onClose }) => {
    const [isValidated, setIsValidated] = useState(false);
    const [headerRef, setHeaderRef] = useState('');

    const handleValidation = () => {
        setIsValidated(true);
    };
    return (
        <div>
            <div className="invoice-wrapper">
                <DocumentHeader
                    title="Bon de commande: A préparer N° BC00001"
                    onClose={onClose}
                />
                <DocumentToolbar />
                <div className="invoice-body">
                    <FormBonCommande
                        onValidate={handleValidation}
                        isReadOnly={isValidated}
                        headerRef={headerRef}
                        setHeaderRef={setHeaderRef}
                    />
                    {isValidated && (
                        <BonCommandeValidation initialRef={headerRef} />
                    )}
                    <ListBonCommande />
                    <DocumentFooter />
                </div>
            </div>
        </div>
    );
};

export default BonCommande;