import LoginForm from "../pages/Login";
import InitEntrepriseForm from "../pages/init_entreprise";
export const routesConfig = [
  {
    path: "/inscription-entreprise",
    element: <InitEntrepriseForm />
  },
  {
    path: "/login",
    element: <LoginForm />
  },
  // {
  //   path: "/dashboard",
  //   element: <Dashboard />,
  //   protected: true
  // }
];
