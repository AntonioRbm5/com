// // src/api/api.jsx
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// const getToken = () => {
//   try {
//     const auth = localStorage.getItem("tantana_auth_");
//     if (!auth) return "";
//     const parsed = JSON.parse(auth);
//     return parsed?.access_token || "";
//   } catch (error) {
//     console.warn("Erreur lors de la lecture du token", error);
//     return "";
//   }
// };



// api.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );



// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {

//       window.location.href = "/login";
//       localStorage.clear()
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


// src/api/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Récupère le token depuis le localStorage.
 * Essaie d'abord "tantana_auth_" puis "tantana_auth" en fallback.
 * Gère les deux structures de token possibles.
 */
const getToken = () => {
  try {
    // ── Clé principale ──
    const authPrimary = localStorage.getItem("tantana_auth_");
    if (authPrimary) {
      const parsed = JSON.parse(authPrimary);
      const token = parsed?.access_token || "";
      if (token) {
        console.debug("[API] Token récupéré depuis tantana_auth_");
        return token;
      }
    }

    // ── Fallback sur l'ancienne clé ──
    const authFallback = localStorage.getItem("tantana_auth");
    if (authFallback) {
      const parsed = JSON.parse(authFallback);
      const token = parsed?.access_token || "";
      if (token) {
        console.debug("[API] Token récupéré depuis tantana_auth (fallback)");
        return token;
      }
    }

    console.warn("[API] Aucun token trouvé dans le localStorage");
    return "";
  } catch (error) {
    console.warn("[API] Erreur lors de la lecture du token :", error);
    return "";
  }
};

// ── Intercepteur requête : injection du Bearer token ──
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Intercepteur réponse : gestion 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[API] Token expiré ou invalide — redirection vers /login");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;