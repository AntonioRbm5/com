import api from "./api";

export const createMoneyUnit = (data) => api.post("/money-unit/create", data);
export const getAllMoneyUnits = () => api.get("/money-unit/all");
export const updateMoneyUnit = (id, data) => api.put(`/money-unit/update/${id}`, data);
