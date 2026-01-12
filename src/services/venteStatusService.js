import api from 'api'
export const createVenteStatus = (data) => api.post("/vente-status/create", data)
export const getAllVenteStatus = () => api.get("/vente-status/all")
export const getVenteStatusById = (id_vente_status) => api.get(`/vente-status/get/${id_vente_status}`)
export const updateVenteStatus = (data, id_vente_status) => api.put(`/vente-status/update/${id_vente_status}`, data)
export const deleteVenteStatus = (id_vente_status) => api.delete(`/vente-status/delete/${id_vente_status}`)
export const searchVenteStatus = (vente_status_name) => api.get(`/vente-status/search/?keyword=${vente_status_name}`)
