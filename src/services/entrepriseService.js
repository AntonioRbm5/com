import api from "./api";

export const createEntreprise = (data) => api.post("/entreprises/create", data);
export const getAllEntreprises = () => api.get("/entreprises/all");
