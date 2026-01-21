import LoginForm from "../pages/Login";
import ArticleFormPage from "../pages/articles/ArticleFormPage";
import ArticleListPage from "../pages/articles/ArticleListPage";
import FamilleFormPage from "../pages/familles/FamilleFormPage";
import FamilleListPage from "../pages/familles/FamilleListPage";
import InitEntrepriseForm from "../pages/init_entreprise";
import Entreprise from "../pages/Entreprises/entreprises";
import Global_info_entreprise from "../pages/Entreprises/global_info_entreprise";
import Identification_entreprise from "../pages/Entreprises/identification_entreprise";
import Monnaie_formats from "../pages/Entreprises/monnaie_formats";
import Loi_anti_fraude_tva from "../pages/Entreprises/loi_anti_fraude_tva";
import Ifrs from "../pages/Entreprises/ifrs";
import Fichiers_lie from "../pages/Entreprises/fichiers_lie";
import Preferences from "../pages/Entreprises/preferences";
import LogoEtp from "../pages/Entreprises/logo";
import EntrepriseSuccess from "../pages/success_create_entreprise";
import HomeCom from "../pages/Home/home-commercial";
import HomeCompt from "../pages/Home/home-compta";
import Utilisateur from "../pages/Utilisateurs/utilisateur";
import UserSignupForm from "../pages/Utilisateurs/Inscription_utilisateur";
import ManageUser from "../pages/Utilisateurs/manage_utilisateur";
import GestionStock from "../pages/stock/GestionStock";
import ERPSystem from "../pages/ERPSystem/ERPSystem";
import InventoryListView from "../pages/inventaire/InventoryListView";
import InventoryEntryModal from "../pages/inventaire/InventoryEntryModal";
import FournisseurListPage from "../pages/fournisseur/FournisseurListPage";
import FournisseurFormPage from "../pages/fournisseur/FournisseurFormPage";
import DepotListView from "../pages/stock/DepotListView";
import ClientListPage from "../pages/clients/ClientListPage";
import ClientFormPage from "../pages/clients/ClientFormPage";
import ClientCategoryListPage from "../pages/clientCategories/ClientCategoryListPage";
import ClientCategoryFormPage from "../pages/clientCategories/ClientCategoryFormPage";
import VenteForm from "../pages/ERPSystem/vente/VenteForm";
import PaymentListPage from "../pages/ERPSystem/mode_payment/PaymentListPage";
import PaymentFormPage from "../pages/ERPSystem/mode_payment/PaymentFormPage";
import ActionTypeFormPage from "../pages/ERPSystem/Action/ActionTypeFormPage";
import ActionTypeListPage from "../pages/ERPSystem/Action/ActionTypeListPage";
import VenteStatusListPage from "../pages/ERPSystem/StatusVente/VenteStatusListPage";
import VenteStatusFormPage from "../pages/ERPSystem/StatusVente/VenteStatusFormPage";
import StockageDepot from "../pages/StockageDepot/stockage_depot";
import SdContacts from "../pages/StockageDepot/sd_contacts";
import SdEmplacements from "../pages/StockageDepot/sd_emplacements";
import Sdidentifications from "../pages/StockageDepot/sd_identification";
import SdParametre from "../pages/StockageDepot/sd_parametres";
import Sdutilisateur from "../pages/StockageDepot/sd_utilisateurs";
import GestionVentes from "../pages/ERPSystem/vente/GestionVentes";


export const routesConfig = [
  {
    path: "/inscription-entreprise",
    element: <InitEntrepriseForm />
  },
  {
    path: "/success-entreprise",
    element: <EntrepriseSuccess />
  },
  {
    path: "/home-commercial",
    element: <HomeCom />
  },
  {
    path: "/home-compta",
    element: <HomeCompt />
  },
  {
    path: "/login",
    element: <LoginForm />
  },
  {
    path: "/stockage-depot",
    element: <StockageDepot />,
    children: [
      {
        path: "contacts",
        element: <SdContacts />
      },
      {
        path: "emplacements",
        element: <SdEmplacements />
      },
      {
        path: "identification",
        element: <Sdidentifications />
      },
      {
        path: "parametre",
        element: <SdParametre />
      },
      {
        path: "utilisateur",
        element: <Sdutilisateur />
      }
    ]
  },
  {
    path: "/entreprise",
    element: <Entreprise />,
    children: [
      {
        path: "global",
        element: <Global_info_entreprise />
      },
      {
        path: "identity",
        element: <Identification_entreprise />
      },
      {
        path: "monnaie-format",
        element: <Monnaie_formats />
      },
      {
        path: "loi-anti-fraude-tva",
        element: <Loi_anti_fraude_tva />
      },
      {
        path: "ifrs",
        element: <Ifrs />
      },
      {
        path: "preference",
        element: <Preferences />
      },
      {
        path: "logo-entreprise",
        element: <LogoEtp />
      }
    ]
  },
  {
    path: "/utilisateur",
    element: <Utilisateur />,
    children: [
      {
        path: "inscription",
        element: <UserSignupForm />
      },
      {
        path: "manage",
        element: <ManageUser />
      }
    ]
  },
  // {
  //   path: "/dashboard",
  //   element: <Dashboard />,
  //   protected: true
  // }
  {
    path: "/famille/*",
    element: <FamilleListPage />
  },
  {
    path: "/famille/new",
    element: <FamilleFormPage />
  },
  {
    path: "/famille/edit/:code",
    element: <FamilleFormPage />
  },
  {
    path: "/article",
    element: <ArticleListPage />
  },
  {
    path: "/article/new",
    element: <ArticleFormPage />
  },
  {
    path: "/article/edit/:code",
    element: <ArticleFormPage />
  },
  {
    path: "/gestionstock",
    element: <GestionStock />,
  },
  {
    path: "/mouvement",
    element: <ERPSystem />,
  },
  {
    path: "/inventaire",
    element: <InventoryListView />
  },
  {
    path: "/inventaire/nouveaux",
    element: <InventoryEntryModal />
  },
  {
    path: "/fournisseur/*",
    element: <FournisseurListPage />
  },
  {
    path: "/fournisseur/new",
    element: <FournisseurFormPage />
  },
  {
    path: "/depots",
    element: <DepotListView />
  },
  {
    path: "/clients/*",
    element: <ClientListPage />
  },
  {
    path: "/clients/new",
    element: <ClientFormPage />
  },
  {
    path: "/clients-categories/*",
    element: <ClientCategoryListPage />
  },
  {
    path: "/clients-categories/new",
    element: <ClientCategoryFormPage mode="new" />
  },
  {
    path: "/clients-categories/edit/:id",
    element: <ClientCategoryFormPage mode="edit" />
  },
  {
    path: "/ventes",
    element: <GestionVentes />
  },
  {
    path: "/mode_payement/*",
    element: <PaymentListPage />
  },
  {
    path: "/mode_payement/new",
    element: <PaymentFormPage />
  },
  {
    path: "/action_type/*",
    element: <ActionTypeListPage />
  },
  {
    path: "/action_type/new",
    element: <ActionTypeFormPage mode="new" />
  },
  {
    path: "/action_type/edit/:id",
    element: <ActionTypeFormPage mode="edit" />
  },
  {
    path: "/vente_status/*",
    elements: <VenteStatusListPage />
  },
  {
    path: "/vente_status/new",
    element: <VenteStatusFormPage mode="new" />
  },
  {
    path: "/vente_status/edit/:id",
    element: <VenteStatusFormPage mode="edit" />
  }

];
