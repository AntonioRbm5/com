import DocumentHeader from '../form/DocumentHeader';
import DocumentToolbar from '../form/DocumentToolbar';
import DocumentFooter from '../form/DocumentFooter';
import "../form/DocumentForm.css";
import ListBonCommande from './ListBonCommande';
import FormBonCommande from './FormBonCommande';
const BonCommande = ({ onClose }) => {
    return (
        <div>
            <div className="invoice-wrapper">
                <DocumentHeader
                    title="Bon de commande: A préparer N° BC00001"
                    onClose={onClose}
                />
                <DocumentToolbar />
                <div className="invoice-body">
                    <FormBonCommande />
                    <ListBonCommande />
                    <DocumentFooter />
                </div>
            </div>
        </div>
    );
};

export default BonCommande;