import api from "./api";

export const createArticleLot = (data) => api.post("/article-lot/create", data)
export const getArticleLotById = (id) => api.get(`/article-lot/get/${id}`)
export const getAllArticleLot = () => api.get("/article-lot/search")
export const getAllArticleLotByDepotId = (depot_id) => api.get(`/article-lot/search?depot_id=${depot_id}`)
export const getAllArticleLotByArticleId = (article_id) => api.get(`/article-lot/search?article_id=${article_id}`)
export const updateArticleLot = (lot_id, data) => api.put(`/article-lot/update/${lot_id}`, data) 
export const deleteArticleLot = (lot_id) => api.delete(`/article-lot/delete/${lot_id}`)