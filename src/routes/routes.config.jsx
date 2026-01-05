import LoginForm from "../pages/Login";
import InitEntrepriseForm from "../pages/init_entreprise";
import Entreprise from "../pages/Entreprises/entreprises";
import Global_info_entreprise from "../pages/Entreprises/global_info_entreprise";
import Identification_entreprise from "../pages/Entreprises/identification_entreprise";


export const routesConfig = [
  {
    path: "/inscription-entreprise",
    element: <InitEntrepriseForm />
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
  }
  // {
  //   path: "/dashboard",
  //   element: <Dashboard />,
  //   protected: true
  // }
];
