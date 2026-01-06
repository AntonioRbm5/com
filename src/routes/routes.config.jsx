import LoginForm from "../pages/Login";
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

export const routesConfig = [
  {
    path: "/inscription-entreprise",
    element: <InitEntrepriseForm />
  },
  {
    path: "/success-entreprise",
    element: <EntrepriseSuccess/>
  },
  {
    path: "/home-commercial",
    element: <HomeCom/>
  },
  {
    path: "/home-compta",
    element: <HomeCompt/>
  },
  {
    path: "/login",
    element: <LoginForm />
  },
  {
    path: "/entreprise",
    element: <Entreprise/>,
    children: [
      {
        path: "global",
        element: <Global_info_entreprise/>
      },
      {
        path: "identity",
        element: <Identification_entreprise/>
      }
    ]
  },
  {
    path: "/utilisateur",
    element: <Utilisateur/>,
    children: [
      {
        path: "inscription",
        element: <UserSignupForm/>
      },
      {
        path: "manage",
        element: <ManageUser/>
      }
    ]
  }
  // {
  //   path: "/dashboard",
  //   element: <Dashboard />,
  //   protected: true
  // }
];
