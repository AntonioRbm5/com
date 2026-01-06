import LoginForm from "../pages/Login";
import ArticleFormPage from "../pages/articles/ArticleFormPage";
import ArticleListPage from "../pages/articles/ArticleListPage";
import FamilleFormPage from "../pages/familles/FamilleFormPage";
import FamilleListPage from "../pages/familles/FamilleListPage";
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
    path: "/article/*",
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
  

];
