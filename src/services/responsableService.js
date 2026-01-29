import api from "./api";

// Responsable CRUD Operations
export const createResponsable = (data) => api.post("/responsable/create", data);
export const getAllResponsables = () => api.get("/responsable/all");
export const getResponsableById = (responsableId) => api.get(`/responsable/${responsableId}`);
export const searchResponsable = (params) => api.get("/responsable/search", { params });
export const updateResponsable = (responsableId, data) => api.put(`/responsable/update/${responsableId}`, data);
export const deleteResponsable = (responsableId) => api.delete(`/responsable/delete/${responsableId}`);