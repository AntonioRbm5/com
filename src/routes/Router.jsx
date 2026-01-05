import { Routes, Route } from "react-router-dom";
import { routesConfig } from "./routes.config.jsx";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/not_found";

export default function AppRouter() {
  return (
    <Routes>
      {routesConfig.map(({ path, element, protected: isProtected }) => (
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
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
