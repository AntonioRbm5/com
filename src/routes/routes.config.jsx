import LoginForm from "../pages/Login";
import ArticleFormPage from "../pages/articles/ArticleFormPage";
import ArticleListPage from "../pages/articles/ArticleListPage";
import FamilleFormPage from "../pages/familles/FamilleFormPage";
import FamilleListPage from "../pages/familles/FamilleListPage";
import InitEntrepriseForm from "../pages/init_entreprise";
import Entreprise from "../pages/Entreprises/entreprises";
import Global_info_entreprise from "../pages/Entreprises/global_info_entreprise";
import Identification_entreprise from "../pages/Entreprises/identification_entreprise";
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
    path: "/erp",
    element: <ERPSystem />,
  },
  {
    path: "/inventaire",
    element: <InventoryListView />
  },
  {
    path: "/inventaire/nouveaux",
    element: <InventoryEntryModal />
  }

];
