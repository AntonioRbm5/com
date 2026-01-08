import api from "./api";

export const getAllUnites = () => api.get("/unite/list");
export const getUniteById = (id) => api.get(`/unite/${id}`);
