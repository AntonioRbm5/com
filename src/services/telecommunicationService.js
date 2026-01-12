import api from "./api";

export const createTelecommunication = (data) => api.post("/telecommunication/create", data)
export const getAllTelecommunication = () => api.get("/telecommunication/all")
export const getTelecommunicationSearch = (keyword) => api.get(`/telecommunication/search?keyword=${keyword}`)
// export const updateTelecommunication = (data, id_telecomm) => api.put()
