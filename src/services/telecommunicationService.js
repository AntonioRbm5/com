import api from "./api";

export const createTelecommunication = (data) => api.post("/telecommunication/create", data)
export const getAllTelecommunication = () => api.get("/telecommunication/all")
export const getTelecommunicationSearchByEmail = (telecom_info_email) => api.get(`/telecommunication/search?telecom_info_email=${telecom_info_email}`)
export const getTelecommunicationSearchByPhone = (telecom_info_tel) => api.get(`/telecommunication/search?telecom_info_tel=${telecom_info_tel}`)
export const deleteTelecommunication = (id_telecom) => api.delete(`/telecommunication/delete/${id_telecom}`)
export const updateTelecommunication = (data, id_telecom) => api.put(`/telecommunication/update/${id_telecom}`, data)
