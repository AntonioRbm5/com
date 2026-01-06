import { getAllUserRoles,  createUserRole, createUser} from "../services/userService"

export const getAllUserRole = async () => {
    const res = await getAllUserRoles()
    return res.data
}

export const addUserRole = async (data) => {
    const res = await createUserRole(data)
    return res.data
}

export const addUser = async (data) => {
    const res = await createUser(data)
    return res.data
}