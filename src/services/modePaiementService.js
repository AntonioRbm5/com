import api from "./api";

export const getAllModePaiement = () => api.get("/mode-paiement/all");
export const createModePaiement = (data) => api.post("/mode-paiement/create", data);

