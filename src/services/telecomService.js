import api from "./api";

export const createTelecom = (data) => api.post("/telecommunication/create", data);
export const getAllTelecoms = () => api.get("/telecommunication/all");
export const updateTelecom = (id, data) => api.put(`/telecommunication/update/${id}`, data);
