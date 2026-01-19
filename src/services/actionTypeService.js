import api from "./api";

// CREATE
export const createActionType = (data) =>
    api.post("/action-type/create", data);

// GET BY ID
export const getActionTypeById = (id) =>
    api.get(`/action-type/get/${id}`);

// UPDATE
export const updateActionType = (data, id) =>
    api.put(`/action-type/update/${id}`, data);

// DELETE
export const deleteActionType = (id) =>
    api.delete(`/action-type/delete/${id}`);

// GET ALL
export const getAllActionType = () =>
    api.get("/action-type/all");

// SEARCH (optionnel)
export const searchActionType = (data) =>
    api.post("/action-type/search", data);
