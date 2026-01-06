import { getAllEntreprises,  createEntreprise} from "../services/entrepriseService"

export const getAllEntreprise = async () => {
    const res = await getAllEntreprises()
    return res.data
}

export const addEntreprise = async (data) => {
    const res = await createEntreprise(data)
    return res.data
}