// src/api/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


const getToken = () => {
  try {
    const auth = localStorage.getItem("tantana_auth_");
    if (!auth) return "";
    const parsed = JSON.parse(auth);
    return parsed?.access_token || "";
  } catch (error) {
    console.warn("Erreur lors de la lecture du token", error);
    return "";
  }
};



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



api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      window.location.href = "/login";
      localStorage.clear()
    }
    return Promise.reject(error);
  }
);

export default api;
