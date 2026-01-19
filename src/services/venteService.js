// import api from "./api";

// export const createVente = (data) => api.post("/vente/create", data)
// export const getAllVente = () => api.get("/vente/all")
// export const getVenteByID = (id_vente) => api.get(`/vente/get/${id_vente}`)
// export const updateVente = (data, id_vente) => api.put(`/vente/update/${id_vente}`, data)
// export const deleteVente = (id_vente) => api.delete(`/vente/delete/${id_vente}`)

import api from "./api";

export const createVente = (data) => api.post("/vente/create", data);
export const getAllVente = () => api.get("/vente/all");
export const getVenteByID = (id_vente) => api.get(`/vente/get/${id_vente}`);
export const updateVente = (data, id_vente) => api.put(`/vente/update/${id_vente}`, data);
export const deleteVente = (id_vente) => api.delete(`/vente/delete/${id_vente}`);
export const getVenteDetails = (id_vente) => api.get(`/vente/details/${id_vente}`);