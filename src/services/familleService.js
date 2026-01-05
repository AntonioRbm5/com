import api from "./api";

export const getAllFamilles = () => api.get("/familles/all");
export const createFamille = (data) => api.post("/familles/create", data);