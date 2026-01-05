import { Routes, Route } from "react-router-dom";
import { routesConfig } from "./routes.config.jsx";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/not_found";

function renderRoutes(routes) {
  return routes.map(
    ({ path, element, protected: isProtected, children }) => (
      <Route
        key={path}
        path={path}
        element={
          isProtected ? (
            <ProtectedRoute>{element}</ProtectedRoute>
          ) : (
            element
          )
        }
      >
        {children && renderRoutes(children)}
      </Route>
    )
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {renderRoutes(routesConfig)}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
