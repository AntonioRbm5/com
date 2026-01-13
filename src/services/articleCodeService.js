import api from "./api"

export const createArticleCode = (data) => api.post('/code_type/create', data)
export const getAllArticleCode = () => api.get("/code_type/all")
export const updateArticleCode = (id, data) => api.put(`/code_type/update/${id}`, data)
export const deleteArticleCode = (id) => api.delete(`/code_type/delete/${id}`)